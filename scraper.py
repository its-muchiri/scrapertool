#!/usr/bin/env python3
"""
Web scraping tool: crawls all internal pages, saves HTML + assets per page.
Uses requests + BeautifulSoup. No browser required.
"""

import argparse
import json
import logging
import os
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from threading import Lock
from typing import Optional
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup, Comment, Tag
from rich.console import Console
from rich.logging import RichHandler
from rich.progress import (
    BarColumn,
    MofNCompleteColumn,
    Progress,
    SpinnerColumn,
    TextColumn,
    TransferSpeedColumn,
)
from rich.table import Table

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
    datefmt="[%X]",
    handlers=[RichHandler(rich_tracebacks=True)],
)
log = logging.getLogger("scraper")
console = Console()

# Suppress SSL warnings
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

RESOURCE_EXTENSIONS = frozenset({
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    ".csv", ".zip", ".rar", ".7z", ".tar", ".gz",
    ".mp3", ".mp4", ".avi", ".mov", ".mkv", ".webm",
    ".wav", ".ogg", ".flac", ".dmg", ".exe", ".msi", ".apk",
})

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------

@dataclass
class ScrapingConfig:
    url: str
    output_dir: Optional[str] = None
    download_images: bool = True
    user_agent: str = HEADERS["User-Agent"]
    strip_scripts: bool = True
    strip_noscript: bool = True
    delay: float = 0.5
    max_pages: int = 0  # 0 = unlimited
    image_min_size: int = 1024
    timeout: int = 15
    max_workers: int = 8


@dataclass
class LinkCatalog:
    internal_links: list[str] = field(default_factory=list)
    external_links: list[str] = field(default_factory=list)
    resource_links: list[str] = field(default_factory=list)

    def merge(self, other: "LinkCatalog") -> None:
        self.internal_links.extend(other.internal_links)
        self.external_links.extend(other.external_links)
        self.resource_links.extend(other.resource_links)

    def to_dict(self) -> dict:
        return {
            "internal": sorted(set(self.internal_links)),
            "external": sorted(set(self.external_links)),
            "resources": sorted(set(self.resource_links)),
        }


# ---------------------------------------------------------------------------
# LinkExtractor
# ---------------------------------------------------------------------------

class LinkExtractor:
    def __init__(self, base_url: str, page_domain: str):
        self.base_url = base_url
        self.page_domain = page_domain

    def _normalise(self, href: str) -> str:
        return urljoin(self.base_url, href)

    def _classify(self, url: str) -> str:
        parsed = urlparse(url)
        ext = Path(parsed.path).suffix.lower()
        if ext in RESOURCE_EXTENSIONS:
            return "resource"
        if parsed.netloc == "" or parsed.netloc == self.page_domain:
            return "internal"
        return "external"

    def extract(self, soup: BeautifulSoup) -> LinkCatalog:
        catalog = LinkCatalog()
        seen: set[str] = set()
        for a_tag in soup.find_all("a", href=True):
            raw = a_tag["href"].strip()
            if not raw or raw.startswith(("#", "mailto:", "tel:", "javascript:")):
                continue
            normalised = self._normalise(raw)
            # strip fragment
            normalised = normalised.split("#")[0]
            if not normalised or normalised in seen:
                continue
            seen.add(normalised)
            kind = self._classify(normalised)
            getattr(catalog, f"{kind}_links").append(normalised)
        return catalog


# ---------------------------------------------------------------------------
# HTMLCleaner
# ---------------------------------------------------------------------------

class HTMLCleaner:
    TRACKING_PATTERNS = re.compile(
        r"(google-analytics|googletagmanager|gtag|fbevents|fbq|hotjar|"
        r"segment\.io|mixpanel|amplitude|fullstory|heap\.io|clarity\.ms|"
        r"pixel\.facebook|doubleclick|adsbygoogle|adsense)",
        re.IGNORECASE,
    )

    def __init__(self, config: ScrapingConfig):
        self.config = config

    def clean(self, soup: BeautifulSoup) -> BeautifulSoup:
        for comment in soup.find_all(string=lambda t: isinstance(t, Comment)):
            comment.extract()

        if self.config.strip_scripts:
            for script in soup.find_all("script"):
                src = script.get("src", "")
                inline = script.string or ""
                if self.TRACKING_PATTERNS.search(src) or self.TRACKING_PATTERNS.search(inline):
                    script.extract()
                elif not src and not inline.strip():
                    script.extract()

        if self.config.strip_noscript:
            for ns in soup.find_all("noscript"):
                ns.extract()

        return soup


# ---------------------------------------------------------------------------
# AssetDownloader
# ---------------------------------------------------------------------------

class AssetDownloader:
    """Download CSS, JS, and images into a per-page folder."""

    def __init__(self, config: ScrapingConfig, console: Console):
        self.config = config
        self.console = console
        self._img_counter = 0
        self._lock = Lock()

    def _session(self) -> requests.Session:
        s = requests.Session()
        s.headers.update({"User-Agent": self.config.user_agent})
        s.verify = False
        return s

    def download_file(self, url: str, folder: Path, sess: requests.Session) -> Optional[str]:
        """Download a single file. Returns saved filename or None."""
        try:
            if url.endswith("/") or not url.strip():
                return None
            resp = sess.get(url, timeout=self.config.timeout, stream=True)
            if resp.status_code != 200:
                log.warning("HTTP %d: %s", resp.status_code, url)
                return None
            file_name = os.path.basename(urlparse(url).path)
            if not file_name:
                return None
            file_path = folder / file_name
            with open(file_path, "wb") as f:
                for chunk in resp.iter_content(chunk_size=8192):
                    f.write(chunk)
            return file_name
        except Exception as exc:
            log.warning("Download failed %s: %s", url, exc)
            return None

    def download_image(self, url: str, images_dir: Path, sess: requests.Session) -> Optional[tuple[str, str]]:
        """Download an image into shared images/ folder. Returns (url, filename)."""
        try:
            resp = sess.get(url, timeout=self.config.timeout, stream=True)
            if resp.status_code != 200:
                return None
            ct = resp.headers.get("Content-Type", "")
            data = resp.content
            if len(data) < self.config.image_min_size:
                return None
            with self._lock:
                self._img_counter += 1
                idx = self._img_counter
            ext = Path(urlparse(url).path).suffix.lower()
            if not ext:
                ext_map = {
                    "image/jpeg": ".jpg", "image/png": ".png", "image/gif": ".gif",
                    "image/webp": ".webp", "image/svg+xml": ".svg",
                }
                ext = ext_map.get(ct.split(";")[0].strip().lower(), ".bin")
            name = f"img_{idx:04d}{ext}"
            (images_dir / name).write_bytes(data)
            return url, name
        except Exception:
            return None

    def download_page_assets(
        self, soup: BeautifulSoup, page_url: str, page_folder: Path, images_dir: Path
    ) -> dict[str, str]:
        """Download CSS, JS, and images for one page. Updates soup paths.
        Returns {original_image_url: local_image_filename}."""
        sess = self._session()
        img_mapping: dict[str, str] = {}

        # Download CSS
        for link in soup.find_all("link", rel="stylesheet"):
            href = link.get("href")
            if href:
                asset_url = urljoin(page_url, href)
                fname = self.download_file(asset_url, page_folder, sess)
                if fname:
                    link["href"] = fname

        # Download JS
        for script in soup.find_all("script", src=True):
            asset_url = urljoin(page_url, script["src"])
            fname = self.download_file(asset_url, page_folder, sess)
            if fname:
                script["src"] = fname

        # Download images
        if self.config.download_images:
            image_urls: list[str] = []
            for img in soup.find_all("img"):
                for attr in ("src", "data-src", "data-lazy-src"):
                    val = img.get(attr)
                    if val:
                        abs_url = urljoin(page_url, val.strip())
                        if not abs_url.startswith(("data:", "blob:")):
                            image_urls.append((abs_url, img, attr))
                srcset = img.get("srcset", "")
                if srcset:
                    for part in srcset.split(","):
                        tokens = part.strip().split()
                        if tokens:
                            abs_url = urljoin(page_url, tokens[0])
                            if not abs_url.startswith(("data:", "blob:")):
                                image_urls.append((abs_url, img, "srcset"))

            for srcset_url, img, attr in image_urls:
                if srcset_url in img_mapping:
                    local = img_mapping[srcset_url]
                else:
                    result = self.download_image(srcset_url, images_dir, sess)
                    if result:
                        img_mapping[srcset_url] = result[1]
                        local = result[1]
                    else:
                        continue
                if attr == "srcset":
                    # rewrite srcset
                    old_srcset = img.get("srcset", "")
                    parts = []
                    for token in old_srcset.split(","):
                        tks = token.strip().split()
                        if tks and urljoin(page_url, tks[0]) == srcset_url:
                            tks[0] = f"../images/{local}"
                        parts.append(" ".join(tks))
                    img["srcset"] = ", ".join(parts)
                else:
                    img[attr] = f"../images/{local}"

        return img_mapping


# ---------------------------------------------------------------------------
# Scraper  (main orchestrator)
# ---------------------------------------------------------------------------

class Scraper:
    def __init__(self, config: ScrapingConfig):
        self.config = config
        self.parsed = urlparse(config.url)
        self.domain = self.parsed.netloc
        self.base_url = f"{self.parsed.scheme}://{self.domain}"
        self.output_dir = self._resolve_output_dir()
        self.all_links = LinkCatalog()
        self.errors: list[str] = []
        self._visited: set[str] = set()
        self._img_mapping: dict[str, str] = {}
        self._pages: list[dict] = []

    def _resolve_output_dir(self) -> Path:
        if self.config.output_dir:
            return Path(self.config.output_dir)
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_domain = re.sub(r"[^\w.-]", "_", self.domain)
        return Path(f"output_{safe_domain}_{ts}")

    def _url_to_folder(self, url: str) -> Path:
        """Convert URL path to a local folder path."""
        parsed = urlparse(url)
        path = parsed.path.strip("/")
        if not path:
            return self.output_dir
        # Replace unsafe chars
        safe = re.sub(r"[^\w\-/]", "_", path)
        return self.output_dir / safe

    def _scrape_page(self, url: str, cleaner: HTMLCleaner, downloader: AssetDownloader) -> None:
        if url in self._visited:
            return
        self._visited.add(url)

        log.info("Scraping: %s", url)

        sess = requests.Session()
        sess.headers.update({"User-Agent": self.config.user_agent})
        sess.verify = False

        try:
            resp = sess.get(url, timeout=self.config.timeout)
            if resp.status_code != 200:
                log.warning("HTTP %d: %s", resp.status_code, url)
                self.errors.append(f"HTTP {resp.status_code}: {url}")
                return
        except Exception as exc:
            log.error("Fetch failed %s: %s", url, exc)
            self.errors.append(f"{url}: {exc}")
            return

        soup = BeautifulSoup(resp.content, "html.parser")

        # Extract links BEFORE cleaning
        link_extractor = LinkExtractor(url, self.domain)
        catalog = link_extractor.extract(soup)
        self.all_links.merge(catalog)

        # Clean DOM
        soup = cleaner.clean(soup)

        # Create per-page folder
        page_folder = self._url_to_folder(url)
        page_folder.mkdir(parents=True, exist_ok=True)

        # Download assets + images, rewrite paths in soup
        downloader.download_page_assets(
            soup, url, page_folder, self.output_dir / "images"
        )

        # Save HTML
        html_path = page_folder / "index.html"
        html_path.write_text(str(soup), encoding="utf-8")

        # Page title
        title_tag = soup.find("title")
        title = title_tag.get_text(strip=True) if title_tag else ""
        rel_path = str(page_folder.relative_to(self.output_dir))
        self._pages.append({
            "url": url,
            "title": title,
            "folder": rel_path,
        })

        # Recurse into internal links
        for link in catalog.internal_links:
            if link not in self._visited:
                self._scrape_page(link, cleaner, downloader)

    def _build_index(self) -> str:
        rows = ""
        for i, p in enumerate(self._pages, 1):
            folder = p["folder"]
            title = p["title"] or folder
            rows += (
                f'<tr><td>{i}</td>'
                f'<td><a href="{folder}/index.html">{title}</a></td>'
                f'<td><a href="{p["url"]}" target="_blank">{p["url"]}</a></td></tr>\n'
            )
        return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Scraped Pages - {self.domain}</title>
<style>
  body {{ font-family: system-ui, sans-serif; max-width: 960px; margin: 2rem auto; padding: 0 1rem; background: #fafafa; }}
  h1 {{ color: #1a1a2e; }}
  table {{ border-collapse: collapse; width: 100%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }}
  th, td {{ border: 1px solid #ddd; padding: 0.5rem 0.75rem; text-align: left; }}
  th {{ background: #1a1a2e; color: #fff; }}
  tr:nth-child(even) {{ background: #f9f9f9; }}
  a {{ color: #0066cc; text-decoration: none; }}
  a:hover {{ text-decoration: underline; }}
  .stats {{ color: #666; margin: 1rem 0; }}
</style>
</head>
<body>
<h1>Scraped Pages - {self.domain}</h1>
<p class="stats">{len(self._pages)} pages scraped at {datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")}</p>
<table>
<tr><th>#</th><th>Page</th><th>Original URL</th></tr>
{rows}
</table>
</body>
</html>"""

    def run(self) -> Path:
        console.rule(f"[bold green]Crawling {self.base_url}")
        t0 = time.perf_counter()

        self.output_dir.mkdir(parents=True, exist_ok=True)
        (self.output_dir / "images").mkdir(parents=True, exist_ok=True)

        cleaner = HTMLCleaner(self.config)
        downloader = AssetDownloader(self.config, console)

        seed = self.config.url
        if not seed.endswith("/") and not urlparse(seed).path:
            seed += "/"

        with Progress(
            SpinnerColumn(),
            TextColumn("[bold blue]{task.description}"),
            BarColumn(),
            MofNCompleteColumn(),
            console=console,
        ) as progress:
            task = progress.add_task("Scraping pages...", total=None)
            self._scrape_recursive(seed, cleaner, downloader, progress, task)

        # Write outputs
        console.print("[cyan]Writing global outputs...")

        (self.output_dir / "index.html").write_text(
            self._build_index(), encoding="utf-8"
        )

        (self.output_dir / "links.json").write_text(
            json.dumps(self.all_links.to_dict(), indent=2, ensure_ascii=False),
            encoding="utf-8",
        )

        manifest = {
            "seed_url": self.config.url,
            "domain": self.domain,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "stats": {
                "pages_scraped": len(self._pages),
                "internal_links": len(set(self.all_links.internal_links)),
                "external_links": len(set(self.all_links.external_links)),
                "resource_links": len(set(self.all_links.resource_links)),
                "images_downloaded": downloader._img_counter,
            },
            "errors": self.errors,
        }
        (self.output_dir / "manifest.json").write_text(
            json.dumps(manifest, indent=2, ensure_ascii=False),
            encoding="utf-8",
        )

        elapsed = time.perf_counter() - t0
        self._print_summary(elapsed)
        return self.output_dir

    def _scrape_recursive(self, url, cleaner, downloader, progress, task):
        if url in self._visited:
            return
        if self.config.max_pages and len(self._visited) >= self.config.max_pages:
            return
        self._visited.add(url)
        progress.update(task, description=f"[{len(self._visited)}] {urlparse(url).path[:50]}")

        log.info("Scraping: %s", url)

        sess = requests.Session()
        sess.headers.update({"User-Agent": self.config.user_agent})
        sess.verify = False

        try:
            resp = sess.get(url, timeout=self.config.timeout)
            if resp.status_code != 200:
                self.errors.append(f"HTTP {resp.status_code}: {url}")
                return
        except Exception as exc:
            self.errors.append(f"{url}: {exc}")
            return

        soup = BeautifulSoup(resp.content, "html.parser")

        link_extractor = LinkExtractor(url, self.domain)
        catalog = link_extractor.extract(soup)
        self.all_links.merge(catalog)

        soup = cleaner.clean(soup)

        page_folder = self._url_to_folder(url)
        page_folder.mkdir(parents=True, exist_ok=True)

        downloader.download_page_assets(
            soup, url, page_folder, self.output_dir / "images"
        )

        html_path = page_folder / "index.html"
        html_path.write_text(str(soup), encoding="utf-8")

        title_tag = soup.find("title")
        title = title_tag.get_text(strip=True) if title_tag else ""
        rel_path = str(page_folder.relative_to(self.output_dir))
        self._pages.append({"url": url, "title": title, "folder": rel_path})

        if self.config.delay:
            time.sleep(self.config.delay)

        for link in catalog.internal_links:
            if link not in self._visited:
                if self.config.max_pages and len(self._visited) >= self.config.max_pages:
                    break
                self._scrape_recursive(link, cleaner, downloader, progress, task)

    def _print_summary(self, elapsed: float) -> None:
        table = Table(title="Crawl Summary", show_header=True,
                      header_style="bold magenta")
        table.add_column("Metric", style="cyan")
        table.add_column("Value", justify="right", style="green")
        table.add_row("Seed URL", self.config.url)
        table.add_row("Output Dir", str(self.output_dir))
        table.add_row("Pages Scraped", str(len(self._pages)))
        table.add_row("Internal Links", str(len(set(self.all_links.internal_links))))
        table.add_row("External Links", str(len(set(self.all_links.external_links))))
        table.add_row("Resource Links", str(len(set(self.all_links.resource_links))))
        table.add_row("Errors", str(len(self.errors)))
        table.add_row("Elapsed", f"{elapsed:.1f}s")
        console.print()
        console.print(table)
        console.rule("[bold green]Done")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="scraper",
        description="Crawl a website, saving HTML + CSS/JS/images per page.",
    )
    parser.add_argument("--url", required=True, help="Seed URL")
    parser.add_argument("--output", default=None, help="Custom output directory")
    parser.add_argument("--max-pages", type=int, default=0,
                        help="Max pages to crawl (0 = unlimited)")
    parser.add_argument("--delay", type=float, default=0.5,
                        help="Seconds between requests (default: 0.5)")
    parser.add_argument("--no-images", action="store_true",
                        help="Skip image download")
    parser.add_argument("--user-agent", default=None, help="Custom User-Agent")
    parser.add_argument("--keep-scripts", action="store_true",
                        help="Do NOT strip tracking scripts")
    parser.add_argument("--keep-noscript", action="store_true",
                        help="Do NOT strip <noscript> tags")
    parser.add_argument("--timeout", type=int, default=15,
                        help="Request timeout in seconds")
    parser.add_argument("-v", "--verbose", action="store_true",
                        help="Debug logging")
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.verbose:
        logging.getLogger("scraper").setLevel(logging.DEBUG)

    config = ScrapingConfig(
        url=args.url,
        output_dir=args.output,
        download_images=not args.no_images,
        max_pages=args.max_pages,
        delay=args.delay,
        user_agent=args.user_agent or HEADERS["User-Agent"],
        strip_scripts=not args.keep_scripts,
        strip_noscript=not args.keep_noscript,
        timeout=args.timeout,
    )

    scraper = Scraper(config)
    scraper.run()


if __name__ == "__main__":
    main()
