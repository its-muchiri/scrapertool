let loginLoaded = false;

function openLoginBox() {
	// detect if custumer is logged in
	var custidEl = document.getElementById('custid');
	var custid = custidEl ? custidEl.value : 0;
	if (custid != 0) {
		if (typeof showForm === 'function') {
			showForm('timer', 'timer-inner');
		}
		var domainEl = document.getElementById('domain_name');
		var langEl = document.getElementById('lang_selected');
		var domain = domainEl ? domainEl.value : window.location.hostname;
		var lang = langEl ? langEl.value.toLowerCase() : 'english';
		var uri = lang != 'english'
			? 'https://' + domain + '/' + lang
			: 'https://' + domain;
		window.location.href = uri + '/account/acc_main.php';
	} else {
		const lang = document.getElementById('lang_selected').value;
		if (loginLoaded) {
			resetLoginBox();
			initLoginInputs();
			showLoginBox();
			return;
		}
		fetch('/includes/inc/login-box.php?lang=' + encodeURIComponent(lang), {
			method: 'GET',
			credentials: 'same-origin'
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('Login box failed to load');
			}
			return response.text();
		})
		.then(html => {
			document.getElementById('login-placeholder').innerHTML = html;
			loginLoaded = true;
			resetLoginBox();
			initLoginInputs();
			showLoginBox();
		})
		.catch(error => {
			console.error(error);
		});
	}
}

function resetLoginBox() {
  setDisplay('pwd2_inp', 'block');
  setDisplay('login_div3', 'block');
  setDisplay('login_div1', 'block');
  setDisplay('login_div2', 'block');
  setDisplay('login_div4', 'none');
}

function setDisplay(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = value;
  }
}

function showLoginBox() {
  document.getElementById('login-div').style.display = 'block';
  document.getElementById('login-cont').style.display = 'block';
}

function initLoginInputs() {

	if (document.getElementById('firstname')) {
		val = document.getElementById('firstname').value;

		if (val != '') {
			SetLabelsGreen();
		}
	}

	const inputFields = document.querySelectorAll('.ca_inputs');

	inputFields.forEach(function(inputField) {

		// prevent duplicate listeners
		if (inputField.dataset.eventsLoaded == '1') {
			return;
		}

		inputField.dataset.eventsLoaded = '1';

		inputField.addEventListener('blur', handleBlur);

		inputField.addEventListener('click', handleClickOrFocus);

		inputField.addEventListener('focus', handleClickOrFocus);

		inputField.addEventListener('input', function(event) {

			const inputValue = event.target.value;

			if (inputValue.length === 3 && event.target.id != 'pwd') {

				eid_lbl = 'lbl_' + event.target.id;

				$('#' + eid_lbl).removeClass("lbl_nor").addClass("lbl_sel2");

				document.getElementById(eid_lbl).style.color = 'rgb(0, 121, 107)';

				event.target.style.borderColor = "rgb(0, 121, 107)";

				errid = event.target.id + '_err';

				document.getElementById(errid).style.display = 'none';
			}

			if (inputValue.length === 8 && event.target.id == 'pwd') {

				eid_lbl = 'lbl_' + event.target.id;

				$('#' + eid_lbl).removeClass("lbl_nor").addClass("lbl_sel2");

				document.getElementById(eid_lbl).style.color = 'rgb(0, 121, 107)';

				event.target.style.borderColor = "rgb(0, 121, 107)";

				errid = event.target.id + '_err';

				document.getElementById(errid).style.display = 'none';
			}
		});
	});
}

let newsletterLoaded = false;

function showNewsletterPopup() {
	const langInput = document.getElementById('lang_selected');
	const lang = langInput ? langInput.value : 'English';

	if (newsletterLoaded) {
		const popup = document.querySelector('.newsletter-popup');
		if (popup) {
			popup.classList.add('is-active');
			document.body.style.overflow = 'hidden';

			const emailInput = popup.querySelector('.newsletter-input');
			if (emailInput) {
				setTimeout(() => emailInput.focus(), 100);
			}
		}
		return;
	}

	fetch('/includes/inc/nl-box.php?lang=' + encodeURIComponent(lang))
		.then(response => response.text())
		.then(html => {
			const wrapper = document.createElement('div');
			wrapper.id = 'newsletter-popup-wrapper';
			wrapper.innerHTML = html;

			document.body.appendChild(wrapper);

			const popup = document.querySelector('.newsletter-popup');

			if (popup) {
				hideForm('timer', 'timer-inner');
				popup.classList.add('is-active');
				document.body.style.overflow = 'hidden';
				newsletterLoaded = true;

				const emailInput = popup.querySelector('.newsletter-input');
				if (emailInput) {
					setTimeout(() => emailInput.focus(), 100);
				}
			}
		})
		.catch(error => {
			console.error('Newsletter popup load failed:', error);
		});
}

function hideNewsletterPopup() {
	const popup = document.querySelector('.newsletter-popup');

	if (!popup) return;

	popup.classList.remove('is-active');
	document.body.style.overflow = '';

	clearNewsletterPopup();
}

function clearNewsletterPopup() {
	const popup = document.querySelector('.newsletter-popup');

	if (!popup) return;

	const input = popup.querySelector('.newsletter-input');
	const error = popup.querySelector('.newsletter-error');
	const message = popup.querySelector('.newsletter-message');

	if (input) {
		input.value = '';
		input.classList.remove('input-error');
	}

	if (error) {
		error.style.display = 'none';
	}

	if (message) {
		message.style.display = 'none';
		message.innerHTML = '';
	}
}

function closeNewsletterPopup(event) {
	if (event.target.classList.contains('newsletter-popup')) {
		hideNewsletterPopup();
	}
}

document.addEventListener('DOMContentLoaded', function () {
	const clickContainers = [
		document.getElementById('nmm_26'),
		document.getElementById('help__menu')
	];
	clickContainers.forEach(function(container) {
		if (!container) return;
		container.addEventListener('click', function (e) {
			const link = e.target.closest('a');
			if (!link) return;
			const href = link.getAttribute('href') || '';
			/* skip javascript links */
			if (href.startsWith('javascript:')) {
				return;
			}
			e.preventDefault();
			showForm('timer', 'timer-inner');
			setTimeout(function () {
				window.location.href = link.href;
			}, 120);
		});
	});
});