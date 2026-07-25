//****************************************************************************************
// javscript smoothscroll
function currentYPosition() {
	// Firefox, Chrome, Opera, Safari
	if (self.pageYOffset) return self.pageYOffset;
	// Internet Explorer 6 - standards mode
	if (document.documentElement && document.documentElement.scrollTop)
			return document.documentElement.scrollTop;
	// Internet Explorer 6, 7 and 8
	if (document.body.scrollTop) return document.body.scrollTop;
	return 0;
}

function elmYPosition(eID) {
	var elm = document.getElementById(eID);
	var y = elm.offsetTop;
	var node = elm;
	while (node.offsetParent && node.offsetParent != document.body) {
			node = node.offsetParent;
			y += node.offsetTop;
	} return y;
}

function smoothScroll(eID) {
	curr_u = window.location.href;
	var str = "#top";
	curr_u = curr_u.replace("#top", "");
	history.pushState({}, null, curr_u);
	console.log(curr_u);

	var startY = currentYPosition();
	var stopY = elmYPosition(eID);
	var distance = stopY > startY ? stopY - startY : startY - stopY;
	if (distance < 100) {
			scrollTo(0, stopY); return;
	}
	var speed = Math.round(distance / 100);
	if (speed >= 35) speed = 35;
	var step = Math.round(distance / 25);
	var leapY = stopY > startY ? startY + step : startY - step;
	var timer = 0;
	if (stopY > startY) {
			for ( var i=startY; i<stopY; i+=step ) {
					setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
					leapY += step; if (leapY > stopY) leapY = stopY; timer++;
			} return;
	}
	for ( var i=startY; i>stopY; i-=step ) {
			setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
			leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
	}
}

//****************************************************************************************

function SetCh() {
	h = document.getElementsByClassName('lac');
	for (var z = 0; z < h.length; z++) {
		h[z].style.backgroundColor = '';
	}
	radios = document.getElementsByTagName('input');
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].type === 'radio' && radios[i].checked) {
			id = radios[i].id;
			no = id.substring(2);
			l_id = 'lc' + no;
			document.getElementById(l_id).style.backgroundColor = "yellow";
		}
	}
}

function hes_val() {
	anchor_1 = '';
	gr = document.getElementsByName('RG_1');
	for (i=0; i < gr.length; i++) {
		if (gr[i].checked == true) {
			v1 = gr[i].value;
		}
	}
	gr2 = document.getElementsByName('RG_2');
	for (i=0; i < gr2.length; i++) {
		if (gr2[i].checked == true) {
			v2 = gr2[i].value;
		}
	}
	gr3 = document.getElementsByName('RG_3');
	for (i=0; i < gr3.length; i++) {
		if (gr3[i].checked == true) {
			v3 = gr3[i].value;
		}
	}
	anchor_1 = v1 + v2 + v3;
	console.log(anchor_1);
	smoothScroll(anchor_1);
}

function Gtop() {
	$('html, body').animate({ scrollTop: 250 }, 'fast');
}