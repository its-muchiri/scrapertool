# Web Scraper Tool

Modular Python web scraping tool that extracts rendered HTML, integrated CSS, images/media, and links from target websites. Outputs clean, structured data into a local directory.

## Features

- **Dynamic Rendering** — Playwright headless browser handles JS, SPAs, and lazy-loaded content with auto-scroll
- **CSS Extraction** — Consolidates inline `<style>` and external `<link>` stylesheets with resolved relative URLs
- **Image Pipeline** — Downloads from `<img>`, `<picture>`, `srcset`, CSS `background-image`, and lazy-load attributes; filters tracking pixels by size
- **Link Categorisation** — Internal, external, and resource (PDF/media) links saved to `links.json`
- **DOM Cleaning** — Strips tracking scripts, analytics, `<noscript>`, and empty wrapper elements
- **Rich CLI** — Progress bars, colour-coded logging, and a summary table

## Setup

### Prerequisites

- Python 3.10+
- pip

### Install

```bash
pip install -r requirements.txt
```

### Install Playwright Browsers

```bash
playwright install chromium
```

On Windows you may also need:

```bash
playwright install-deps
```

## Usage

### Basic

```bash
python scraper.py --url https://example.com
```

### Custom output directory

```bash
python scraper.py --url https://example.com --output ./my_snapshot
```

### Skip image downloads

```bash
python scraper.py --url https://example.com --no-images
```

### Custom user-agent

```bash
python scraper.py --url https://example.com --user-agent "MyBot/1.0"
```

### Keep scripts and noscript tags

```bash
python scraper.py --url https://example.com --keep-scripts --keep-noscript
```

### Debug mode

```bash
python scraper.py --url https://example.com -v
```

### All options

| Flag | Description |
|---|---|
| `--url` | Target URL (required) |
| `--output` | Custom output directory |
| `--no-images` | Skip image/media download |
| `--user-agent` | Custom User-Agent string |
| `--keep-scripts` | Do NOT strip tracking scripts |
| `--keep-noscript` | Do NOT strip `<noscript>` tags |
| `--headed` | Show browser window |
| `--max-scrolls` | Max auto-scroll iterations (default: 25) |
| `--min-image-size` | Min image size in bytes to keep (default: 1024) |
| `-v, --verbose` | Debug logging |

## Output Structure

Each run creates a timestamped directory per domain:

```
output_example.com_20260725_143021/
├── index.html          # Cleaned DOM with local image references
├── styles.css          # Combined & resolved CSS
├── links.json          # Categorised link catalog
├── manifest.json       # Scraping metadata and stats
└── images/             # Downloaded assets
    ├── img_0001.jpg
    ├── img_0002.png
    └── img_0003.svg
```

## Architecture

```
scraper.py
├── ScrapingConfig        # All configuration in one dataclass
├── LinkExtractor         # Extracts and categorises hyperlinks
├── StylesheetExtractor   # Consolidates CSS with resolved URLs
├── HTMLCleaner           # Removes tracking scripts and noise
├── AssetDownloader       # Async image/media downloads via aiohttp
└── Scraper               # Main orchestrator (Playwright + pipeline)
```

## License

MIT
