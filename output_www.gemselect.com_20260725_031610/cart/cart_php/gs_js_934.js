// GemSelect JavaScript 
// March-07-2016

/*jshint -W069 */
// toggle function / show, hide and highlighting the clickable element
function show(element_show, element_highlight) {
	var status = document.getElementById(element_show).style.display;
	if (status == 'none') {
		// hide all open container div's at first
		var n = document.getElementsByClassName("hide_div");
		for (var i = 0; i < n.length; i++) {
			n[i].style.display = 'none';
		}
		var k = document.getElementsByClassName("no_color");
		for (i = 0; i < k.length; i++) {
			k[i].style.backgroundColor = '';
			k[i].style.fontWeight = 'normal';
		}
		document.getElementById(element_show).style.display = '';
		document.getElementById(element_highlight).style.backgroundColor = "#E6FFE6";
		document.getElementById(element_highlight).style.fontWeight = 'bold';
	} else {
		document.getElementById(element_show).style.display = 'none';
		document.getElementById(element_highlight).style.backgroundColor = "";
		document.getElementById(element_highlight).style.fontWeight = 'normal';
	}
}

// sett all checkboxes to "checked" for elements with the same "name" 
function checkRadio(name) {
	var x = document.getElementsByName(name);
	for (var i = 0; i < x.length; i++) {
		if (x[i].type == "checkbox") {
			x[i].checked = true;
		}
	}
}
// remove "checked" from all checkboxes with the same "name" 
function uncheckRadio(name) {
	var x = document.getElementsByName(name);
	var i;
	for (i = 0; i < x.length; i++) {
		if (x[i].type == "checkbox") {
			x[i].checked = false;
		}
	}
}
// send the number of items to be displayed on one page to the script "content_gem_multiple.php"
function pageItems(count, uri) {
	var url = uri + '?items=' + count;
	RecURL(url,'pageItems');
	window.open(url, "_self");
}
// handles "All Items" button in script "content_gem_multiple.php" (Pager, Number of items diaplayed)
function allItems() {
	var height = document.getElementById('items_perpage').style.height;
	//JSmessage(height);
	if (height == '20px') {
		document.getElementById('items_perpage').style.height = '100%';
		document.getElementById('show_all').innerHTML = 'Hide';
	} else {
		document.getElementById('items_perpage').style.height = '20px';
		document.getElementById('show_all').innerHTML = 'Show All';
	}
}

function sendAjax(URL_address, dataset, target) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL_address,
		data: dataset,
		dataType: "json",
		success: function(data) {
			element = document.getElementById(target);
			if (data.suggest == 'ok') {
				if (document.getElementById('view_h')) {
					v_height = document.getElementById('view_h').value + 'px';
					document.getElementById('sugg_result').style.height = v_height;
				}
				document.getElementById('sugg_result').style.display = 'block';
				if (document.getElementById('x')) {
					document.getElementById('x').style.display = 'inline-block';
				}
				element.innerHTML = data.html;
				if (document.getElementsByClassName("p_lab")) {
					var n = document.getElementsByClassName("p_lab");
					for (var i = 0; i < n.length; i++) {
						n[i].style.right = "18px";
					}
				}
				document.getElementById('sugg_result').style.overflow = 'scroll';
			}
			if (data.suggest == 'no') {
				document.getElementById('sugg_result').style.display = 'none';
				element.innerHTML = '';
			}
		},
		error: function() {
			//JSmessage("Error");
		}
	});
}

function moveSuggestResult() {
	const sugg = document.getElementById('sugg_result');
	const desktopSlot = document.getElementById('desktop-sugg-slot');
	const mobileSlot = document.getElementById('mobile-sugg-slot');
	if (!sugg) return;
	const target = window.innerWidth < 800 ? mobileSlot : desktopSlot;
	if (!target) {
		//console.log('Target slot missing');
		return;
	}
	if (sugg.parentElement !== target) {
		target.appendChild(sugg);
	}
}

document.addEventListener('DOMContentLoaded', moveSuggestResult);
window.addEventListener('resize', moveSuggestResult);

moveSuggestResult();
window.addEventListener('resize', moveSuggestResult);

const all = document.querySelectorAll('#sugg_result');

if (all.length > 1) {
	all.forEach((el, index) => {
		if (index > 0 && el.innerHTML.trim() === '') {
			el.remove();
		}
	});
}

function sendAjaxSearch(URL_address, dataset, target) {
	//JSmessage(URL_address);
	//JSmessage(dataset);
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL_address,
		data: dataset,
		dataType: "json",
		success: function(data) {
			hideForm('timer', 'timer-inner');
			element = document.getElementById(target);
			check = typeof data.go_to_url;

			if (check !== 'undefined') {
				url = data.go_to_url;
				RecURL(url,'sendAjaxSearch');
				window.open(url, "_self");
			} else {
				if (data.url !== 0) {
					url = data.url;
					RecURL(url,'sendAjaxSearch');
					window.open(url, "_self");
				}
				if (data.url == 0) {
					JSmessage('No matches Found!');
					document.getElementById('sugg_result').style.display = 'none';
					element.innerHTML = '';
				}
			}
		},
		error: function() {
			//JSmessage("Error");
		}
	});
}

//***************************************************************************************************
// start menu functions

function sortByCall() {
	// hide all open container div's
	var n = document.getElementsByClassName("hide_div");
	for (var i = 0; i < n.length; i++) {
		n[i].style.display = 'none';
	}
	var k = document.getElementsByClassName("no_color");
	for (i = 0; i < k.length; i++) {
		k[i].style.backgroundColor = '';
	}

	sort_by = document.getElementById('sortby').value;
	c_uri = window.location.search;
	// clear old sor selection
	c_uri = ClearOldSort(c_uri);
	uri_p = document.getElementById('uri_path').value;
	new_uri = '/' + uri_p + c_uri + '&' + sort_by + '=1';
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'sortByCall');
	window.open(new_uri, '_self');
}

function sortByCall_2() {
	// hide all open container div's
	var n = document.getElementsByClassName("hide_div");
	for (var i = 0; i < n.length; i++) {
		n[i].style.display = 'none';
	}
	var k = document.getElementsByClassName("no_color");
	for (i = 0; i < k.length; i++) {
		k[i].style.backgroundColor = '';
	}

	sort_by = document.getElementById('sortby').value;
	c_uri = window.location.search;
	// clear old sor selection
	c_uri = ClearOldSort(c_uri);
	uri_p = document.getElementById('uri_path').value;
	if (c_uri != '') {
		new_uri = '/' + uri_p + c_uri + '&' + sort_by + '=1';
	} else {
		new_uri = '/' + uri_p + '?' + sort_by + '=1';
	}
	if (sort_by == 'default') {
		new_uri = '/' + uri_p;
	}
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'sortByCall_2');
	window.open(new_uri, '_self');
}

function GetCatURL() {
	cat_cms = document.getElementById('gems_in_cat').value;
	openSubSelect(cat_cms);
}

function ClearOldSort(c_uri) {
	c_uri = removeURLParameter(c_uri, 'price_desc');
	c_uri = removeURLParameter(c_uri, 'price_asc');
	c_uri = removeURLParameter(c_uri, 'size_desc');
	c_uri = removeURLParameter(c_uri, 'size_asc');
	c_uri = removeURLParameter(c_uri, 'weight_desc');
	c_uri = removeURLParameter(c_uri, 'weight_asc');
	c_uri = removeURLParameter(c_uri, 'no');
	return c_uri;
}

function gemMenu(URL, value, spl, e) {
	// spl contains single, pair, lots, faceted or cab
	// e checks the target, example "[object HTMLDivElement]"
	// test checkbox status based on who is clicking and set the checkbox
	//JSmessage(e.target);

	if (spl == 'cab') {
		document.getElementById('facet').checked = false;
	}
	if (spl == 'facet') {
		document.getElementById('cab').checked = false;
	}

	if (spl == 'single') {
		document.getElementById('pair').checked = false;
		document.getElementById('lot').checked = false;
	}
	if (spl == 'lot') {
		document.getElementById('single').checked = false;
		document.getElementById('pair').checked = false;
	}
	if (spl == 'pair') {
		document.getElementById('single').checked = false;
		document.getElementById('lot').checked = false;
	}

	if (e.target == '[object HTMLInputElement]' || e.srcElement == '[object HTMLInputElement]') {
		// do nothing
	} else {
		if (spl !== '') {
			check_test = document.getElementById(spl).checked;
			if (check_test == false) {
				document.getElementById(spl).checked = true;
			} else {
				document.getElementById(spl).checked = false;
			}
		}
	}

	var gem_types = '';
	var items = '';
	val = value.split("=");
	var var_condition = val[0];
	var var_value = val[1];

	// items per page switch
	if (var_condition == 'items') {
		items = '&items=' + var_value;
	}

	// gem-type filter
	//JSmessage(var_condition);
	if (var_condition == 'g_type') {
		gem_types = '&g_type=' + var_value;
		// g_type_sel = 1; means the referal link is from the top left hand side gem-type menu with gem-count
		//g_type_sel = 1;
	} else {
		gem_types = gemTypes();
	}
	// gem-color filter
	gem_colors = '';
	if (var_condition == 'color') {
		// testing, chenged base_color to color only
		gem_colors = '&color=' + var_value;
	} else {
		gem_colors = gemColors();
	}
	// gem-base_color filter
	gem_base_colors = '';
	if (var_condition == 'base_color') {
		// testing, chenged base_color to color only
		gem_base_colors = '&base_color=' + var_value;
	} else {
		gem_base_colors = gemBaseColors();
	}
	// gem-detail-color filter
	if (var_condition == 'color_detail') {
		color_details = '&color_detail=' + var_value;
	} else {
		color_details = gemColorsDetail();
	}

	// gem-shape filter
	if (var_condition == 'shape') {
		gem_shapes = '&base_shape=' + var_value;
	} else {
		gem_shapes = gemShapes();
	}
	// gem-shape filter (detail shape)
	if (var_condition == 'shape_det') {
		shapes_det = '&shape=' + var_value;
	} else {
		shapes_det = gemShapesDet();
	}

	gem_size = gemSize();
	/*
	if (gem_size == '') {
		alert('Please provide size');
		document.getElementById('size_length').focus();
		return;
	}
	*/
	gem_countries = gemCountry();
	gem_style = gemStyles();
	gem_drilled = gemDrilled();

	// top menu / single, pair, lots...	
	spl = '';
	spls = '';
	var top = document.getElementsByName("top_select");
	for (var i = 0; i < top.length; i++) {
		if (top[i].type == "checkbox") {
			if (top[i].checked == true) {
				var top_check = top[i].value;
				if (top_check == 'single' || top_check == 'pair' || top_check == 'lot' || top_check == 'by_pcs') {
					spls += top_check + "','";
				}
			}
		}
	}
	if (spls !== '') {
		spls = spls.substring(0, spls.length - 3);
		spls = '&spl=' + spls;
	} else {
		spls = '';
	}

	// top menu / faceted, cab
	var faceted = '';
	f = '';
	if (document.getElementById('facet')) {
		f = document.getElementById('facet').checked;
	}
	if (f == true) {
		faceted = '&facet=facet';
	}
	var cab = '';
	ca = '';
	if (document.getElementById('cab')) {
		ca = document.getElementById('cab').checked;
	}
	if (ca == true) {
		cab = '&cab=cabochon';
	}

	min_weight = '';
	if (document.getElementById('weight_min')) {
		min_weight = document.getElementById('weight_min').value;
	}
	// check if id="weight" div is visable at first
	if (document.getElementById('weight')) {
		weight_style = document.getElementById('weight').style.display;
		if (weight_style !== 'none') {
			if (min_weight == '') {
				JSmessage('Please enter a minimum weight');
				document.getElementById('weight_min').focus();
				document.getElementById('weight_min').style.backgroundColor = "#FFE8E8";
				return;
			}
		}
		max_weight = '';
		if (document.getElementById('weight_max')) {
			max_weight = document.getElementById('weight_max').value;
		}
		// check if id="weight" div is visable at first
		weight_style = document.getElementById('weight').style.display;
		if (weight_style !== 'none') {
			if (max_weight == '') {
				JSmessage('Please enter a maximum weight');
				document.getElementById('weight_min').style.backgroundColor = "";
				document.getElementById('weight_max').focus();
				document.getElementById('weight_max').style.backgroundColor = "#FFE8E8";
				return;
			}
		}
		if (max_weight < min_weight) {
			max_weight = document.getElementById('weight_min').value;
			min_weight = document.getElementById('weight_max').value;
		}
		show_weight = document.getElementById('weight').style.display;
	} else {
		show_weight = 'none';
	}

	var gem_weight = gemWeight();
	if (show_weight !== 'none') {
		if (gem_weight == 'empty') {
			JSmessage('Input is Empty!');
			document.getElementById('weight_min').style.backgroundColor = "#FFE8E8";
			document.getElementById('weight_min').focus();
			document.getElementById('weight_max').value = '';
			return;
		}
		if (gem_weight == 'numeric') {
			JSmessage('Please enter numbers only!');
			document.getElementById('weight_min').value = '';
			document.getElementById('weight_min').style.backgroundColor = "#FFE8E8";
			document.getElementById('weight_min').focus();
			return;
		}
		if (gem_weight == 'numeric_2') {
			JSmessage('Please enter numbers only!');
			document.getElementById('weight_max').value = '';
			document.getElementById('weight_max').style.backgroundColor = "#FFE8E8";
			document.getElementById('weight_max').focus();
			return;
		}
	}
	if (gem_weight == 'empty') {
		gem_weight = '';
	}

	// get date value for asc or desc
	date_sort = '';
	hh = document.getElementsByName('datesort');
	d_s = '';
	for (i = 0; i < hh.length; i++) {
		if (hh[i].type == "radio") {
			if (hh[i].checked == true) {
				d_s = hh[i].value;
				date_sort = '&d_sort=' + d_s;
			}
			if (d_s == 'no') {
				date_sort = '';
			}
		}
	}

	//clarity options
	clarity_sel = '';
	hh = document.getElementsByName('clarity');
	for (i = 0; i < hh.length; i++) {
		if (hh[i].type == "radio") {
			if (hh[i].checked == true) {
				cl_sel = hh[i].value;
				clarity_sel = '&clarity=' + cl_sel;
			}
		}
	}

	// get price range
	price_range = '';
	p_min_init = '';
	if (document.getElementById('price_min')) {
		p_min_init = document.getElementById('price_min').value;
	}
	p_max_init = '';
	if (document.getElementById('price_max')) {
		p_max_init = document.getElementById('price_max').value;
	}
	if (document.getElementById('price_menu')) {
		show_menu = document.getElementById('price_menu').style.display;
	} else {
		show_menu = 'none';
	}
	if (show_menu !== 'none') {
		if (p_min_init == '') {
			JSmessage('Please enter Value!');
			document.getElementById('price_min').focus();
			document.getElementById('price_min').style.backgroundColor = "#FFE8E8";
			return;
		} else {
			p_min = p_min_init.replace(",", ".");
			p_min = p_min.replace(/^\s+|\s+$/gm, '') * 1;
		}
		if (p_max_init == '') {
			JSmessage('Please enter Value!');
			document.getElementById('price_max').focus();
			document.getElementById('price_max').style.backgroundColor = "#FFE8E8";
			return;
		} else {
			p_max = p_max_init.replace(",", ".");
			p_max = p_max.replace(/^\s+|\s+$/gm, '') * 1;
		}
		if (p_min > p_max) {
			//JSmessage('p_min > p_max');
			price_min = p_max.toFixed(2);
			price_max = p_min.toFixed(2);
		} else {
			price_min = p_min.toFixed(2);
			price_max = p_max.toFixed(2);
		}
		price_range = '&p_min=' + price_min + '&p_max=' + price_max;
	} else {
		if (p_min_init !== '') {
			price_range = '&p_min=' + p_min_init + '&p_max=' + p_max_init;
		} else {
			price_range = '';
		}
	}

	treatment = '';
	treat_tmp = '';
	if (document.getElementById('treatment')) {
		treat_tmp = document.getElementById('treatment').value;
	}
	if (treat_tmp !== '') {
		treatment = '&treat=' + treat_tmp;
	}

	new_arrivals = '';
	new_arr_tmp = '';
	if (document.getElementById('new_arrivals')) {
		new_arr_tmp = document.getElementById('new_arrivals').value;
	}
	if (new_arr_tmp == 1) {
		new_arrivals = '&new_arrivals=1';
	}

	top_grade = '';
	top_grade_tmp = '';
	if (document.getElementById('top_grade')) {
		top_grade_tmp = document.getElementById('top_grade').value;
	}
	if (top_grade_tmp == 1) {
		top_grade = '&top_grade=1';
	}

	huge_gem = '';
	huge_gem_tmp = '';
	if (document.getElementById('huge_gem')) {
		huge_gem_tmp = document.getElementById('huge_gem').value;
	}
	if (huge_gem_tmp == 1) {
		huge_gem = '&huge_gem=1';
	}

	size_desc = '';
	sort = '';
	sort_opt = '';
	if (document.getElementById('sortby')) {
		sort_opt = document.getElementById('sortby');
		sort_value_tmp = sort_opt.options[sort_opt.selectedIndex].value;
		if (sort_value_tmp !== 'no') {
			sort_value = sort_value_tmp;
			sort = '&' + sort_value + '=1';
		} else {
			sort = '';
		}
	}

	clgroup = '';
	if (document.getElementById('clgroup')) {
		clgroup = document.getElementById('clgroup').value;
		if (clgroup != '') {
			clgroup = '&clgroup=' + clgroup;
		}
	}

	showForm('timer', 'timer-inner');
	// get language
	lang_selected = document.getElementById('lang_selected').value;
	lang_lower = lang_selected.toLowerCase();
	lang_str = '/' + lang_lower;
	if (lang_lower == 'english') {
		lang_str = '';
	}
	URL = lang_str + '/group/gemselect.php' + '?a=0' + gem_types + gem_colors + gem_base_colors + color_details + gem_shapes + shapes_det + gem_weight + gem_size + date_sort + clarity_sel + price_range + gem_countries + gem_style + gem_drilled + spls + faceted + cab + items + treatment + new_arrivals + sort + top_grade + huge_gem + clgroup;
	RecURL(URL,'gemMenu');
	window.open(URL, '_self');
}

function gemTypes() {
	// handle gem-types
	uri = '';
	gemtype = '';
	gem_types = '';
	x = document.getElementsByName('gemtype');
	for (var i = 0; i < x.length; i++) {
		if (x[i].checked) {
			gemtype = x[i].value;
			gem_types += gemtype + ',';
		}
	}
	gem_types = gem_types.substring(0, gem_types.length - 1);
	if (gem_types !== '') {
		gem_types = '&g_type=' + gem_types;
	}
	return gem_types;
}

function gemColorsDetail() {
	gemcolor2 = '';
	gem_colors2 = '';
	x = document.getElementsByName('color_detail');
	for (var i = 0; i < x.length; i++) {
		gemcolor2 = x[i].value;
		gem_colors2 += gemcolor2 + ',';
	}
	gem_colors2 = gem_colors2.substring(0, gem_colors2.length - 1);
	color = '';
	if (gem_colors2 !== '') {
		gem_colors2 = '&color_detail=' + gem_colors2;
	}
	color_details = gem_colors2;
	return color_details;
}

function gemBaseColors() {
	var gembasecolor = '';
	var gem_base_colors = '';
	var x = document.getElementsByName('base_color');
	for (var i = 0; i < x.length; i++) {
		if (x[i].checked) {
			gembasecolor = x[i].value;
			gem_base_colors += gembasecolor + ',';
		}
	}
	gem_base_colors = gem_base_colors.substring(0, gem_base_colors.length - 1);
	color = '';
	if (gem_base_colors !== '') {
		gem_base_colors = '&base_color=' + gem_base_colors;
	}
	return gem_base_colors;
}

function gemColors() {
	gemcolor = '';
	gem_colors = '';
	x = document.getElementsByName('color');
	for (var i = 0; i < x.length; i++) {
		if (x[i].checked) {
			gemcolor = x[i].value;
			gem_colors += gemcolor + ',';
		}
	}
	gem_colors = gem_colors.substring(0, gem_colors.length - 1);
	color = '';
	if (gem_colors !== '') {
		gem_colors = '&color=' + gem_colors;
	}
	return gem_colors;
}

function gemShapes() {
	gem_shapes = '';
	g_shape = '';
	shapes = '';
	k = document.getElementsByName('shape');
	for (var i = 0; i < k.length; i++) {
		if (k[i].checked) {
			shape = k[i].value;
			shapes += shape + ',';
		}
	}
	gem_shapes = shapes.substring(0, shapes.length - 1);
	if (gem_shapes !== '') {
		gem_shapes = '&base_shape=' + gem_shapes;
	}
	return gem_shapes;
}
// for detail shape selection
function gemShapesDet() {
	gem_shapes_det = '';
	g_shape_det = '';
	shapes_det = '';
	k = document.getElementsByName('shape_det');
	for (var i = 0; i < k.length; i++) {
		if (k[i].checked) {
			shape_det = k[i].value;
			shapes_det += shape_det + ',';
		}
	}
	gem_shapes_det = shapes_det.substring(0, shapes_det.length - 1);
	if (gem_shapes_det !== '') {
		shapes_det = '&shape=' + gem_shapes_det;
	}
	return shapes_det;
}

function gemStyles() {
	gem_style = '';
	g_style = '';
	styles = '';
	ss = document.getElementsByName('styles');
	for (var i = 0; i < ss.length; i++) {
		if (ss[i].checked) {
			style = ss[i].value;
			styles += style + "','";
		}
	}
	gem_style = styles.substring(0, styles.length - 3);
	if (gem_style !== '') {
		gem_style = '&styles=' + gem_style;
	} else {
		gem_style = '';
	}
	return gem_style;
}

function gemDrilled() {
	gem_drilled = '';
	g_drilled = '';
	drilled = '';
	ss = document.getElementsByName('drilled');
	for (var i = 0; i < ss.length; i++) {
		if (ss[i].checked) {
			drill = ss[i].value;
			drilled += drill + ",";
		}
	}
	gem_drilled = drilled.substring(0, drilled.length - 1);
	if (gem_drilled !== '') {
		gem_drilled = '&drilled=' + gem_drilled;
	} else {
		gem_drilled = '';
	}
	return gem_drilled;
}

function gemWeight() {
	gem_weight = '';
	weight_min = '';
	weight_max = '';
	if (document.getElementById('weight_min')) {
		weight_min = document.getElementById('weight_min').value;
	}
	if (document.getElementById('weight_max')) {
		weight_max = document.getElementById('weight_max').value;
	}
	weight_min = weight_min.replace(",", ".");
	weight_max = weight_max.replace(",", ".");
	check = '';
	check2 = '';
	check = isNaN(weight_min);
	check2 = isNaN(weight_max);
	if (weight_min == '') {
		gem_weight = 'empty';
		return gem_weight;
	}
	if (check == true) {
		gem_weight = 'numeric';
		return gem_weight;
	}
	if (check2 == true) {
		gem_weight = 'numeric_2';
		return gem_weight;
	}
	if (weight_max == '') {
		weight_min_tmp = weight_min * (1 - 0.04);
		weight_min_tmp = weight_min_tmp.toFixed(2);
		weight_max = weight_min * 1.04;
		weight_max = weight_max.toFixed(2);
		weight_min = weight_min_tmp;
	}
	weight_min_calc = weight_min * 1;
	weight_min_calc = weight_min_calc;
	weight_max_calc = weight_max * 1;
	weight_max_calc = weight_max_calc;
	if (weight_min_calc > weight_max_calc) {
		var w_min = weight_min;
		weight_min = weight_max;
		weight_max = w_min;
	}
	var gem_weight = '&weight_min=' + weight_min + '&weight_max=' + weight_max;
	return gem_weight;
}

function gemSize() {
	gem_size = '';
	min_length = '';
	max_length = '';
	length = '';
	if (document.getElementById('size_length')) {
		length = document.getElementById('size_length').value;
		length = length.replace('mm', '');
		length = length.trim();
	}
	width = '';
	if (document.getElementById('size_width')) {
		width = document.getElementById('size_width').value;
		width = width.replace('mm', '');
		width = width.trim();
	}
	// split into parts all what is separated by "-"
	length = length.split("-");
	min_length_tmp = length[0];
	if (length[0] == 0) {
		min_length_tmp = 0.01;
	}
	max_length_tmp = length[1];
	if (length == '') {
		min_length_tmp = '';
		max_length_tmp = '';
	}
	if (typeof max_length_tmp == 'undefined') {
		// subtract 4% and deduct 4% of initial value
		min_length = min_length_tmp * (1 - 0.04);
		max_length = min_length_tmp * 1.04;
	} else {
		min_length = min_length_tmp;
		max_length = max_length_tmp;
	}
	// convert number into string to replace and remove all unwanted spaces and characters
	min_ls = min_length.toString();
	max_ls = max_length.toString();
	// if multiplied by "1" JS will automatically return a number
	min_l = min_ls.replace(/^\s+|\s+$/gm, '') * 1;
	max_l = max_ls.replace(/^\s+|\s+$/gm, '') * 1;
	// round with precision 2 for proper display
	min_lf = min_l.toFixed(2);
	max_lf = max_l.toFixed(2);
	var length_compare = min_lf * 1;

	//*****************************************
	// getting min + max width
	width = width.split("-");
	min_width_tmp = width[0];
	if (width[0] == 0) {
		min_width_tmp = 0.01;
	}
	max_width_tmp = width[1];
	if (width == '') {
		min_width_tmp = '';
		max_width_tmp = '';
	}
	if (typeof max_width_tmp == 'undefined') {
		// subtract 4% and deduct 4% of initial value
		min_width = min_width_tmp * (1 - 0.04);
		max_width = min_width_tmp * 1.04;
	} else {
		min_width = min_width_tmp;
		max_width = max_width_tmp;
	}
	// convert number into string to replace and remove all unwanted spaces and characters
	min_ws = min_width.toString();
	max_ws = max_width.toString();
	// if multiplied by "1" JS will automatically return a number
	min_w = min_ws.replace(/^\s+|\s+$/gm, '') * 1;
	max_w = max_ws.replace(/^\s+|\s+$/gm, '') * 1;
	// round with precision 2 for proper display
	min_wf = min_w.toFixed(2);
	max_wf = max_w.toFixed(2);
	width_compare = min_wf * 1;

	// flip values if length is smaller than width
	if (length_compare < width_compare) {
		min_lf = min_w.toFixed(2);
		max_lf = max_w.toFixed(2);
		min_wf = min_l.toFixed(2);
		max_wf = max_l.toFixed(2);
	}

	//********************************************

	gem_size = '&min_l=' + min_lf + '&max_l=' + max_lf + '&min_w=' + min_wf + '&max_w=' + max_wf;
	if (min_lf == '0.00' && min_wf !== '0.00') {
		gem_size = '&min_w=' + min_wf + '&max_w=' + max_wf;
	}
	if (min_lf !== '0.00' && min_wf == '0.00') {
		gem_size = '&min_l=' + min_lf + '&max_l=' + max_lf;
	}
	// all values are filled
	if (min_lf !== '0.00' && min_wf !== '0.00') {
		gem_size = '&min_l=' + min_lf + '&max_l=' + max_lf + '&min_w=' + min_wf + '&max_w=' + max_wf;
	}
	if (min_lf == '0.00' && min_wf == '0.00') {
		gem_size = '';
	}

	//JSmessage(gem_size);
	return gem_size;
}

//country
function gemCountry() {
	gem_countries = '';
	country = '';
	co = document.getElementsByName('country');
	for (var i = 0; i < co.length; i++) {
		if (co[i].checked) {
			country = co[i].value;
			gem_countries += country + ",";
		}
	}
	gem_countries = gem_countries.substring(0, gem_countries.length - 1);
	if (gem_countries !== '') {
		gem_countries = '&countries=' + gem_countries;
	} else {
		gem_countries = '';
	}
	return gem_countries;
}

// this function avoids a double click (bubble event) when selecting the checkbox (radibutton)
// this is used when there is function call to check the radibutton on the container element 
function check(checked, e) {
	//JSmessage(e.target);
	if (e.target == '[object HTMLInputElement]' || e.srcElement == '[object HTMLInputElement]') {
		// do nothing
	} else {
		check_test = document.getElementById(checked).checked;
		if (check_test == false) {
			document.getElementById(checked).checked = true;
		} else {
			document.getElementById(checked).checked = false;
		}
	}
}

function clearWeight() {
	document.getElementById('weight_min').value = '';
	document.getElementById('weight_max').value = '';
}

function clearMenu(URL) {
	submitted_url = URL;
	showForm('timer', 'timer-inner');
	lang = document.getElementById("lang_selected").value;
	lang = lang.toLowerCase();
	if (lang == 'english') {
		url = '/group/gemselect.php';
	} else {
		url = '/' + lang + '/group/gemselect.php';
	}
	cm = document.getElementsByName("gemtype");
	for (i = 0; i < cm.length; i++) {
		if (cm[i].type == "checkbox") {
			cm[i].checked = false;
		}
	}
	cc = document.getElementsByName("color");
	for (i = 0; i < cc.length; i++) {
		if (cc[i].type == "checkbox") {
			cc[i].checked = false;
		}
	}
	clearWeight();
	RecURL(url,'clearMenu');
	window.open(url, "_self");
}

function more_clarity() {
	txt = document.getElementById('cltxt').innerHTML;
	if (txt == 'More options') {
		document.getElementById('more_clarity_options').style.display = '';
		document.getElementById('cltxt').style.fontWeight = 'bold';
		document.getElementById('cltxt').innerHTML = 'Close options';
	} else {
		document.getElementById('more_clarity_options').style.display = 'none';
		document.getElementById('cltxt').style.fontWeight = 'normal';
		document.getElementById('cltxt').innerHTML = 'More options';
	}
}
// end menu functions
//***************************************************************************************************


function showMoreSub() {
	txt_sub = document.getElementById('sub_text').innerHTML;
	sub = document.getElementsByClassName("sub_links");
	if (txt_sub == 'Show all related Information') {
		for (i = 0; i < sub.length; i++) {
			sub[i].style.display = '';
		}
		document.getElementById('sub_text').innerHTML = 'Hide Links';
	} else {
		for (i = 0; i < sub.length; i++) {
			sub[i].style.display = 'none';
		}
		document.getElementById('sub_text').innerHTML = 'Show all related Information';
	}
}

// header menu
function popMenu(id, top_menu) {
	document.getElementById(id).style.display = 'block';
	if (id == 'sub3') {
		document.getElementById('sub4').style.display = 'block';
	}
	document.getElementById(top_menu).style.backgroundColor = "#003366";
}

function hidechild(topmenu, submenu, event) {
	var node;
	event = event || window.event;
	//document.getElementById('txt').value = findParentDivID(event.toElement);
	if (event.toElement === undefined) {
		node = event.relatedTarget;
	} else {
		node = event.toElement;
	}
	if (findParentDivID(node) == submenu) {} else {
		document.getElementById(submenu).style.display = 'none';
		//document.getElementById(topmenu).className = "menu_inactive"; //restore color of main menu
		document.getElementById(topmenu).style.backgroundColor = "";
	}
}

function hideSuggest(topmenu, submenu, event) {
	var node;
	event = event || window.event;
	if (event.toElement === undefined) {
		node = event.relatedTarget;
	} else {
		node = event.toElement;
	}
	if (findParentDivID(node) == topmenu) {} else {
		document.getElementById(topmenu).style.display = 'none';
	}
}
function hideSuggest_2(topmenu, submenu, event) {
	var node;
	event = event || window.event;
	if (event.toElement === undefined) {
		node = event.relatedTarget;
	} else {
		node = event.toElement;
	}
	if (findParentDivID(node) == topmenu) {} else {
		document.getElementById(topmenu).style.display = 'none';
		document.getElementById('x').style.display = 'none';
	}
	if (document.getElementById('search')) {
		document.getElementById('search').value = '';
		document.getElementById('td_search').style.display = 'none';
	}
}

function findParentDivID(element) {
	try {
		while (element.parentNode.nodeName != "DIV" && element.parentNode.nodeName != "BODY") {
			element = element.parentNode;
		}
		return element.parentNode.id;
	} catch (e) {
		return "";
	}
}

// open and close popup HTML parts
function dId(s) {
	return parent.document.getElementById(s);
}

function showForm(bgdiv, contdiv) {
	//if (dId('video-hide') !== null) {
	//	MM_changeProp('video-hide', '', 'visibility', 'hidden', 'IMG');
	//}

	if (document.getElementById(bgdiv)) {
		oDiv = document.getElementById(bgdiv);
		oDiv.style.display = 'block';
		if (navigator.appName == "Microsoft Internet Explorer" && navigator.userAgent.toLowerCase().indexOf('msie 6') != -1) {
			oDiv.style.position = "absolute";
		}
		oDiv = document.getElementById(contdiv);
		oDiv.style.display = 'block';
	}
	//return false;
}

function hideForm_3(bgdiv, contdiv) {
	if (document.getElementById(bgdiv)) {
		document.getElementById(bgdiv).style.display = 'none';
	}
	if (document.getElementById(contdiv)) {
		document.getElementById(contdiv).style.display = 'none';
	}
	if (document.getElementById('set_focus_to')) {
		foc_id = document.getElementById('set_focus_to').value;
		if (document.getElementById(foc_id)) {
			document.getElementById(foc_id).focus();
			document.getElementById(foc_id).value = '';
		}
	}
	last_focus = document.getElementById('last_focus').value;
	if (document.getElementById(last_focus)) {
		document.getElementById(last_focus).focus();
		document.getElementById('last_focus').value = '';
	}
	return false;
}

function hideForm(bgdiv, contdiv) {
	//if (dId('video-hide') !== null) {
		//MM_changeProp('video-hide', '', 'visibility', 'visible', 'IMG');
	//}
	if (document.getElementById(bgdiv)) {
		oDiv = document.getElementById(bgdiv);
		oDiv.style.display = 'none';
	}
	if (document.getElementById(contdiv)) {
		oDiv = document.getElementById(contdiv);
		oDiv.style.display = 'none';
	}
	if (document.getElementById('set_focus_to')) {
		foc_id = document.getElementById('set_focus_to').value;
		if (document.getElementById(foc_id)) {
			document.getElementById(foc_id).focus();
			document.getElementById(foc_id).value = '';
		}
	}
	return false;
}

/*
function MM_changeProp(objId, x, theProp, theValue) { //v9.0
	var obj = null;
	if (document.getElementById(objId)) {
		obj = getElementById(objId);
	}
	if (obj) {
		if (theValue == true || theValue == false) {
			document.getElementById(foc_id).style.

			eval("obj.style." + theProp + "=" + theValue);
		else eval("obj.style." + theProp + "='" + theValue + "'");
	}
}
*/
// end popup HTML parts

//************************************************************************
// start search

function search() {
	var search = 'search';
	if (document.getElementById('search_desktop')) {
		var search = 'search_desktop';
	}
	term = document.getElementById(search).value;

	document.getElementById('sugg_result').style.display = 'none';
	if (term == '' || term == 'Type Keyword or Item ID' || term == 'Search') {
		JSmessage('Input is empty!');
		document.getElementById(search).style.backgroundColor = "#FFE8E8";
		document.getElementById(search).focus();
	} else {
		// start search
		addSearch(term);
		showForm('timer', 'timer-inner');
		sess_id = document.getElementById('stick').value;
		lang = document.getElementById('lang_selected').value;
		var dataset = {
			term: term,
			sess_id: sess_id,
			language: lang
		};
		var URL = '/includes/inc/search_func.php?job=suggest';
		sendAjaxSearch(URL, dataset, 'sugg_result');
	}
}
// trigger search function above hwen the "Enter Key" is hit inside the search input
function searchKeyPress(e) {
	e = e || window.event;
	if (e.keyCode == 13) {
		search();
		return false;
	}
	return true;
}

// get suggestions from dictionary table
function suggest(e) {
	var search = 'search';
	if (window.innerWidth > 800) {
		var search = 'search_desktop';
	}
	e = e || window.event;
	event_type = e.type;
	//JSmessage(event_type);
	if (event_type == 'keyup') {
		//JSmessage('on' + e.type + ' event fired by ' + '"' + e.srcElement.id + '" ' + ' ' + e.which);
		term_check = document.getElementById(search).value;
		//JSmessage(term_check);
		sess_id = document.getElementById('stick').value;
		lang = document.getElementById('lang_selected').value;
		var dataset = {
			term: term_check,
			sess_id: sess_id,
			language: lang
		};
		var URL = '/includes/inc/search_suggest.php?job=suggest';
		sendAjax(URL, dataset, 'sugg_result');
	}
}

// add search phrase/word into table DBonline.search_customer_input
function addSearch(term) {
	mobile_phone = '';
	if (document.getElementById('mobile_phone')) {
		mobile_phone = document.getElementById('mobile_phone').value;
	}
	custid = '';
	if (document.getElementById('custid')) {
		custid = document.getElementById('custid').value;
	}
	currency = '';
	if (document.getElementById('page_currency')) {
		currency = document.getElementById('page_currency').value;
	}
	language = '';
	if (document.getElementById('lang_selected')) {
		language = document.getElementById('lang_selected').value;
	}
	country_code = '';
	if (document.getElementById('country_code')) {
		country_code = document.getElementById('country_code').value;
	}
	user_ip = '';
	if (document.getElementById('user_ip')) {
		user_ip = document.getElementById('user_ip').value;
	}

	session_id = '';
	uri = '';
	if (term == 'no') {
		term = document.getElementById('search').value;
	}
	if (document.getElementById('stick')) {
		session_id = document.getElementById('stick').value;
	}
	if (document.getElementById('uri_path_full')) {
		uri = document.getElementById('uri_path_full').value;
	}
	var dataset = {
		term: term,
		session_id: session_id,
		uri: uri,
		mobile_phone: mobile_phone,
		custid: custid,
		currency: currency,
		language: language,
		country_code: country_code,
		user_ip: user_ip
	};
	var URL = '/includes/inc/ajax_receiver.php?job=addSearch';
	sendAjax(URL, dataset, 'content');
}

function showSearch(url, id) {
	term_tmp = 'term_' + id;
	term = document.getElementById(term_tmp).innerHTML;

	showForm('timer', 'timer-inner');
	RecURL(url,'showSearch');
	window.open(url, "_self");
}

// jquery transfer + shake effect for flying cart
function flyToCart(prodid) {
	if (!document.getElementById('mobile_site')) {
		//cart_button = '#add_to_cart_' + prodid;
		var check_element = document.getElementById('fly5');
		if (check_element !== null) {
			document.getElementById('fly5').style.height = '30px';
			$(document).ready(function() {
				$('#add_to_cart_' + prodid).effect('transfer', {
					to: $('#fly5'),
					className: 'fly1'
				}, 800);
				$('#cart_place').delay(700).effect('shake', {
					direction: 'down',
					times: 1,
					distance: 4
				}, 800);
			});
		}
	}
}

function flyToCheckout(prodid) {
	if (!document.getElementById('mobile_site')) {
		if (document.getElementById('cart-tr')) {
			$(document).ready(function() {
				$('#add_to_cart_' + prodid).effect('transfer', {
					to: $('#cart-tr'),
					className: 'fly1'
				}, 800);
			});
		}
	}
}

// for mobile jquery transfer + shake effect for flying cart
function flyToCartMobile(prodid) {
	//cart_button = '#add_to_cart_' + prodid;
	check_element = document.getElementById('fly5');
	if (check_element !== null) {
		$(document).ready(function() {
			$('#add_to_cart_' + prodid).effect('transfer', {
				to: $('#fly5'),
				className: 'fly1'
			}, 800);
			$('#cart_place').delay(700).effect('shake', {
				direction: 'down',
				times: 1,
				distance: 4
			}, 800);
		});
	}
}

// jquery transfer + shake effect for Jewelry-design addons
function flyToCartJD() {
	if (!document.getElementById('mobile_site')) {
		//cart_button = '#add_to_cart_' + prodid;
		var check_element = document.getElementById('fly5');
		if (check_element !== null) {
			document.getElementById('fly5').style.height = '30px';
			$(document).ready(function() {
				$('#add_design_id').effect('transfer', {
					to: $('#fly5'),
					className: 'fly1'
				}, 800);
				$('#cart_place').delay(700).effect('shake', {
					direction: 'down',
					times: 1,
					distance: 4
				}, 800);
			});
		}
	}
}

// jquery transfer effect for compare checkbox
function flyToCartComp(prodid) {
	var check_element = document.getElementById('fly5');
	if (check_element !== null) {
		document.getElementById('fly5').style.height = '30px';

		$(document).ready(function() {
			$('#comp_' + prodid).effect('transfer', {
				to: $('#compare-butt'),
				className: 'fly1'
			}, 800);
		});

	}
}

// used to show more items on any product-category page
function AjaxPost(URL_address, dataset) {
	//JSmessage(URL_address);
	//JSmessage(dataset);
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL_address,
		data: dataset,
		dataType: "json",
		success: function(data) {
			hideForm('timer', 'timer-inner');
			current_count = document.getElementById('current_count').value;
			item_count_new = (data.item_count * 1) + (current_count * 1);
			//JSmessage(item_count_new);
			document.getElementById('current_count').value = item_count_new;
			total_products = document.getElementById('total_prods').value;
			//JSmessage(total_products);
			if (item_count_new == total_products) {
				document.getElementById('pager').style.display = 'none';
			}

			container_no = data.container_no;
			cont_id = 'show_more_' + container_no;
			document.getElementById('last_display_order_id').value = data.next_display_id;
			document.getElementById('last_gemid').value = data.next_display_id;
			document.getElementById(cont_id).innerHTML = data.html;

		},
		error: function() {
			//JSmessage("Error");
		}
	});
}

function AjaxAddProd(URL_address, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL_address,
		data: dataset,
		dataType: "json",
		success: function(data) {
			if (data.AddToCart_buynow == 1) {
				JSmessage('Item added to shopping cart');
				setTimeout(function() {
					hideForm('chk-div','chk-cont');
				}, 2000);
			} else {
				hideForm('timer', 'timer-inner');
			}
			if (data.RemoveExpired == 1) {
				location.reload();
			}
			if (data.prod_cat_page == 1 || data.detail_page == 1) {
				if (document.getElementById('free_ship')) {
					if (data.cart_total >= 300 && data.show_free_ship == 1) {
						document.getElementById('free_ship').style.display = 'inline-block';
					} else {
						document.getElementById('free_ship').style.display = 'none';
					}
				}
				itemcount = data.cart_count;
				if (document.getElementById('cart-count')) {
					if (itemcount != 0) {
						document.getElementById('cart-count').innerHTML = itemcount;
					} else {
						document.getElementById('cart-count').innerHTML = '';
					}
				}
				hideForm('timer', 'timer-inner');
				if (data.cart_total >= 300) {
					JSmessageCHK('Item added to shopping cart');
					setTimeout(function() {
						$("#chk-div").fadeOut("slow");
						$("#chk-cont").fadeOut("slow");
					}, 2000);
				} else {
					JSmessageCHK('Item added to shopping cart');
					setTimeout(function() {
						$("#chk-div").fadeOut("slow");
						$("#chk-cont").fadeOut("slow");
					}, 2000);
					//JSmessageCHK('Item added to shopping cart<br> Free Shipping on orders over $300');
				}
				/*
				if (document.getElementById('jppcs-div')) {
					setTimeout(function() {
						$( "#jppcs-div" ).fadeOut( "slow" );
						$( "#jppcs-cont" ).fadeOut( "slow" );
						//hideForm_PCS('jppcs-div','jppcs-cont');
					}, 2800);
				}
				*/
			}
			if (data.AddToCart_buynow == 1 || data.AddToCart_buynow == 2) {
				if (data.AddToCart_buynow == 1) {
				}
				if (data.AddToCart_buynow == 2) {
					//alert('item already in cart');
				}
				itemcount = data.cart_count;
				if (document.getElementById('cart-count')) {
					if (itemcount != 0) {
						document.getElementById('cart-count').innerHTML = itemcount;
					} else {
						document.getElementById('cart-count').innerHTML = '';
					}
				}
				CheckAvail(data.prodid);
			}

			// check if the parent prodid is on the screen
			// if yes, we need to reload 
			p_id = 'multi_' + data.parent;
			if (document.getElementById(p_id)) {
				if (data.removeProd == 3) {
					location.reload();
				}
			}

			if (data.removeProd == 3 && data.multi == 0) {
				filename = '';
				if (document.getElementById('filename')) {
					filename = document.getElementById('filename').value;
					pos = filename.indexOf(data.prodid);
					pos2 = filename.indexOf(data.parent);
				}
				if (pos > 0 || pos2 > 0) {
					url = data.redirect;
					RecURL(url,'AjaxAddProd');
					window.open(url, '_self');
				}
			}
			if (data.removeProd == 3 && data.multi == 1) {
				location.reload();
			}

			itemcount = data.cart_count;
			if (itemcount == 0) {
				itemcount = '';
				if (document.getElementById('cimgm')) {
					$("#cimgm").removeClass("m_ca_img_in").addClass("m_ca_img");
					if (document.getElementById('cart_td')) {
						document.getElementById('cart_td').style.color = 'white';
					}
				}
			}
			//JSmessage(itemcount);
			if (document.getElementById('cart-count')) {
				if (itemcount != 0) {
					document.getElementById('cart-count').innerHTML = itemcount;
					if (document.getElementById('c_txt')) {
						document.getElementById('c_txt').style.color = 'white';
						document.getElementById('c_txt').style.backgroundColor = 'green';
					}
					if (document.getElementById('c_txt_2')) {
						document.getElementById('c_txt_2').style.color = 'white';
						document.getElementById('c_txt_2').style.backgroundColor = 'green';
					}
					if (document.getElementById('cart-count')) {
						document.getElementById('cart-count').style.color = '#99FF00';
						document.getElementById('cart_td').style.color = '#99FF00';
					}
					// change background img class
					// m_ca_img => m_ca_img_in
					// new button
					if (document.getElementById('cimgm')) {
						$("#cimgm").removeClass("m_ca_img").addClass("m_ca_img_in");
					}
					/*
					if (document.getElementById('cont_sp')) {
						c_url = window.location.href;
						result = c_url.indexOf("/cart/cart.php");
						if (!result) {
							document.getElementById('cont_sp').style.display = 'inline-block';
						}
					}
					*/
				} else {
					document.getElementById('cart-count').innerHTML = '';
					if (document.getElementById('c_txt')) {
						document.getElementById('c_txt').style.color = '#555555';
						document.getElementById('c_txt').style.backgroundColor = 'white';
					}
					if (document.getElementById('c_txt_2')) {
						document.getElementById('c_txt_2').style.color = '#555555';
						document.getElementById('c_txt_2').style.backgroundColor = 'white';
					}
					// new button
					/*
					if (document.getElementById('cont_sp')) {
						document.getElementById('cont_sp').style.display = 'none';
					}
					*/
				}
			}

			if (document.getElementById('cart-tr')) {
				ss = '';
				if (itemcount > 1) {
					ss = 's';
				}
				if (itemcount > 0) {
					document.getElementById('cart-tr').title = itemcount + ' Item' + ss + ' in the Cart';
					document.getElementById("cart-tr").classList.remove('car');
					document.getElementById("cart-tr").classList.add('car_2');
				} else {
					ss = '';
					document.getElementById('cart-tr').title = 'Your Shopping Cart Is Empty';
					document.getElementById("cart-tr").classList.remove('car_2');
					document.getElementById("cart-tr").classList.add('car');
				}
			}

			if (data.AddToCart_DetailPage == 1 || data.AddToCart_CategoryPage == 1) {
				if (data.cart_total >= 300) {
					JSmessageCHK('Item added to shopping cart');
					setTimeout(function() {
						$("#chk-div").fadeOut("slow");
						$("#chk-cont").fadeOut("slow");
					}, 2000);
				} else {
					JSmessageCHK('Item added to shopping cart');
					setTimeout(function() {
						$("#chk-div").fadeOut("slow");
						$("#chk-cont").fadeOut("slow");
					}, 2000);
				}
				if (document.getElementById('free_ship')) {
					if (data.cart_total >= 300 && data.show_free_ship == 1) {
						document.getElementById('free_ship').style.display = 'inline-block';
					} else {
						document.getElementById('free_ship').style.display = 'none';
					}
				}
				/*
				if (document.getElementById('jppcs-div')) {
					setTimeout(function() {
						$( "#jppcs-div" ).fadeOut( "slow" );
						$( "#jppcs-cont" ).fadeOut( "slow" );
						//hideForm_PCS('jppcs-div','jppcs-cont');
					}, 2800);
				}
				*/
			}
			if (data.removed == 1) {
				if (document.getElementById('free_ship')) {
					if (data.cart_total >= 300 && data.show_free_ship == 1) {
						document.getElementById('free_ship').style.display = 'inline-block';
					} else {
						document.getElementById('free_ship').style.display = 'none';
					}
				}
				b_id = 'buynow_' + data.prodid;
				if (document.getElementById(b_id)) {
					document.getElementById(b_id).style.display = '';
				}
			}

			// check for displayed line items and build new enumeration for remaining item list in cart
			// find all items which don't have "display:none" and get their id value in order to extract to prodid
			// with the extracted prodid we can now select the count value and assign the new one
			if (document.getElementsByClassName('cart-item')) {
				count = 0;
				var line_item = document.getElementsByClassName('cart-item');
				for (var i = 0; i < line_item.length; i++) {
					shown = line_item[i].style.display;
					if (shown !== 'none') {
						count = count + 1;
						table_id = line_item[i].getAttribute("id");
						prodid = table_id.substring(10);
						counter_id = 'counter_' + prodid;
						if (document.getElementById(counter_id)) {
							document.getElementById(counter_id).innerHTML = count;
						}
					}
				}
			}

			sess_id = document.getElementById('stick').value;
			currency = '';
			if (document.getElementById('page_currency')) {
				currency = document.getElementById('page_currency').value;
			}
			lang = 'English';
			if (document.getElementById('lang_selected')) {
				lang = document.getElementById('lang_selected').value;
			}
			custid = '';
			if (document.getElementById('custid')) {
				custid = document.getElementById('custid').value;
			}
			discount = '';
			if (document.getElementById('discount')) {
				discount = document.getElementById('discount').value;
			}
			ship_fee_selected = '';
			if (document.getElementById('ship_fee_selected')) {
				ship_fee_selected = document.getElementById('ship_fee_selected').value;
			}
			ship_type_selected = '';
			if (document.getElementById('ship_type_selected')) {
				ship_type_selected = document.getElementById('ship_type_selected').value;
			}
			var dataset2 = {
				discount: discount,
				custid: custid,
				sess_id: sess_id,
				currency: currency,
				language: lang,
				ship_fee_selected: ship_fee_selected,
				ship_type_selected: ship_type_selected
			};
			URL_2 = '/includes/inc/flying_cart.php';
			//AjaxFlyingCart(URL_2, dataset2);

		},
		error: function() {
			//JSmessage("Error");
		}
	});
}

function CallFlyingCart() {
	ship_fee_selected = '';
	if (document.getElementById('ship_fee_selected')) {
		ship_fee_selected = document.getElementById('ship_fee_selected').value;
	}
	ship_type_selected = '';
	if (document.getElementById('ship_type_selected')) {
		ship_type_selected = document.getElementById('ship_type_selected').value;
	}
	sess_id = document.getElementById('stick').value;
	currency = document.getElementById('page_currency').value;
	lang = document.getElementById('lang_selected').value;
	custid = '';
	if (document.getElementById('custid')) {
		custid = document.getElementById('custid').value;
	}
	discount = '';
	if (document.getElementById('discount')) {
		discount = document.getElementById('discount').value;
	}
	var dataset2 = {
		discount: discount,
		custid: custid,
		sess_id: sess_id,
		currency: currency,
		language: lang,
		ship_type_selected: ship_type_selected,
		ship_fee_selected: ship_fee_selected
	};
	URL_2 = '/includes/inc/flying_cart.php';
	//AjaxFlyingCart(URL_2, dataset2);
}

// call flying cart
function AjaxFlyingCart(URL_address, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL_address,
		data: dataset,
		dataType: "json",
		success: function(data) {
			//JSmessage(data.html);
			prodid = data.prodid;
			itemcount = data.cart_count;
			if (document.getElementById('filename')) {
				val = document.getElementById('filename').value;
				if (val !== 'cart.php' && val !== 'western-union-confirm-notify.php' && val !== 'bank-transfer-confirm-notify.php') {
					if (document.getElementById('cart_place2')) {
						document.getElementById('cart_place2').innerHTML = data.html;
						curi = document.getElementById('cart_uri').value;
						if (document.getElementById('c_uri')) {
							document.getElementById('c_uri').href = curi;
						}
						if (document.getElementById('over3items')) {
							//document.getElementById('over3items').setAttribute("onclick" , "javascript:window.open('" + curi + "', '_self')");
						}
					}
				}
			}
		},
		error: function() {
			//JSmessage("Error");
		}
	});
}

function new_uri(curi) {
	RecURL(curi,'new_uri');
	window.open(curi, '_self');
}

function showBotDialog() {
	$("#dialog").dialog({
		//width: 'auto',
		modal: true,
		create: function() {
			$(this).css("maxWidth", "600px");
		},
		open: function() {
			$(this).load('/includes/inc/ajax_receiver.php?job=validateBot');
			$("#blanket").css("display", "block");
		},
		close: function() {
			$("#dialog").dialog('destroy');
			$("#dialog").html("");
			$("#blanket").css("display", "none");
		}
	});
}


//###################################################################################
//START FACEBOOK FUNCTIONS

function closeJqDialog(dialog_identifier) {
	if (typeof(dialog_identifier) != 'undefined') {
		$("." + dialog_identifier).dialog('close');
	}
}

// END FACEBOOK FUNCTIONS
//###################################################################################

function removeParam(parameter) {
	var url = document.location.href;
	var urlparts = url.split('?');

	if (urlparts.length >= 2) {
		var urlBase = urlparts.shift();
		var queryString = urlparts.join("?");

		var prefix = encodeURIComponent(parameter) + '=';
		var pars = queryString.split(/[&;]/g);
		for (var i = pars.length; i-- > 0;)
			if (pars[i].lastIndexOf(prefix, 0) !== -1)
				pars.splice(i, 1);
		url = urlBase + '?' + pars.join('&');
		window.history.pushState('', document.title, url);
	}
	return url;
}

function addProd(prodid) {
	is_b = 0;
	if (document.getElementById('is_b')) {is_b = document.getElementById('is_b').value;}
	if (is_b == 1) {return;}

	if (prodid != undefined && prodid != 0) {
		var isbot = false;
		var phpSessionId = /SESS\w*ID=([^;]+)/i.test(document.cookie) ? RegExp.$1 : false;

		// This code doesn't run if the user has a session generated for him, so we minimize hits to checkIsBot function
		if (phpSessionId == false) {
			$.ajax({
				async: true,
				url: "/includes/inc/ajax_receiver.php?job=checkIsBot",
				cache: false,
				success: function(data) {
					var jobj = JSON.parse(data);
					if (jobj.isbot == true) {
						isbot = true;
					}
				},
				complete: function() {
					if (isbot == true) {
						showBotDialog();
					}
				}
			});
		}
	}

	if (prodid > 1) {
		QTYdetails(prodid);
	}
	// hide jewelry button
	je_id = 'choose_jewelry_' + prodid;
	if (document.getElementById(je_id)) {
		document.getElementById(je_id).style.display = 'none';
	}

	// get addons like cerificates from the hidden field on the page
	addons = '';
	if (document.getElementById('addon_selected')) {
		addons = document.getElementById('addon_selected').value;
	}
	if (prodid == 0) {
		prodid = 0;
		sess_id = document.getElementById('stick').value;
		price = '';

	} else {
		// check if customer is new
		checkExist();
		if (document.getElementById('mobile_site')) {
			flyToCartMobile(prodid);
		} else {
			//flyToCart(prodid);
		}
		/*
		if (document.getElementById('cont_sp')) {
			document.getElementById('cont_sp').style.display = 'inline-block';
		}
		*/

		price_id = 'prod_price_' + prodid;
		price = document.getElementById(price_id).value;
		sess_id = document.getElementById('stick').value;
		adcart_id = 'add_to_cart_' + prodid;
		incart_id = 'in_cart_' + prodid;
		instock_id = 'in_stock_' + prodid;
		removefroncart_id = 'remove_from_cart_' + prodid;
		document.getElementById(adcart_id).style.display = 'none';
		document.getElementById(incart_id).style.display = '';
		if (document.getElementById(instock_id)) {
			document.getElementById(instock_id).style.display = 'none';
		}
		document.getElementById(removefroncart_id).style.display = '';
	}
	if (document.getElementById('page_currency')) {
		currency = document.getElementById('page_currency').value;
	}

	// get piece count from drop-down
	pcs = 'qty_' + prodid;
	if (document.getElementById(pcs)) {
		pieces = document.getElementById(pcs).value;
	} else {
		pieces = 0;
	}

	requ_uri = '';
	if (document.getElementById('requ_uri')) {
		requ_uri = document.getElementById('requ_uri').value;
		parts = requ_uri.split('?');
		requ_uri = parts[0];
	}
	type = 'detail_page';
	if (requ_uri != '/cart/cust-address.php' && requ_uri != '/cart/payment-complete_new.php' && requ_uri != '/cart/cust-address__NEW__.php') {
		var dataset = {
			type: type,
			prodid: prodid,
			sess_id: sess_id,
			price: price,
			addons: addons,
			pieces: pieces,
			//type: addProd_standard
		};
		URL_address = '/includes/inc/ajax_receiver.php?job=addProd';
		AjaxAddProd(URL_address, dataset);
	}

	//URL_2 = '/includes/inc/flying_cart.php';
	//AjaxFlyingCart(URL_2, dataset2);
}

function removeProd(prodid) {
	cond = 'close';
	ShowJewelTXT(cond);
	// show jewelry button
	je_id = 'choose_jewelry_' + prodid;
	if (document.getElementById(je_id)) {
		document.getElementById(je_id).style.display = '';
	}
	user_ip = 0;
	if (document.getElementById('user_ip')) {
		user_ip = document.getElementById('user_ip').value;
	}
	sess_id = document.getElementById('stick').value;
	adcart_id = 'add_to_cart_' + prodid;
	incart_id = 'in_cart_' + prodid;
	instock_id = 'in_stock_' + prodid;
	removefroncart_id = 'remove_from_cart_' + prodid;
	document.getElementById(adcart_id).style.display = '';
	if (document.getElementById(incart_id)) {
		document.getElementById(incart_id).style.display = 'none';
	}
	if (document.getElementById(instock_id)) {
		document.getElementById(instock_id).style.display = '';
	}

	x = document.getElementsByName('RadioGroup1');
	for (var i = 0; i < x.length; i++) {
		x[i].checked = false;
	}
	if (document.getElementById('NO')) {
		document.getElementById('NO').checked = true;
	}
	if (document.getElementById('cert-options')) {
		document.getElementById('cert-options').style.display = 'none';
	}
	document.getElementById(removefroncart_id).style.display = 'none';
	language = document.getElementById('lang_selected').value;

	var dataset = {
		prodid: prodid,
		sess_id: sess_id,
		language: language,
		user_ip: user_ip
	};
	URL_address = '/includes/inc/ajax_receiver.php?job=removeProd';
	AjaxAddProd(URL_address, dataset);
}

function deleteFromCart(prodid) {
	// product_XXXX
	if (document.getElementById('product_' + prodid)) {
		document.getElementById('product_' + prodid).value = '';
	}
	sess_id = document.getElementById('stick').value;
	cartitem_id = 'cart_item_' + prodid;
	document.getElementById(cartitem_id).style.display = 'none';

	// get all addons for the selected prodid and remove byClassName
	prodprice_id = 'prod_' + prodid;
	zz = document.getElementsByClassName(prodprice_id);
	for (var i = 0; i < zz.length; i++) {
		zz[i].innerHTML = 0;
	}
	prodprice_id2 = 'prod2_' + prodid;
	zz2 = document.getElementsByClassName(prodprice_id2);
	for (i = 0; i < zz2.length; i++) {
		zz2[i].innerHTML = 0;
	}
	//document.getElementById(prodprice_id).innerHTML = 0;

	// recalculate subtotal
	cartsubtotal = cartCalcSubtotal();
	cartsubtotal_dis = cartCalcSubtotal_dis();
	if (cartsubtotal < 1) {
		document.getElementById('total_box').style.display = 'none';
		document.getElementById('cart_details').style.display = 'none';
		document.getElementById('cart_empty').style.display = '';
		document.getElementById('show_return').style.display = '';
		if (document.getElementById('r_container')) {
			document.getElementById('r_container').style.display = '';
		}
	}
	document.getElementById('csub').innerHTML = cartsubtotal;
	if (document.getElementById('csub2')) {
		document.getElementById('csub2').innerHTML = cartsubtotal_dis;
	}

	// need to get shipping price for total calculation
	var x = document.getElementsByName('rb_shiptype');
	for (i = 0; i < x.length; i++) {
		if (x[i].checked) {
			shiptype = x[i].value;
		}
	}
	shipprice_id = 'shipprice_' + shiptype;
	shipprice = document.getElementById(shipprice_id).value;
	// recalculate total
	calcCartTotal(shipprice);
	calcCartTotal_dis(shipprice);
	language = document.getElementById('lang_selected').value;
	var dataset = {
		prodid: prodid,
		sess_id: sess_id,
		language: language
	};
	URL_address = '/includes/inc/ajax_receiver.php?job=removeProd';
	AjaxAddProd(URL_address, dataset);

	// check for "sell_by_piece" items in cart
	// reload page if existing
	location.reload();
	if (document.getElementsByClassName("sell_by_piece").length > 0) {
		location.reload();
	}
}

function deleteFromFlyingCart(prodid) {
	multi = 0;
	m_id = 'multi_' + prodid;
	if (document.getElementById(m_id)) {
		multi = document.getElementById(m_id).value;
	}
	sess_id = document.getElementById('stick').value;

	// call only if prodid is on the current page
	prod_check = '';
	prod_id = 'product_id_' + prodid;
	if (document.getElementById(prod_id)) {
		element = document.getElementById(prod_id);
		if (element !== null) {
			prod_check = document.getElementById(prod_id).value;
		}
	}
	removefroncart_id = 'remove_from_cart_' + prodid;
	if (document.getElementById(removefroncart_id)) {
		document.getElementById(removefroncart_id).style.display = 'none';
	}
	if (document.getElementById('add_to_cart_' + prodid)) {
		document.getElementById('add_to_cart_' + prodid).style.display = '';
	}
	if (document.getElementById('buynow_wrap_' + prodid)) {
		document.getElementById('buynow_wrap_' + prodid).style.display = '';
	}
	if (document.getElementById('buynow_' + prodid)) {
		document.getElementById('buynow_' + prodid).style.display = '';
		if (document.getElementById('ship_price_txt')) {
			document.getElementById('ship_price_txt').style.display = '';
		}
	}

	if (prod_check == prodid) {
		removeProd(prodid);
	} else {
		x = document.getElementsByName('RadioGroup1');
		for (var i = 0; i < x.length; i++) {
			x[i].checked = false;
		}
		if (document.getElementById('NO')) {
			document.getElementById('NO').checked = true;
		}
		if (document.getElementById('cert-options')) {
			document.getElementById('cert-options').style.display = 'none';
		}
		language = document.getElementById('lang_selected').value;
		showForm('timer', 'timer-inner');
		var dataset = {
			prodid: prodid,
			sess_id: sess_id,
			multi: multi,
			language: language
		};
		URL_address = '/includes/inc/ajax_receiver.php?job=removeProd';
		AjaxAddProd(URL_address, dataset);
	}
	RestoreCertsItemDetail();
}

function setShipping(shiptype, price) {
	mobile = 0;
	if (document.getElementById('mobile_phone')) {
		mobile = document.getElementById('mobile_phone').value;
	}
	// update hidden inputs
	if (document.getElementById('ship_fee_selected')) {
		document.getElementById('ship_fee_selected').value = price;
	}
	if (document.getElementById('ship_type_selected')) {
		document.getElementById('ship_type_selected').value = shiptype;
	}

	// clear current bg-color
	c_bg = document.getElementsByClassName('ship_bg');
	for (var z = 0; z < c_bg.length; z++) {
		c_bg[z].style.backgroundColor = '';
	}
	// set bg-color
	id = 'bg_' + shiptype;
	document.getElementById(id).style.backgroundColor = '#DADADA';

	// set the selected shipping fee for the page
	document.getElementById('ship_fee_selected').value = price;
	// select the radio-button
	ship_id = 'shipping_' + shiptype;
	document.getElementById(ship_id).checked = true;
	shipprice_id = 'shipprice_' + shiptype;
	shipprice_selected = document.getElementById(shipprice_id).value;
	ship_price_id = 'ship_price_' + shiptype;
	current_prices = document.getElementsByClassName('ship_price');
	for (var i = 0; i < current_prices.length; i++) {
		current_prices[i].innerHTML = '';
	}

	page_currency = document.getElementById('page_currency').value;
	curr_shiptype = 'curr_' + shiptype;

	// for mobile only
	if (mobile == 1) {
		if (page_currency == 'USD') {
			page_currency = '$';
		}
	}

	document.getElementById(curr_shiptype).innerHTML = page_currency;

	//document.getElementById(ship_price_id).innerHTML = shipprice_selected;

	Ship_pr_sel = parseFloat(shipprice_selected);
	document.getElementById(ship_price_id).innerHTML = formatNumber(Ship_pr_sel.toFixed(2));
	calcCartTotal(shipprice_selected);
	calcCartTotal_dis(shipprice_selected);

	sess_id = document.getElementById('stick').value;
	dataset = {
		ship_price: price,
		shiptype: shiptype,
		sess_id: sess_id
	};
	URL_address = '/includes/inc/ajax_receiver.php?job=changeShipping';
	AjaxAddProd(URL_address, dataset);
}

function cartCalcSubtotal() {
	var itemprices = document.getElementsByName('prodprice');
	var cartsubtotal = parseFloat(0);
	for (var i = 0; i < itemprices.length; i++) {
		price = itemprices[i].innerHTML;
		//JSmessage(price);
		price = price.replace(",", "");
		price = parseFloat(price);
		cartsubtotal = cartsubtotal + price;
	}
	cartsubtotal = formatNumber(cartsubtotal.toFixed(2));
	return cartsubtotal;
}

function cartCalcSubtotal_dis() {
	if (document.getElementsByName('prodprice2')) {
		var itemprices = document.getElementsByName('prodprice2');
		var cartsubtotal_dis = parseFloat(0);
		for (var i = 0; i < itemprices.length; i++) {
			price = itemprices[i].innerHTML;
			//JSmessage(price);
			price = price.replace(",", "");
			price = parseFloat(price);
			cartsubtotal_dis = cartsubtotal_dis + price;
		}
		cartsubtotal_dis = formatNumber(cartsubtotal_dis.toFixed(2));
		return cartsubtotal_dis;
	}
}

function calcCartTotal(shipcost) {
	var cartsubtotal = document.getElementById('csub').innerHTML;
	cartsubtotal = cartsubtotal.replace(",", "");
	var grandtotal = parseFloat(cartsubtotal) + parseFloat(shipcost);
	grandtotal = formatNumber(grandtotal.toFixed(2));
	document.getElementById('grandtotal').innerHTML = grandtotal;
}

function calcCartTotal_dis(shipcost) {
	if (document.getElementById('csub2')) {
		cartsubtotal2 = document.getElementById('csub2').innerHTML;
		cartsubtotal2 = cartsubtotal2.replace(",", "");
		grandtotal2 = parseFloat(cartsubtotal2) + parseFloat(shipcost);
		grandtotal2 = formatNumber(grandtotal2.toFixed(2));
		document.getElementById('grandtotal2').innerHTML = grandtotal2;
	}
}

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function cartRedirectPage(url) {
	showForm('timer', 'timer-inner');
	zz = document.getElementsByName('rb_shiptype');
	for (i = 0; i < zz.length; i++) {
		if (zz[i].checked) {
			shiptype = zz[i].value;
		}
	}
	url2 = url + "&shiptype=" + shiptype;
	window.location = url2;
}

// call currency popup
function AjaxCurrency(URL, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL,
		data: dataset,
		dataType: "json",
		success: function(data) {
			document.getElementById('curr').innerHTML = data.html;
		},
		error: function() {
			//JSmessage("Error");
		}
	});
}

function Currencies() {
	sess_id = document.getElementById('stick').value;
	dataset = {
		sess_id: sess_id
	};
	URL = '/includes/inc/currency_selector.php';
	AjaxCurrency(URL, dataset);
}

// change currency in DBonline.sticky_sessions
function AjaxCurrLang(URL, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL,
		data: dataset,
		dataType: "json",
		success: function(data) {
			f_d = data;
			sess_id = document.getElementById('stick').value;
			currency = document.getElementById('page_currency').value;
			ship_fee_selected = '';
			if (document.getElementById('ship_fee_selected')) {
				ship_fee_selected = document.getElementById('ship_fee_selected').value;
			}
			ship_type_selected = '';
			if (document.getElementById('ship_type_selected')) {
				ship_type_selected = document.getElementById('ship_type_selected').value;
			}
			custid = '';
			if (document.getElementById('custid')) {
				custid = document.getElementById('custid').value;
			}
			discount = '';
			if (document.getElementById('discount')) {
				discount = document.getElementById('discount').value;
			}
			var dataset2 = {
				discount: discount,
				custid: custid,
				sess_id: sess_id,
				currency: currency,
				language: lang,
				ship_type_selected: ship_type_selected,
				ship_fee_selected: ship_fee_selected
			};
			URL_2 = '/includes/inc/flying_cart.php';
			//AjaxFlyingCart(URL_2, dataset2);
		},
		error: function() {
			//JSmessage("Error");
		}
	});
}

function Curr() {
	val = document.getElementById('currencies').value;
	parts = val.split(",");
	rate = parts[0];
	curr = parts[1];
	rate_USD = document.getElementById('rate_USD').value;
	ChangeCurrNew(curr, rate);
}

function ChangeCurrNew(currency, value) {
	showForm('timer', 'timer-inner');
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/includes/inc/currency-update.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'success') {
					location.reload();
				} else {
					console.error("Error: " + response.message);
				}
			} else {
				console.error("Error: " + xhr.status);
			}
		}
	};
	var sess_id = document.getElementById('stick').value;
	var type = 'update_currency';
	var data = "&currency=" + encodeURIComponent(currency) +
		         "&sess_id=" + encodeURIComponent(sess_id) +
						 "&type=" + encodeURIComponent(type);
	xhr.send(data);
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function changeCurr(currency, rate_selected, rate_usd) {
	var i;
	sell_by_piece = 0;
	// set hidden input page_currency based on user selection "currency"
	document.getElementById('page_currency').value = currency;

	// update certificate prices
	if (document.getElementsByName('certprice_thb')) {
		cert = document.getElementsByName('certprice_thb');
		for (i = 0; i < cert.length; i++) {
			cert_price_thb = cert[i].value;
			new_certprice = cert_price_thb / rate_selected;
			new_certprice = new_certprice.toFixed(2);
			cert_key = cert[i].id.substring(14);
			certprice_id = 'cert_' + cert_key;
			certp_r_id = 'cert_r_' + cert_key;
			//alert(new_certprice);
			if (document.getElementById(certprice_id)) {
				document.getElementById(certprice_id).innerHTML = new_certprice;
			}
			if (document.getElementById(certp_r_id)) {
				document.getElementById(certp_r_id).innerHTML = new_certprice;
			}
		}
	}

	// change currencies shown on page for each element with currency symbol
	if (document.getElementsByClassName('curr_cart')) {
		currencies = document.getElementsByClassName('curr_cart');
		for (i = 0; i < currencies.length; i++) {
			if (currency == 'USD') {
				currency = '$';
			}
			currencies[i].innerHTML = currency;
		}
	}

	if (document.getElementsByClassName('curr_selected')) {
		currencies = document.getElementsByClassName('curr_selected');
		for (i = 0; i < currencies.length; i++) {
			if (currency == 'USD') {
				currency = '$';
			}
			currencies[i].innerHTML = currency;
		}
	}

	// change currencies shown on page for each element with currency symbol
	if (document.getElementsByClassName('curr_selected_2')) {
		currencies = document.getElementsByClassName('curr_selected_2');
		for (i = 0; i < currencies.length; i++) {
			if (currency == 'USD') {
				currency = '$';
			}
			currencies[i].innerHTML = currency;
		}
	}

	// calculate new prices based on rate_USD and selected_rate
	// classname = prod_price
	prices = document.getElementsByName('prod_price');
	for (i = 0; i < prices.length; i++) {
		price = prices[i].value;
		id_item = prices[i].id;
		new_price = (price * rate_usd) / rate_selected;
		new_price = new_price.toFixed(2);
		pr_thb = (price * rate_usd).toFixed(2);

		// calculate discounted price
		if (document.getElementById('dis_multiplier')) {
			multi = document.getElementById('dis_multiplier').value;
			pr2 = (pr_thb / rate_selected).toFixed(2);
			disc_new_price = (pr2 * multi).toFixed(2);
		}

		if (document.getElementById('sell_by_piece')) {
			if (document.getElementById('sell_by_piece').value == 1) {
				sell_by_piece = 1;
			}
		}

		// find related id of element via "indexOf" function / if -1 is returned then no match has been found
		var xx = id_item.indexOf('fly');
		if (xx == -1) {
			// prod_price_XXXXXX
			item_id = id_item.substring(11);
			item_to_update = 'prod_' + item_id;
			item_to_update2 = 'prod2_' + item_id;
			item_to_update3 = 'prod_pro_' + item_id;
			if (sell_by_piece != 1) {
				if (document.getElementById(item_to_update)) {
					document.getElementById(item_to_update).innerHTML = new_price;
				}
				if (document.getElementById(item_to_update2)) {
					document.getElementById(item_to_update2).innerHTML = disc_new_price;
				}
				if (document.getElementById(item_to_update3)) {
					document.getElementById(item_to_update3).innerHTML = disc_new_price;
				}
			}
		} else {
			// prod_price_fly_XXXXXX
			item_id = id_item.substring(15);
			item_to_update = 'prod_fly_' + item_id;
			document.getElementById(item_to_update).innerHTML = new_price;
		}
	}

	if (document.getElementById('csub')) {
		cartsubtotal = cartCalcSubtotal();
		document.getElementById('csub').innerHTML = cartsubtotal;
	}
	if (document.getElementById('csub2')) {
		cartsubtotal_dis = cartCalcSubtotal_dis();
		document.getElementById('csub2').innerHTML = cartsubtotal_dis;
	}
	// calculate shipping price based on currency
	if (document.getElementById('ship_fee_selected')) {
		ship_fee_usd = document.getElementById('ship_fee_selected').value;
	} else {
		ship_fee_usd = 0;
	}
	new_ship_fee = (ship_fee_usd * rate_usd) / rate_selected;
	new_ship_fee = new_ship_fee.toFixed(2);
	// update new shipping fee on page
	var x = document.getElementsByName('rb_shiptype');
	for (i = 0; i < x.length; i++) {
		// clear currency symbol for shipping price
		var ccc = document.getElementsByClassName('shipprice_curr');
		for (k = 0; k < ccc.length; k++) {
			ccc[k].innerHTML = '';
		}
		// set currency symbol for selected ship price
		shiptype_selected = '';
		var stt = document.getElementsByName('rb_shiptype');
		for (f = 0; f < stt.length; f++) {
			if (stt[f].checked) {
				shiptype_selected = x[f].value;
			}
		}
		if (shiptype_selected == '') {
			// set to default shipping method if nothing selected (if cart is empty)
			shiptype_selected = 'Shipping2';
		}
		curr_id = 'curr_' + shiptype_selected;
		document.getElementById(curr_id).innerHTML = currency;

		if (x[i].checked) {
			shiptype = x[i].value;
			shipprice_id = 'ship_price_' + shiptype;
			document.getElementById(shipprice_id).innerHTML = new_ship_fee;
		}
	}

	// update shipping fees in square brackets ( cart.php )
	var sq = document.getElementsByName('shipcost_shown');
	for (i = 0; i < sq.length; i++) {
		shipprice_id = sq[i].id;
		ship_t = shipprice_id.substring(15);
		s_id = 'shiptype_' + ship_t;
		price_usd = document.getElementById(s_id).value;
		new_ship_price = (price_usd * rate_usd) / rate_selected;
		new_ship_price = new_ship_price.toFixed(2);
		sq[i].innerHTML = new_ship_price;
		hidden_price_id = 'shipprice_' + ship_t;
		document.getElementById(hidden_price_id).value = new_ship_price;
	}
	// update shipping fee on item detail page
	if (document.getElementById('standard_ship_fee')) {
		standard_fee = document.getElementById('standard_ship_fee').value;
		new_shipfee = (standard_fee * rate_usd) / rate_selected;
		new_shipfee = new_shipfee.toFixed(2);
		if (document.getElementById('default_shipping')) {
			document.getElementById('default_shipping').innerHTML = new_shipfee;
		}
	}

	if (document.getElementById('grandtotal')) {
		calcCartTotal(new_ship_fee);
	}
	if (document.getElementById('grandtotal2')) {
		calcCartTotal_dis(new_ship_fee);
	}

	// update DBonline.sticky_sessions with selected currency for user (sess_id)
	dataset = {
		currency: currency,
		sess_id: sess_id
	};
	URL = '/includes/inc/currency_language_change.php';
	AjaxCurrLang(URL, dataset);
	filename = document.getElementById('filename').value;
	if (filename == 'cart.php' || filename == 'buy-now.php' || filename == 'western-union-confirm-notify.php') {
		location.reload();
	}
	if (sell_by_piece == 1) {
		location.reload();
	}
}

// call currency popup
function AjaxGeneral(URL, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL,
		data: dataset,
		dataType: "json",
		success: function(data) {
			var i;
			if (data.CheckAvail == 1) {
				//alert('item is available and now locked');
				CheckoutBuyNow(data.prodid);
			}
			if (data.CheckAvail == 2) {
				if (document.getElementById('but_type')) {
					type = document.getElementById('but_type').value;
					if (type == 'buy_now') {
						hideForm('timer', 'timer-inner');
						alert('item is not available anymore, Please select another item');
					}
				} else {
					alert('item is not available anymore, it will be remove from your cart');
				}
			}

			data.comp_total = data.comp_total * 1; // convert to number
			if (data.lang_changed == 1) {
				var url = '/' + data.uri_new;
				RecURL(url,'AjaxGeneral');
				window.open(url, "_self");
			}
			if (data.RecordPayAttempt_1 == 1) {
				//
			}
			if (data.RecordPayAttempt == 1) {
				//
			}
			if (data.added == 'added') {
				// item added to compare list
				if (document.getElementById('compare-butt')) {
					document.getElementById('compare-butt').innerHTML = data.html;
					document.getElementById('fly5').style.height = '0px';
				}
			}
			if (data.added == 'removed') {
				if (data.comp_total > 0) {
					if (document.getElementById('compare-butt')) {
						document.getElementById('compare-butt').innerHTML = data.html;
					}
				} else {
					if (document.getElementById('compare-butt')) {
						document.getElementById('compare-butt').innerHTML = '';
					}
				}
				// reload compare-wishlist.php if on this page
				if (data.reload == 1) {
					window.open('/' + data.lang + '/tools/compare-wishlist.php', '_self');
				}
			}
			if (data.added == 'refresh') {
				// item removed from compare list
				if (data.comp_total !== 0) {
					if (document.getElementById('compare-butt')) {
						document.getElementById('compare-butt').innerHTML = data.html;
					}
				} else {
					if (document.getElementById('compare-butt')) {
						document.getElementById('compare-butt').innerHTML = '';
					}
				}
				// reselect checkboxes for compare items
				if (data.compare_list !== 0) {
					complist = data.compare_list;
					// clear "checkbox_compare"
					co = document.getElementsByName('checkbox_compare');
					for (i = 0; i < co.length; i++) {
						if (co[i].checked) {
							co[i].checked = '';
						}
					}
					// check the ones in "complist"
					str_array = complist.split(',');
					for (i = 0; i < str_array.length; i++) {
						// Trim the excess whitespace.
						str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
						// reselect if availabe on page
						checkbox_id = 'comp_' + str_array[i];
						if (document.getElementById(checkbox_id)) {
							document.getElementById(checkbox_id).checked = true;
						}
					}
				}
			}
			if (data.selectCert == 1) {
				// item in cart has been updated with latest certifictae selection
				// reload Flying Cart
				//CallFlyingCart();
			}
			if (data.selectCert == 2) {
				// new row in DBonline.cart_addons has been added
				//CallFlyingCart();
			}
			if (data.selectCert == 3) {
				// row in DBonline.cart_addons has been deleted
				// reload Flying Cart
				//CallFlyingCart();
			}
			if (data.removeAddon == 1) {
				// addon has been removed from DBonline.cart_addons
				//JSmessage('addon has been removed from DBonline.cart_addons');
				// the url should be whatever the current page is
				url_1 = '/' + data.page;
				RecURL(url_1,'AjaxGeneral');
				window.open(url_1, '_self');
			}
			if (data.emailfriend == 1) {
				document.getElementById('emailfriend').innerHTML = data.html;
			}
			if (data.emailFriendVal == 1) {
				JSmessage('Your Email Has been Sent');
				hideForm('theFormDiv', 'email-friend-1');
			}
			if (data.emailFriendVal == 2) {
				JSmessage('Validation Code is Invalid, Please enter again!');
				document.getElementById('validate').value = '';
				document.getElementById('validate').style.backgroundColor = "#FFE8E8";
				document.getElementById('validate').focus();
				return;
			}
			if (data.newsletter == 1) {
				//JSmessage(data.html);
				document.getElementById('newsletter').innerHTML = data.html;
			}
			if (data.sendContactEmail == 1) {
				JSmessage('Your Email Has been Sent');
				ResetEmailInputs();
			}
			if (data.sendContactEmail == 2) {
				JSmessage('Validation Code is Invalid, Please enter again!');
				document.getElementById('validate_cont_img').value = '';
				document.getElementById('validate_cont_img').style.backgroundColor = "#FFE8E8";
				document.getElementById('validate_cont_img').focus();
				return;
			}
			if (data.sendContactEmail == 3) {
				JSmessage('Email or Email-format is invalid!');
				document.getElementById('email').style.backgroundColor = "#FFE8E8";
				document.getElementById('email').focus();
				return;
			}
			if (data.sendContactEmailssl == 1) {
				JSmessage('Your message has been sent! We will respond within the next 24 hours');
				openSendMess();
				document.getElementById('msg_ssl').value = '';
				document.getElementById('default').selected = true;
			}
			if (data.sendContactEmailssl == 2) {
				// error: send ssl message
			}
			if (data.setProductToLocked == 2) {
				prodid_locked = data.item_to_lock;
				sess_id = document.getElementById('stick').value;
				JSmessage('One Item is currently unavailable! We removed it from your cart and will refresh your Page');
				url_2 = 'http://www.gemselect.com/cart/cart.php';
				window.open(url_2, '_self');
				return;
			}
			if (data.setProductToLocked == 1) {
				showForm('timer', 'timer-inner');
				setTimeout(function() {
					hideForm('timer', 'timer-inner');
				}, 60000);
				// submit form "form1"
				if (document.getElementById("form1")) {
					document.getElementById("form1").submit();
				}
			}
			// Newsletter subscribe responses
			if (data.NLsubscribe == 'updated') {
				// existing account has been updated
				JSmessage('You are now signed up to receive our monthly Newletter');
				if (document.getElementById('menu-div_nl')) {
					hideFormNL('menu-div_nl');
				}
				hideForm('theFormDiv-2', 'email-friend-2');
				return;
			}
			if (data.NLsubscribe == 'already_signedup') {
				// customer account exists and customer is already signed up
				JSmessage('You are already signed up');
				hideForm('theFormDiv-2', 'email-friend-2');
				if (document.getElementById('menu-div_nl')) {
					hideFormNL('menu-div_nl');
				}
				return;
			}
			if (data.NLsubscribe == 'signedup') {
				// a new customer account has been created since the email did not exist yet
				JSmessage('You are now signed up to receive our monthly Newletter');
				if (document.getElementById('menu-div_nl')) {
					hideFormNL('menu-div_nl');
				}
				hideForm('theFormDiv-2', 'email-friend-2');
				return;
			}
			if (data.NLsubscribe == 'block') {
				JSmessage('You already signed up');
				hideForm('theFormDiv-2', 'email-friend-2');
				return;
			}

			// Newsletter subscribe responses
			if (data.NLsubscribe_2 == 'updated') {
				// existing account has been updated
				JSmessage('You are now signed up to receive our monthly Newletter');
				hideForm('theFormDiv-2', 'email-friend-2');
				if (document.getElementById('menu-div_nl')) {
					hideFormNL('menu-div_nl');
				}
				hideForm('timer', 'timer-inner');
				return;
			}
			if (data.NLsubscribe_2 == 'already_signedup') {
				// customer account exists and customer is already signed up
				JSmessage('You are already signed up');
				document.getElementById('email_nl').value = '';
				hideForm('timer', 'timer-inner');
				return;
			}
			if (data.NLsubscribe_2 == 'signedup') {
				// a new customer account has been created since the email did not exist yet
				JSmessage('You are now signed up to receive our monthly Newletter');
				document.getElementById('email_nl').value = '';
				if (document.getElementById('menu-div_nl')) {
					hideFormNL('menu-div_nl');
				}
				hideForm('timer', 'timer-inner');
				return;
			}
			if (data.NLsubscribe_2 == 'block') {
				JSmessage('You already signed up');
				document.getElementById('email_nl').value = '';
				hideForm('timer', 'timer-inner');
				return;
			}

			// new
			// online account sign-up
			if (data.AccountSignUp == 'email_invalid') {
				hideForm('timer', 'timer-inner');
				JSmessage('Please check your email, it seems invalid!');
				return;
			}
			if (data.AccountSignUp == 'acc_signedup') {
				// set hidden fields
				if (document.getElementById('user_name')) {
					document.getElementById('user_name').value = data.acc_email_1;
				}
				if (document.getElementById('pass_word')) {
					document.getElementById('pass_word').value = data.acc_password;
				}
				hideForm('timer', 'timer-inner');
				domain_name = data.domain_name;
				JSmessage_accSignup('We have created your account! Logging you in now...', data.acc_email_1, data.acc_password);
				//setTimeout(function() {
					// https://www.gemselect.com/account/acc_main.php
					//uri = 'https://www.gemselect.com/account/acc_main.php';
					//window.open(uri, '_self');
					//location.reload();
					//hideForm('acc-div', 'acc-cont');
				//}, 2500);
			}
			if (data.AccountSignUp == 'user_exists') {
				hideForm('timer', 'timer-inner');
				JSmessage('A user with the same email already exists! Please email us if it is your email');
				return;
			}


			// online account sign-up
			if (data.accSignUp == 'email_invalid') {
				hideForm('timer', 'timer-inner');
				JSmessage('Please check your email, it seems invalid!');
				return;
			}
			if (data.accSignUp == 'acc_signedup') {
				hideForm('timer', 'timer-inner');
				domain_name = data.domain_name;
				JSmessage('We have created your account! You will receive an email with login data shortly.');
				uri = 'http://' + domain_name + '/';
				RecURL(uri,'AjaxGeneral');
				window.open(uri, '_self');
			}
			if (data.accSignUp == 'user_exists') {
				hideForm('timer', 'timer-inner');
				JSmessage('A user with the same email already exists! Please email us if it is your email');
				// acc_email_1
				if (document.getElementById('acc_email_1')) {
					document.getElementById('acc_email_1').focus();
				}
				return;
			}
			// online account sign-In
			if (data.userLogin == 'no_user') {
				JSmessage('We did not find a match for that email / user-name!');
				if (document.getElementById('user_name')) {
					document.getElementById('user_name').style.backgroundColor = "#FFE8E8";
					document.getElementById('user_name').focus();
				}
				return;
			}
			if (data.userLogin == 'loged_in') {
				new_session = data.new_session;
				domain_name = data.domain_name;
				//JSmessage('You are now logged in!');
				showForm('timer', 'timer-inner');
				uri = 'https://' + domain_name + '/' + data.language_stick + '/account/acc_main.php';
				RecURL(uri,'AjaxGeneral');
				window.open(uri, '_self');
			}
			if (data.userLogin == 'wrong_pass') {
				JSmessage('The password does not match our records, please try again!');
				document.getElementById('pass_word').style.backgroundColor = "#FFE8E8";
				document.getElementById('pass_word').value = '';
				document.getElementById('pass_word').focus();
				document.getElementById('pass_hint').style.display = "";
				document.getElementById('pass_hint').innerHTML = data.passhint;
				return;
			}
			if (data.logOut == 'out') {
				//JSmessage('You are now logged out!');
				domain_name = document.getElementById('domain_name').value;
				if (data.language_stick != 'english') {
					uri = 'https://' + domain_name + '/' + data.language_stick + '/index.php';
				} else {
					uri = 'https://' + domain_name + '/index.php';
				}
				RecURL(uri,'AjaxGeneral');
				window.open(uri, '_self');
				if (document.getElementById('user_log')) {
					document.getElementById('user_log').style.display = 'none';
				}
			}
			if (data.setNewPassword == '1') {
				JSmessage('Your password has been updated!');
				document.getElementById('old_pass').value = '';
				document.getElementById('new_pass').value = '';
				document.getElementById('new_pass_conf').value = '';
				document.getElementById('change_pass').style.fontWeight = 'normal';
				document.getElementById('change_pass').value = "Change Password";
				pp = document.getElementsByClassName("pass");
				for (i = 0; i < pp.length; i++) {
					pp[i].style.display = 'none';
				}
			}
			if (data.setNewPassword == '2') {
				JSmessage('Old Password does not match our records!');
				document.getElementById('old_pass').style.backgroundColor = "#FFE8E8";
				document.getElementById('old_pass').value = '';
				document.getElementById('old_pass').focus();
			}
			if (data.setNewPassword == '4') {
				//
			}
			if (data.updateAccount == '1') {
				JSmessage('Your Account is now updated');
			}
			if (data.updateAccount == '4') {
				//
			}
			if (data.requestPass == '1') {
				JSmessage('Your request has been received, we will contact your shortly');
				// send back to homepage
				domain_name = document.getElementById('domain_name').value;
				uri = 'http://' + domain_name + '/';
				setTimeout(function() {
					hideForm('timer', 'timer-inner');
					RecURL(uri,'AjaxGeneral');
					window.open(uri, "_self");
				}, 2000);
			}
			if (data.requestPass == '2') {
				JSmessage('The email address did not validate, please check the meail address');
				return;
			}
			if (data.requestPass == '3') {
				JSmessage('This email does not exist in our system!');
				// forgot_pass
				document.getElementById('forgot_pass').style.backgroundColor = "#FFE8E8";
				document.getElementById('forgot_pass').focus();
				return;
			}
			if (data.removeNLemail == '1') {
				alert('Your email has been removed from the Newsletter-List');
				// send back to homepage
				domain_name = document.getElementById('domain_name').value;
				uri = 'http://' + domain_name + '/';
				//setTimeout(function() {
					RecURL(uri,'AjaxGeneral');
					window.open(uri, "_self");
				//}, 3500);

			} else {
				// problem removing email
			}
			if (data.QTYdetails == '1') {
				price_id = 'prod_' + data.qty_prodid;
				document.getElementById(price_id).innerHTML = data.price_currency.toFixed(2);
				price_id_hidden = 'prod_price_' + data.qty_prodid;
				document.getElementById(price_id_hidden).value = data.new_price;
				// update qty
				qty_id = 'new_qty_' + data.qty_prodid;
				if (document.getElementById(qty_id)) {
					document.getElementById(qty_id).innerHTML = data.qty_selected;
				}
				//CallFlyingCart();
			}
			if (data.QTYdetails == '2') {
				// do nothing
			}
			if (data.getRingSizes == '1') {
				document.getElementById('ring_size').innerHTML = data.html;
				// thumb_url
				document.getElementById('thumb_url').src = data.thumb_url;
				document.getElementById('thumb_design_url').src = data.thumb_design_url;
			}
			if (data.addJewelryDesign == '1') {
				// change text for "build_butt"
				document.getElementById('build_butt').style.color = '#006600';
				document.getElementById('build_butt').innerHTML = 'Item is in Cart';
				//CallFlyingCart();
			}
			if (data.CloseAccount == 1) {
				hideForm('timer', 'timer-inner');
				JSmessage_closeAcc('Your account has been closed now!');
			}
			if (data.CloseAccount == 2) {
				hideForm('timer', 'timer-inner');
				JSmessage_closeAcc('Invalid closing attempt');
			}
			if (data.updateLang == 1) {
				//hideForm('timer','timer-inner');
				//url = 'https://' + data.domain + '/' + data.curr_uri;
				//window.open(url, "_self");				
			}
			if (data.updateLang_new == 1) {
				hideForm('timer', 'timer-inner');
				uri = data.lang_uri;
				RecURL(uri,'AjaxGeneral');
				window.open(uri, "_self");
			}
			if (data.THlogin == 1) {
				//JSmessage('Login Successful!');
				uri = 'https://www.gemselect.com/index.php';
				window.open(uri, "_self");
			}
			if (data.THlogin == 2) {
				alert('The Email entered has no valid format!');
				document.getElementById('th_user').focus();
				return;
			}
			if (data.THlogin == 3) {
				alert('Sorry, the password does not match our records');
				document.getElementById('th_pwd').focus();
				return;
			}
			if (data.SaveTransVal == 1) {
				document.getElementById('new_value').value = '';
				hideForm('trans-div', 'trans-cont');
				JSmessage('Updated');
				location.reload();
			}
			if (data.GSaccountCheck == 1) {
				hideForm('timer', 'timer-inner');
				document.getElementById('login_type').value = 'facebook';
				document.getElementById('f_email').value = data.user_email;
				userLogin();
			}
			if (data.getStates == 1) {
				hideForm('timer', 'timer-inner');
				document.getElementById('state_dropdown_td').innerHTML = data.html;
				document.getElementById('state_dropdown').style.display = '';
				document.getElementById('state_input').style.display = 'none';
				document.getElementById('pp_state').focus();
				document.getElementById('pp_state').style.backgroundColor = '#E6FFE6';
			}
			if (data.getStates == 0) {
				hideForm('timer', 'timer-inner');
				document.getElementById('state_dropdown').style.display = 'none';
				document.getElementById('state_input').style.display = '';
				document.getElementById('state').value = '';
				document.getElementById('state').focus();
				document.getElementById('state').style.backgroundColor = '#E6FFE6';
			}


			if (data.getStates_2 == 1) {
				state_bg = document.getElementById('state_bg').value;
				hideForm('timer', 'timer-inner');
				document.getElementById('st_select').innerHTML = data.html;
				document.getElementById('st_select').style.display = '';
				document.getElementById('h_state').style.display = 'none';
				document.getElementById('state').style.display = 'none';
				if (state_bg == '') {
					document.getElementById('state_select').style.backgroundColor = '#E6FFE6';
					document.getElementById('state_select').focus();
					$("#state_select").val("0");
				} else {
					$("#state_select").val(state_bg);
					document.getElementById('state_bg').value = '';
				}
			}
			if (data.getStates_2 == 0) {
				hideForm('timer', 'timer-inner');
				document.getElementById('st_select').style.display = 'none';
				document.getElementById('h_state').style.display = '';
				// check if id state_bg has a value
				st_bg = '';
				if (document.getElementById('state_bg').value) {
					st_bg = document.getElementById('state_bg').value;
				}
				if (st_bg != '') {
					document.getElementById('state').style.display = '';
					document.getElementById('state').value = st_bg;
					document.getElementById('state').style.color = 'black';
				} else {
					document.getElementById('state').style.display = '';
					document.getElementById('state').focus();
					document.getElementById('state').style.backgroundColor = '#E6FFE6';
				}
			}
			if (data.GetSubCl == 1) {
				//console.log(data.html);
				showForm_NEW('clgroup-div', 'clgroup-cont');
				document.getElementById('clgroup-inner').innerHTML = data.html;
				if (document.getElementById('clm-div')) {
					document.getElementById('clm-div').style.display = 'block';
				}
			}
			if (data.GetSubCl == 2) {
				//showForm_NEW('clgroup-div','clgroup-cont');
				GetBaseCL('Multicolor');
			}
			if (data.setSwitch == 1) {
				uri = window.location.href;
				RecURL(uri,'AjaxGeneral');
				window.open(uri, "_self");
			}
			if (data.GSaccountCheck == 0) {
				hideForm('timer', 'timer-inner');
				showForm('fb-div', 'fb-cont');
				if (document.getElementById('fb_tmp_msg')) {
					document.getElementById('fb_tmp_msg').style.display = '';
					document.getElementById('g_signin').style.display = 'none';
					document.getElementById('f_link').style.display = 'none';
				}
				if (document.getElementById('fb_mob_init_msg')) {
					document.getElementById('acc_login').style.display = 'none';
					document.getElementById('mob_acc_log_msg').style.display = '';
					document.getElementById('fb_sign_in_mob').style.display = 'none';
				}
			}
			if (data.UpdateTopazColor == 1) {
				//alert('Color has been updated');
				document.getElementById('row_' + data.prodid).style.display = 'none';
				document.getElementById('count').innerHTML = data.count;
				return;
			}
			if (data.ShowCurr == 1) {
				hideForm('timer', 'timer-inner');
				document.getElementById('curr_pl').innerHTML = data.html;
				showForm_NEW('cur-div','cur-cont');
			}
			if (data.LanguagePop == 1) {
				hideForm('timer', 'timer-inner');
				document.getElementById('pl_in').innerHTML = data.html;
				// inject sess_id
				sess_id = document.getElementById('stick').value;
				sc = document.getElementsByName('sess_change');
				for (var i = 0; i < sc.length; i++) {
					sc[i].value = sess_id;
				}
				showForm_NEW('lang-div','lang-cont');
			}
			if (data.MoreShapes == 1) {
				document.getElementById('shape_pl').innerHTML = data.html;
				showForm_NEW('mshape-div','mshape-cont');
			}
			if (data.ShowSizeComp == 1) {
				hideForm('timer', 'timer-inner');
				document.getElementById('size_comp').innerHTML = data.html;
				showForm_NEW('size-div','size-cont');
			}
			if (data.WeightExplained == 1) {
				hideForm('timer', 'timer-inner');
				document.getElementById('size_comp').innerHTML = data.html;
				showForm_NEW('size-div','size-cont');
			}
			if (data.ClarityExplained == 1) {
				hideForm('timer', 'timer-inner');
				document.getElementById('size_comp').innerHTML = data.html;
				showForm_NEW('size-div','size-cont');
			}
			if (data.TreatmentExplained == 1) {
				hideForm('timer', 'timer-inner');
				document.getElementById('size_comp').innerHTML = data.html;
				showForm_NEW('size-div','size-cont');
			}
			if (data.UpdateTopazColor == 0) {
				alert('ERROR: Please contact IT department');
				return;
			}
			if (data.IncPrice == 1) {
				hideForm('timer', 'timer-inner');
				//alert('Price has been updated');
				location.reload();
			}
			if (data.Restore_price == 1) {
				hideForm('timer', 'timer-inner');
				//alert('Price has been restored');
				location.reload();
			}
			if (data.SetNewPrice == 1) {
				hideForm('timer', 'timer-inner');
				//alert('Price has been updated');
				location.reload();
			}
			if (data.GotoCustAdd == 1) {
				hideForm('timer', 'timer-inner');
				if (document.getElementById('cust_add_url')) {
					uri = document.getElementById('cust_add_url').value;

					if (data.test) {
						uri = document.getElementById('cust_add_url_2').value;
					}

					//sess_id = document.getElementById('stick').value;
					//if (sess_id != '') {
						//uri_sess = uri + '?sessid=' + sess_id;
					//}
					if (document.forms['stick_f']) {
						document.forms['stick_f'].action = uri;
						document.forms['stick_f'].target = '_self';
						document.forms['stick_f'].submit();
					}
					//window.open(uri_sess, "_self");
				}
			}
			/* END if Blocks */
		},
		error: function() {
			// new Iphone seem not to work with Ajax on the receiving part
			// we just send the form anyway if we get this Error
			setTimeout(function() {
				hideForm('timer', 'timer-inner');
			}, 60000);
			// submit form "form1"
			if (document.getElementById("form1")) {
				document.getElementById("form1").submit();
			}
		}
	});
}

function ResetEmailInputs() {
	if (document.getElementById('subject')) {
		document.getElementById('subject').value = 0;
	}
	if (document.getElementById('subj_1')) {
		document.getElementById('inp_1').checked = true;
	}
	document.getElementById('email').value = '';
	document.getElementById('confirm_email').value = '';
	if (document.getElementById('msg')) {
		document.getElementById('msg').value = '';
	}
	if (document.getElementById('msg_2')) {
		document.getElementById('msg_2').value = '';
	}
	document.getElementById('validate_cont_img').value = '';
}

function Mob_showFBmsg() {
	$("#fb_mob_init_msg").delay(1500).fadeIn(800);
}

function updateLang2(language) {
	document.getElementById('lang_selected').value = language;
	updateLang();
}

function updateLang() {
	// update DBonline.sticky_sessions.language with selected language "lang"
	lang_selected = document.getElementById('lang_selected').value;
	sess_id = document.getElementById('stick').value;
	dataset = {
		language: lang,
		sess_id: sess_id
	};
	URL = '/includes/inc/ajax_receiver.php?job=updateLang';
	AjaxGeneral(URL, dataset);
}

function updateLang_new(lang, lang_uri) {
	showForm('timer', 'timer-inner');
	sess_id = document.getElementById('stick').value;
	dataset = {
		language: lang,
		sess_id: sess_id,
		lang_uri: lang_uri
	};
	URL = '/includes/inc/ajax_receiver.php?job=updateLang_new';
	AjaxGeneral(URL, dataset);
}

function changeLanguage(lang, lang_code) {
	l_code = lang_code;
	// update DBonline.sticky_sessions.language with selected language "lang"
	lang_selected = document.getElementById('lang_selected').value;
	curr_page = 0;
	if (document.getElementById('page')) {
		curr_page = document.getElementById('page').value;
	}
	curr_lang = lang_selected.toLowerCase();
	uri_path_tmp = document.getElementById('uri_path_full').value;
	if (curr_page > 0) {
		// check if question mark in string
		q_mark = uri_path_tmp.indexOf("?");
		if (q_mark > 0) {
			uri_path = uri_path_tmp + '&page=' + curr_page;
		} else {
			uri_path = uri_path_tmp + '?page=' + curr_page;
		}
	} else {
		uri_path = uri_path_tmp;
	}
	sess_id = document.getElementById('stick').value;
	dataset = {
		language: lang,
		sess_id: sess_id,
		uri_path: uri_path,
		curr_lang: curr_lang
	};
	URL = '/includes/inc/ajax_receiver.php?job=changeLanguage';
	AjaxGeneral(URL, dataset);
	hideForm('language', 'language-inner');
	showForm('timer', 'timer-inner');
}

// call language popup
function AjaxLanguage(URL, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL,
		data: dataset,
		dataType: "json",
		success: function(data) {
			document.getElementById('lang').innerHTML = data.html;
		},
		error: function() {}
	});
}

function Languages() {
	lang = document.getElementById('lang_selected').value;
	sess_id = document.getElementById('stick').value;
	dataset = {
		sess_id: sess_id,
		language: lang
	};
	URL = '/includes/inc/language_selector.php';
	AjaxLanguage(URL, dataset);
}

// Javascript library for input form validation. Used on "cust-address.php"
function trim(s) {
	return s.replace(/^\s+|\s+$/, '');
}

function validatePhone(fld) {
	var error = "";
	var tfld = trim(fld.value);
	if (tfld == "") {
		fld.style.background = 'LightYellow';
		fld.focus();
		error = "Please fill in a valid telephone number.";
	}
	return error;
}

function validateEmail(fld) {
	var error = "";
	var tfld = trim(fld.value); // value of field with whitespace trimmed off
	var emailFilter = /^[^@]+@[^@.]+\.[^@]*\w\w$/;
	var illegalChars = /[\(\)\<\>\,\;\:\\\"\[\]]/;
	if (fld.value == "") {
		fld.style.background = 'LightYellow';
		fld.focus();
		error = "Please fill in a valid email address.";
	} else if (!emailFilter.test(tfld)) { //test email for illegal characters
		fld.style.background = 'LightYellow';
		fld.focus();
		error = "Please enter a valid email address.";
	} else if (fld.value.match(illegalChars)) {
		fld.style.background = 'LightYellow';
		fld.focus();
		error = "Email address entered contains illegal characters.\nPlease fill in again.";
	} else {
		fld.style.background = 'White';
	}
	return error;
}

function validateEmpty(fld, type) {
	//HideOverLay(fld);
	var error = "";
	if (fld.value.length == 0) {
		fld.style.background = 'LightYellow';
		fld.focus();
		error = "Please fill in " + type;
	} else {
		fld.style.background = 'White';
	}
	return error;
}

function validateCustAddressForm(inputform) {
	// Validates the customer address form and submits
	// if all is okay.
	var validate_msg = "";
	validate_msg += validateEmpty(inputform.first_name, "First Name");
	if (validate_msg == "")
		validate_msg += validateEmpty(inputform.last_name, "Last Name");
	if (validate_msg == "")
		validate_msg += validateEmpty(inputform.address_1, "Address");
	if (validate_msg == "")
		validate_msg += validateEmpty(inputform.city, "City");
	if (validate_msg == "")
		validate_msg += validateEmpty(inputform.state, "State or Province");
	if (validate_msg == "")
		validate_msg += validateEmpty(inputform.country, "Country");
	if (validate_msg == "")
		validate_msg += validateEmpty(inputform.customer_postal_code, "Postal code");
	if (validate_msg == "")
		validate_msg += validatePhone(inputform.customer_phone);
	if (validate_msg == "")
		validate_msg += validateEmail(inputform.customer_email);
	if (validate_msg == "")
		validate_msg += validateEmail(inputform.email_conf);

	if (validate_msg != "") {
		JSmessage(validate_msg);
		return false;
	}

	// Check for matching email/confirmation email addresses
	email1 = trim(inputform.customer_email.value);
	email2 = trim(inputform.email_conf.value);

	if (email1 != email2) {
		JSmessage("Email does not match confirmation email");
		return false;
	}
	// lock item in DBonline.products_locked
	setProductToLocked();

	// All validated, submit the form
	//inputform.submit();
	//return true;
}
// END Javascript library for input form validation
// ************************************************

function setProductToLocked() {
	sess_id = document.getElementById('stick').value;
	dataset = {
		sess_id: sess_id
	};
	URL = '/includes/inc/ajax_receiver.php?job=setProductToLocked';
	AjaxGeneral(URL, dataset);
}

function checkEvent(e, prodid) {
	if (e.target == '[object HTMLDivElement]') {
		comp_id = 'comp_' + prodid;
		checked_comp = document.getElementById(comp_id).checked;
	} else {
		comp_id = 'comp_' + prodid;
		checked_comp = document.getElementById(comp_id).checked;
		if (checked_comp == false) {
			checked_comp = true;
		} else {
			checked_comp = false;
		}
	}
	compItems(prodid, checked_comp);
}

function compItems(prodid, checked_comp) {
	lang = document.getElementById('lang_selected').value.toLowerCase();
	if (prodid !== 0) {
		if (checked_comp == false) {
			document.getElementById(comp_id).checked = true;
			comp_value = 'add';
			flyToCartComp(prodid);
		} else {
			document.getElementById(comp_id).checked = false;
			comp_value = 'remove';
		}
	} else {
		comp_value = 'refresh';
	}
	sess_id = document.getElementById('stick').value;
	dataset = {
		lang: lang,
		prodid: prodid,
		sess_id: sess_id,
		comp_item: comp_value
	};
	URL = '/includes/inc/compare_products.php';
	AjaxGeneral(URL, dataset);
}


/*
  SortTable
  version 2
  7th April 2007
  Stuart Langridge, http://www.kryogenix.org/code/browser/sorttable/

  Instructions:
  Download this file
  Add <script src="sorttable.js"></script> to your HTML
  Add class="sortable" to any table you'd like to make sortable
  Click on the headers to sort

  Thanks to many, many people for contributions and suggestions.
  Licenced as X11: http://www.kryogenix.org/code/browser/licence.html
  This basically means: do what you want with it.
*/


var stIsIE = /*@cc_on!@*/ false;

sorttable = {
	init: function() {
		// quit if this function has already been called
		if (arguments.callee.done) return;
		// flag this function so we don't do the same thing twice
		arguments.callee.done = true;
		// kill the timer
		if (_timer) clearInterval(_timer);

		if (!document.createElement || !document.getElementsByTagName) return;

		sorttable.DATE_RE = /^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/;

		forEach(document.getElementsByTagName('table'), function(table) {
			if (table.className.search(/\bsortable\b/) != -1) {
				sorttable.makeSortable(table);
			}
		});

	},

	makeSortable: function(table) {
		if (table.getElementsByTagName('thead').length == 0) {
			// table doesn't have a tHead. Since it should have, create one and
			// put the first table row in it.
			the = document.createElement('thead');
			the.appendChild(table.rows[0]);
			table.insertBefore(the, table.firstChild);
		}
		// Safari doesn't support table.tHead, sigh
		if (table.tHead == null) table.tHead = table.getElementsByTagName('thead')[0];

		if (table.tHead.rows.length != 1) return; // can't cope with two header rows

		// Sorttable v1 put rows with a class of "sortbottom" at the bottom (as
		// "total" rows, for example). This is B&R, since what you're supposed
		// to do is put them in a tfoot. So, if there are sortbottom rows,
		// for backwards compatibility, move them to tfoot (creating it if needed).
		sortbottomrows = [];
		for (var i = 0; i < table.rows.length; i++) {
			if (table.rows[i].className.search(/\bsortbottom\b/) != -1) {
				sortbottomrows[sortbottomrows.length] = table.rows[i];
			}
		}
		if (sortbottomrows) {
			if (table.tFoot == null) {
				// table doesn't have a tfoot. Create one.
				tfo = document.createElement('tfoot');
				table.appendChild(tfo);
			}
			for (i = 0; i < sortbottomrows.length; i++) {
				tfo.appendChild(sortbottomrows[i]);
			}
			sortbottomrows = [];
		}

		// work through each column and calculate its type
		headrow = table.tHead.rows[0].cells;
		for (i = 0; i < headrow.length; i++) {
			// manually override the type with a sorttable_type attribute
			if (!headrow[i].className.match(/\bsorttable_nosort\b/)) { // skip this col
				mtch = headrow[i].className.match(/\bsorttable_([a-z0-9]+)\b/);
				if (mtch) {
					override = mtch[1];
				}
				if (mtch && typeof sorttable["sort_" + override] == 'function') {
					headrow[i].sorttable_sortfunction = sorttable["sort_" + override];
				} else {
					headrow[i].sorttable_sortfunction = sorttable.guessType(table, i);
				}
				// make it clickable to sort
				headrow[i].sorttable_columnindex = i;
				headrow[i].sorttable_tbody = table.tBodies[0];
				dean_addEvent(headrow[i], "click", sorttable.innerSortFunction = function(e) {
					inc_e = e;

					if (this.className.search(/\bsorttable_sorted\b/) != -1) {
						// if we're already sorted by this column, just
						// reverse the table, which is quicker
						sorttable.reverse(this.sorttable_tbody);
						this.className = this.className.replace('sorttable_sorted',
							'sorttable_sorted_reverse');
						this.removeChild(document.getElementById('sorttable_sortfwdind'));
						sortrevind = document.createElement('span');
						sortrevind.id = "sorttable_sortrevind";
						sortrevind.innerHTML = stIsIE ? '&nbsp<font face="webdings">5</font>' : '&nbsp;&#x25B4;';
						this.appendChild(sortrevind);
						return;
					}
					if (this.className.search(/\bsorttable_sorted_reverse\b/) != -1) {
						// if we're already sorted by this column in reverse, just
						// re-reverse the table, which is quicker
						sorttable.reverse(this.sorttable_tbody);
						this.className = this.className.replace('sorttable_sorted_reverse',
							'sorttable_sorted');
						this.removeChild(document.getElementById('sorttable_sortrevind'));
						sortfwdind = document.createElement('span');
						sortfwdind.id = "sorttable_sortfwdind";
						sortfwdind.innerHTML = stIsIE ? '&nbsp<font face="webdings">6</font>' : '&nbsp;&#x25BE;';
						this.appendChild(sortfwdind);
						return;
					}

					// remove sorttable_sorted classes
					theadrow = this.parentNode;
					forEach(theadrow.childNodes, function(cell) {
						if (cell.nodeType == 1) { // an element
							cell.className = cell.className.replace('sorttable_sorted_reverse', '');
							cell.className = cell.className.replace('sorttable_sorted', '');
						}
					});
					sortfwdind = document.getElementById('sorttable_sortfwdind');
					if (sortfwdind) {
						sortfwdind.parentNode.removeChild(sortfwdind);
					}
					sortrevind = document.getElementById('sorttable_sortrevind');
					if (sortrevind) {
						sortrevind.parentNode.removeChild(sortrevind);
					}

					this.className += ' sorttable_sorted';
					sortfwdind = document.createElement('span');
					sortfwdind.id = "sorttable_sortfwdind";
					sortfwdind.innerHTML = stIsIE ? '&nbsp<font face="webdings">6</font>' : '&nbsp;&#x25BE;';
					this.appendChild(sortfwdind);

					// build an array to sort. This is a Schwartzian transform thing,
					// i.e., we "decorate" each row with the actual sort key,
					// sort based on the sort keys, and then put the rows back in order
					// which is a lot faster because you only do getInnerText once per row
					row_array = [];
					col = this.sorttable_columnindex;
					rows = this.sorttable_tbody.rows;
					for (j = 0; j < rows.length; j++) {
						row_array[row_array.length] = [sorttable.getInnerText(rows[j].cells[col]), rows[j]];
					}
					/* If you want a stable sort, uncomment the following line */
					//sorttable.shaker_sort(row_array, this.sorttable_sortfunction);
					/* and comment out this one */
					row_array.sort(this.sorttable_sortfunction);

					tb = this.sorttable_tbody;
					for (j = 0; j < row_array.length; j++) {
						tb.appendChild(row_array[j][1]);
					}

					row_array = [];
				});
			}
		}
	},

	guessType: function(table, column) {
		// guess the type of a column based on its first non-blank row
		sortfn = sorttable.sort_alpha;
		for (var i = 0; i < table.tBodies[0].rows.length; i++) {
			text = sorttable.getInnerText(table.tBodies[0].rows[i].cells[column]);
			if (text != '') {
				if (text.match(/^-?[�$�]?[\d,.]+%?$/)) {
					return sorttable.sort_numeric;
				}
				// check for a date: dd/mm/yyyy or dd/mm/yy
				// can have / or . or - as separator
				// can be mm/dd as well
				possdate = text.match(sorttable.DATE_RE);
				if (possdate) {
					// looks like a date
					first = parseInt(possdate[1]);
					second = parseInt(possdate[2]);
					if (first > 12) {
						// definitely dd/mm
						return sorttable.sort_ddmm;
					} else if (second > 12) {
						return sorttable.sort_mmdd;
					} else {
						// looks like a date, but we can't tell which, so assume
						// that it's dd/mm (English imperialism!) and keep looking
						sortfn = sorttable.sort_ddmm;
					}
				}
			}
		}
		return sortfn;
	},

	getInnerText: function(node) {
		// gets the text we want to use for sorting for a cell.
		// strips leading and trailing whitespace.
		// this is *not* a generic getInnerText function; it's special to sorttable.
		// for example, you can override the cell text with a customkey attribute.
		// it also gets .value for <input> fields.

		if (!node) return "";

		hasInputs = (typeof node.getElementsByTagName == 'function') &&
			node.getElementsByTagName('input').length;

		if (node.getAttribute("sorttable_customkey") != null) {
			return node.getAttribute("sorttable_customkey");
		} else if (typeof node.textContent != 'undefined' && !hasInputs) {
			return node.textContent.replace(/^\s+|\s+$/g, '');
		} else if (typeof node.innerText != 'undefined' && !hasInputs) {
			return node.innerText.replace(/^\s+|\s+$/g, '');
		} else if (typeof node.text != 'undefined' && !hasInputs) {
			return node.text.replace(/^\s+|\s+$/g, '');
		} else {
			switch (node.nodeType) {
				case 3:
					if (node.nodeName.toLowerCase() == 'input') {
						return node.value.replace(/^\s+|\s+$/g, '');
					}
				case 4:
					return node.nodeValue.replace(/^\s+|\s+$/g, '');
					break;
				case 1:
				case 11:
					var innerText = '';
					for (var i = 0; i < node.childNodes.length; i++) {
						innerText += sorttable.getInnerText(node.childNodes[i]);
					}
					return innerText.replace(/^\s+|\s+$/g, '');
					break;
				default:
					return '';
			}
		}
	},

	reverse: function(tbody) {
		// reverse the rows in a tbody
		newrows = [];
		for (var i = 0; i < tbody.rows.length; i++) {
			newrows[newrows.length] = tbody.rows[i];
		}
		for (i = newrows.length - 1; i >= 0; i--) {
			tbody.appendChild(newrows[i]);
		}
		newrows = [];
	},

	/* sort functions
	   each sort function takes two parameters, a and b
	   you are comparing a[0] and b[0] */
	sort_numeric: function(a, b) {
		aa = parseFloat(a[0].replace(/[^0-9.-]/g, ''));
		if (isNaN(aa)) aa = 0;
		bb = parseFloat(b[0].replace(/[^0-9.-]/g, ''));
		if (isNaN(bb)) bb = 0;
		return aa - bb;
	},
	sort_alpha: function(a, b) {
		if (a[0] == b[0]) return 0;
		if (a[0] < b[0]) return -1;
		return 1;
	},
	sort_ddmm: function(a, b) {
		mtch = a[0].match(sorttable.DATE_RE);
		y = mtch[3];
		m = mtch[2];
		d = mtch[1];
		if (m.length == 1) m = '0' + m;
		if (d.length == 1) d = '0' + d;
		dt1 = y + m + d;
		mtch = b[0].match(sorttable.DATE_RE);
		y = mtch[3];
		m = mtch[2];
		d = mtch[1];
		if (m.length == 1) m = '0' + m;
		if (d.length == 1) d = '0' + d;
		dt2 = y + m + d;
		if (dt1 == dt2) return 0;
		if (dt1 < dt2) return -1;
		return 1;
	},
	sort_mmdd: function(a, b) {
		mtch = a[0].match(sorttable.DATE_RE);
		y = mtch[3];
		d = mtch[2];
		m = mtch[1];
		if (m.length == 1) m = '0' + m;
		if (d.length == 1) d = '0' + d;
		dt1 = y + m + d;
		mtch = b[0].match(sorttable.DATE_RE);
		y = mtch[3];
		d = mtch[2];
		m = mtch[1];
		if (m.length == 1) m = '0' + m;
		if (d.length == 1) d = '0' + d;
		dt2 = y + m + d;
		if (dt1 == dt2) return 0;
		if (dt1 < dt2) return -1;
		return 1;
	},

	shaker_sort: function(list, comp_func) {
		// A stable sort function to allow multi-level sorting of data
		// see: http://en.wikipedia.org/wiki/Cocktail_sort
		// thanks to Joseph Nahmias
		var b = 0;
		var t = list.length - 1;
		var swap = true;

		while (swap) {
			swap = false;
			for (i = b; i < t; ++i) {
				if (comp_func(list[i], list[i + 1]) > 0) {
					q = list[i];
					list[i] = list[i + 1];
					list[i + 1] = q;
					swap = true;
				}
			} // for
			t--;

			if (!swap) break;

			for (i = t; i > b; --i) {
				if (comp_func(list[i], list[i - 1]) < 0) {
					q = list[i];
					list[i] = list[i - 1];
					list[i - 1] = q;
					swap = true;
				}
			} // for
			b++;

		} // while(swap)
	}
};

/* ******************************************************************
   Supporting functions: bundled here to avoid depending on a library
   ****************************************************************** */

// Dean Edwards/Matthias Miller/John Resig

/* for Mozilla/Opera9 */
if (document.addEventListener) {
	document.addEventListener("DOMContentLoaded", sorttable.init, false);
}

/* for Internet Explorer */
/*@cc_on @*/
/*@if (@_win32)
    document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
    var script = document.getElementById("__ie_onload");
    script.onreadystatechange = function() {
        if (this.readyState == "complete") {
            sorttable.init(); // call the onload handler
        }
    };
/*@end @*/

/* for Safari */
if (/WebKit/i.test(navigator.userAgent)) { // sniff
	var _timer = setInterval(function() {
		if (/loaded|complete/.test(document.readyState)) {
			sorttable.init(); // call the onload handler
		}
	}, 10);
}

/* for other browsers */
window.onload = sorttable.init;

// written by Dean Edwards, 2005
// with input from Tino Zijdel, Matthias Miller, Diego Perini

// http://dean.edwards.name/weblog/2005/10/add-event/

function dean_addEvent(element, type, handler) {
	if (element.addEventListener) {
		element.addEventListener(type, handler, false);
	} else {
		// assign each event handler a unique ID
		if (!handler.$$guid) handler.$$guid = dean_addEvent.guid++;
		// create a hash table of event types for the element
		if (!element.events) element.events = {};
		// create a hash table of event handlers for each element/event pair
		var handlers = element.events[type];
		if (!handlers) {
			handlers = element.events[type] = {};
			// store the existing event handler (if there is one)
			if (element["on" + type]) {
				handlers[0] = element["on" + type];
			}
		}
		// store the event handler in the hash table
		handlers[handler.$$guid] = handler;
		// assign a global event handler to do all the work
		element["on" + type] = handleEvent;
	}
}
// a counter used to create unique IDs
dean_addEvent.guid = 1;

function removeEvent(element, type, handler) {
	if (element.removeEventListener) {
		element.removeEventListener(type, handler, false);
	} else {
		// delete the event handler from the hash table
		if (element.events && element.events[type]) {
			delete element.events[type][handler.$$guid];
		}
	}
}

function handleEvent(event) {
	var returnValue = true;
	// grab the event object (IE uses a global event object)
	event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
	// get a reference to the hash table of event handlers
	var handlers = this.events[event.type];
	// execute each event handler
	for (var i in handlers) {
		this.$$handleEvent = handlers[i];
		if (this.$$handleEvent(event) === false) {
			returnValue = false;
		}
	}
	return returnValue;
}

function fixEvent(event) {
	// add W3C standard event methods
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	return event;
}
fixEvent.preventDefault = function() {
	this.returnValue = false;
};
fixEvent.stopPropagation = function() {
	this.cancelBubble = true;
};

// Dean's forEach: http://dean.edwards.name/base/forEach.js
/*
	forEach, version 1.0
	Copyright 2006, Dean Edwards
	License: http://www.opensource.org/licenses/mit-license.php
*/

// array-like enumeration
if (!Array.forEach) { // mozilla already supports this
	Array.forEach = function(array, block, context) {
		for (var i = 0; i < array.length; i++) {
			block.call(context, array[i], i, array);
		}
	};
}

// generic enumeration
Function.prototype.forEach = function(object, block, context) {
	for (var key in object) {
		if (typeof this.prototype[key] == "undefined") {
			block.call(context, object[key], key, object);
		}
	}
};

// character enumeration
String.forEach = function(string, block, context) {
	Array.forEach(string.split(""), function(chr, index) {
		block.call(context, chr, index, string);
	});
};

// globally resolve forEach enumeration
var forEach = function(object, block, context) {
	if (object) {
		var resolve = Object; // default
		if (object instanceof Function) {
			// functions have a "length" property
			resolve = Function;
		} else if (object.forEach instanceof Function) {
			// the object implements a custom forEach method so use that
			object.forEach(block, context);
			return;
		} else if (typeof object == "string") {
			// the object is a string
			resolve = String;
		} else if (typeof object.length == "number") {
			// the object is array-like
			resolve = Array;
		}
		resolve.forEach(object, block, context);
	}
};
// end sorttable functions
//################################################################################################

function selectCert(prodid, certkey, e) {
	if (e.target == '[object HTMLInputElement]' || e.srcElement == '[object HTMLInputElement]') {
		// do nothing
	} else {
		document.getElementById(certkey).checked = true;
	}
	document.getElementById('addon_selected').value = certkey;

	sess_id = document.getElementById('stick').value;
	dataset = {
		sess_id: sess_id,
		certkey: certkey,
		prodid: prodid
	};
	URL = '/includes/inc/ajax_receiver.php?job=selectCert';
	AjaxGeneral(URL, dataset);
}

function ShowCertOptions() {
	current_status = document.getElementById('cert-options').style.display;
	if (current_status == 'none') {
		document.getElementById('cert-options').style.display = '';
	} else {
		document.getElementById('cert-options').style.display = 'none';
	}
}

function removeAddon(addon_id) {
	page = document.getElementById('uri_path').value;
	showForm('timer', 'timer-inner');
	dataset = {
		addon_id: addon_id,
		page: page
	};
	URL = '/includes/inc/ajax_receiver.php?job=removeAddon';
	AjaxGeneral(URL, dataset);
}

function emailFriend() {
	mobile_phone = document.getElementById('mobile_phone').value;
	sess_id = document.getElementById('stick').value;
	language = document.getElementById('lang_selected').value;
	// adjust top for mobile phone
	top_margin = '50px';
	if (mobile_phone == 1) {
		px = getScrollTop();
		top_margin = px + 50 + 'px';
	}
	dataset = {
		sess_id: sess_id,
		language: language,
		mobile_phone: mobile_phone,
		top_margin: top_margin
	};
	URL = '/includes/inc/email_to_friend.php';
	AjaxGeneral(URL, dataset);
}

function getScrollTop() {
	if (typeof pageYOffset != 'undefined') {
		//most browsers except IE before #9
		return pageYOffset;
	} else {
		var B = document.body; //IE 'quirks'
		var D = document.documentElement; //IE with doctype
		D = (D.clientHeight) ? D : B;
		return D.scrollTop;
	}
}

function emailFriendSend() {
	sess_id = document.getElementById('stick').value;
	recip_email = document.getElementById('recip_email').value;
	if (recip_email == '') {
		JSmessage('Please enter an Email');
		document.getElementById('recip_email').style.backgroundColor = "#FFE8E8";
		document.getElementById('recip_email').focus();
		return;
	}
	test = valEmail(recip_email);
	if (test == false) {
		JSmessage('invalid email format (' + recip_email + ')');
		//document.getElementById('recip_email').value = '';
		document.getElementById('recip_email').style.backgroundColor = "#FFE8E8";
		document.getElementById('recip_email').focus();
		return;
	} else {
		// valid email returned, we can now move on
		//JSmessage(recip_email);
	}

	recip_name = document.getElementById('recip_name').value;
	if (recip_name == '') {
		JSmessage('Please enter a Name');
		document.getElementById('recip_name').style.backgroundColor = "#FFE8E8";
		document.getElementById('recip_name').focus();
		return;
	}
	send_name = document.getElementById('send_name').value;
	if (send_name == '') {
		JSmessage('Please enter a Name');
		document.getElementById('send_name').style.backgroundColor = "#FFE8E8";
		document.getElementById('send_name').focus();
		return;
	}
	message = document.getElementById('message').value;
	if (message == '') {
		JSmessage('Please enter a Message');
		document.getElementById('message').style.backgroundColor = "#FFE8E8";
		document.getElementById('message').focus();
		return;
	}
	validate = document.getElementById('validate').value;
	if (validate == '') {
		JSmessage('Please enter Validation Code above');
		document.getElementById('validate').style.backgroundColor = "#FFE8E8";
		document.getElementById('validate').focus();
		return;
	}
	img_v = document.getElementById('img_v').value;

	page_title = document.title;

	sess_id = document.getElementById('stick').value;
	uri_path = document.getElementById('uri_path').value;
	dataset = {
		sess_id: sess_id,
		img_v: img_v,
		recip_email: recip_email,
		recip_name: recip_name,
		send_name: send_name,
		message: message,
		validate: validate,
		uri_path: uri_path,
		page_title: page_title
	};
	URL = '/includes/inc/ajax_receiver.php?job=emailFriendVal';
	AjaxGeneral(URL, dataset);
}

function valEmail(email) {
	var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(email);
}

function NLSignUp() {
	sess_id = document.getElementById('stick').value;
	language = document.getElementById('lang_selected').value;
	dataset = {
		sess_id: sess_id,
		language: language
	};
	URL = '/includes/inc/subscribe_newsletter.php';
	AjaxGeneral(URL, dataset);
}

function NLsubscribe() {
	sess_id = document.getElementById('stick').value;
	nl_email = document.getElementById('nl_email').value;
	if (nl_email == '') {
		JSmessage('Please enter an Email');
		document.getElementById('nl_email').style.backgroundColor = "#FFE8E8";
		document.getElementById('nl_email').focus();
		return;
	}
	test = valEmail(nl_email);
	if (test == false) {
		JSmessage('invalid email format (' + nl_email + ')');
		document.getElementById('nl_email').style.backgroundColor = "#FFE8E8";
		document.getElementById('nl_email').focus();
		return;
	} else {
		// valid email returned, we can now move on
		//JSmessage(recip_email);
	}
	nl_conf_email = document.getElementById('nl_email').value;
	if (nl_conf_email !== nl_email) {
		JSmessage('The Emails emtered do not match!');
		document.getElementById('nl_conf_email').style.backgroundColor = "#FFE8E8";
		document.getElementById('nl_conf_email').focus();
		return;
	}

	nl_firstname = document.getElementById('nl_firstname').value;
	if (nl_firstname == '') {
		JSmessage('Please enter a First-Name');
		document.getElementById('nl_firstname').style.backgroundColor = "#FFE8E8";
		document.getElementById('nl_firstname').focus();
		return;
	}
	nl_lastname = document.getElementById('nl_lastname').value;
	if (nl_lastname == '') {
		JSmessage('Please enter a Last-Name');
		document.getElementById('nl_lastname').style.backgroundColor = "#FFE8E8";
		document.getElementById('nl_lastname').focus();
		return;
	}

	uri_path = document.getElementById('uri_path').value;
	dataset = {
		sess_id: sess_id,
		nl_email: nl_email,
		nl_firstname: nl_firstname,
		nl_lastname: nl_lastname
	};
	URL = '/includes/inc/ajax_receiver.php?job=NLsubscribe';
	AjaxGeneral(URL, dataset);
}

function sendContactEmail() {
	language = ' English';
	if (document.getElementById('lang_selected')) {
		language = document.getElementById('lang_selected').value;
	}
	sess_id = document.getElementById('stick').value;
	if (sess_id == 'undefined') {
		JSmessage('no session');
		return;
	}
	// get radio button status of id="news_l" / Newsletter option
	nl = document.getElementsByName('news_l');
	for (var i = 0; i < nl.length; i++) {
		if (nl[i].checked) {
			// newsletter = 1 or 0
			newsletter = nl[i].value;
		}
	}
	// subject
	sub_val = document.getElementById('subject').value;
	if (sub_val == 0) {
		JSmessage('Please select a Subject');
		document.getElementById('subject').style.backgroundColor = "#FFE8E8";
		return;
	} else {
		document.getElementById('subject').style.backgroundColor = "";
	}
	subject = document.getElementById('subject').value;
	email = document.getElementById('email').value;
	if (email == '') {
		JSmessage('Please Enter an Email');
		document.getElementById('email').style.backgroundColor = "#FFE8E8";
		document.getElementById('email').focus();
		return;
	} else {
		test = valEmail(email);
		if (test == false) {
			JSmessage('invalid email format (' + email + ')');
			document.getElementById('email').style.backgroundColor = "#FFE8E8";
			document.getElementById('email').focus();
			return;
		} else {
			// valid email returned, we can now move on
			document.getElementById('email').style.backgroundColor = "";
		}
	}
	confirm_email = document.getElementById('confirm_email').value;
	if (confirm_email !== email) {
		JSmessage('Emails do not Match!');
		document.getElementById('confirm_email').style.backgroundColor = "#FFE8E8";
		document.getElementById('confirm_email').focus();
		return;
	} else {
		document.getElementById('confirm_email').style.backgroundColor = "";
	}
	if (document.getElementById('msg'))	{
		msg = document.getElementById('msg').value;
		if (msg == '') {
			JSmessage('Please Enter a Message');
			document.getElementById('msg').style.backgroundColor = "#FFE8E8";
			document.getElementById('msg').focus();
			return;
		} else {
			document.getElementById('msg').style.backgroundColor = "";
		}
	}
	if (document.getElementById('msg_2'))	{
		msg = document.getElementById('msg_2').value;
		if (msg == '') {
			JSmessage('Please Enter a Message');
			document.getElementById('msg_2').style.backgroundColor = "#FFE8E8";
			document.getElementById('msg_2').focus();
			return;
		} else {
			document.getElementById('msg_2').style.backgroundColor = "";
		}
	}
	validate = document.getElementById('validate_cont_img').value;
	if (validate == '') {
		JSmessage('Please Enter the Validation Code shown on the Image');
		document.getElementById('validate_cont_img').style.backgroundColor = "#FFE8E8";
		document.getElementById('validate_cont_img').focus();
		return;
	} else {
		document.getElementById('validate_cont_img').style.backgroundColor = "";
	}

	val_img_name = document.getElementById('img_v_contact').value;

	dataset = {
		sess_id: sess_id,
		nl: newsletter,
		subject: subject,
		email: email,
		msg: msg,
		validate: validate,
		val_img_name: val_img_name,
		language: language
	};
	URL = '/includes/inc/ajax_receiver.php?job=sendContactEmail';
	AjaxGeneral(URL, dataset);
}

// Facebook login popup
function fbs_click() {
	u = location.href;
	t = document.title;
	window.open("http://www.facebook.com/sharer.php?u=" + encodeURIComponent(u) + "&t=" + encodeURIComponent(t), "sharer", "toolbar=0,status=0,width=626,height=436");
	return false;
}

//##########################################################################################
// create customer account on SSL page

function AccountSignUp() {
	mob_page = 0;
	if (document.getElementById('mob_page')) {
		mob_page = document.getElementById('mob_page').value;
	}

	// one email is required
	acc_email_1 = document.getElementById('acc_email_1').value;
	test = valEmail(acc_email_1);
	if (test == false) {
		if (document.getElementById('set_focus_to')) {
			document.getElementById('set_focus_to').value = 'acc_email_1';
		}
		JSmessage('Please enter a valid email');
		document.getElementById('acc_email_1').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_email_1').focus();
		return;
	} else {
		document.getElementById('acc_email_1').style.backgroundColor = "";
	}
	acc_email_2 = '';
	if (document.getElementById('acc_email_2')) {
		acc_email_2 = document.getElementById('acc_email_2').value;
	}
	acc_email_3 = '';
	if (document.getElementById('acc_email_3')) {
		acc_email_3 = document.getElementById('acc_email_3').value;
	}

	// get password of at least 6 characters
	acc_password = document.getElementById('acc_password').value;
	if (acc_password == '' || acc_password.length < 6) {
		if (document.getElementById('set_focus_to')) {
			document.getElementById('set_focus_to').value = 'acc_password';
		}
		JSmessage('Please enter a Password with at least 6 characters!');
		document.getElementById('acc_password').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_password').focus();
		return;
	} else {
		document.getElementById('acc_password').style.backgroundColor = "";
	}
	// compare confirmation password with passowrd above
	acc_confirm_password = document.getElementById('acc_confirm_password').value;
	if (acc_confirm_password !== acc_password) {
		if (document.getElementById('set_focus_to')) {
			document.getElementById('set_focus_to').value = 'acc_confirm_password';
		}
		JSmessage('Passwords do not match! Please enter again');
		document.getElementById('acc_confirm_password').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_confirm_password').focus();
		return;
	} else {
		document.getElementById('acc_confirm_password').style.backgroundColor = "";
	}
	// any password hint is allowed since it only reminds the customer
	acc_passhint = document.getElementById('acc_passhint').value;
	if (acc_passhint == '') {
		if (document.getElementById('set_focus_to')) {
			document.getElementById('set_focus_to').value = 'acc_passhint';
		}
		JSmessage('Please enter an account hint, it will help you to recall your Password');
		document.getElementById('acc_passhint').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_passhint').focus();
		return;
	} else {
		document.getElementById('acc_passhint').style.backgroundColor = "";
	}
	acc_firstname = document.getElementById('acc_firstname').value;
	if (acc_firstname == '') {
		if (document.getElementById('set_focus_to')) {
			document.getElementById('set_focus_to').value = 'acc_firstname';
		}
		JSmessage('Please enter your first name');
		document.getElementById('acc_firstname').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_firstname').focus();
		return;
	} else {
		document.getElementById('acc_firstname').style.backgroundColor = "";
	}
	acc_lastname = document.getElementById('acc_lastname').value;
	if (acc_lastname == '') {
		if (document.getElementById('set_focus_to')) {
			document.getElementById('set_focus_to').value = 'acc_lastname';
		}
		JSmessage('Please enter your last name');
		document.getElementById('acc_lastname').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_lastname').focus();
		return;
	} else {
		document.getElementById('acc_lastname').style.backgroundColor = "";
	}
	acc_companyname = document.getElementById('acc_companyname').value;

	acc_phone_1 = document.getElementById('acc_phone_1').value;
	if (acc_phone_1 == '') {
		if (document.getElementById('set_focus_to')) {
			document.getElementById('set_focus_to').value = 'acc_phone_1';
		}
		JSmessage('Please enter a telephone number');
		document.getElementById('acc_phone_1').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_phone_1').focus();
		return;
	} else {
		document.getElementById('acc_phone_1').style.backgroundColor = "";
	}
	acc_phone_2 = '';
	if (document.getElementById('acc_phone_2')) {
		acc_phone_2 = document.getElementById('acc_phone_2').value;
	}

	// get textarea values
	acc_othercontact = '';
	if (document.getElementById('acc_othercontact')) {
		acc_othercontact = document.getElementById('acc_othercontact').value;
	}

	acc_address_1 = document.getElementById('acc_address_1').value;
	if (acc_address_1 == '') {
		if (document.getElementById('set_focus_to')) {
			document.getElementById('set_focus_to').value = 'acc_address_1';
		}
		JSmessage('Please enter a valid street address');
		document.getElementById('acc_address_1').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_address_1').focus();
		return;
	} else {
		document.getElementById('acc_address_1').style.backgroundColor = "";
	}
	acc_address_2 = document.getElementById('acc_address_2').value;

	acc_city = document.getElementById('acc_city').value;
	if (acc_city == '') {
		if (document.getElementById('set_focus_to')) {
			document.getElementById('set_focus_to').value = 'acc_city';
		}
		JSmessage('Please enter City / Town name');
		document.getElementById('acc_city').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_city').focus();
		return;
	} else {
		document.getElementById('acc_city').style.backgroundColor = "";
	}

	acc_state = document.getElementById('acc_state').value;
	if (acc_state == '') {
		if (document.getElementById('set_focus_to')) {
			document.getElementById('set_focus_to').value = 'acc_state';
		}
		JSmessage('Please enter State / Province name');
		document.getElementById('acc_state').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_state').focus();
		return;
	} else {
		document.getElementById('acc_state').style.backgroundColor = "";
	}

	acc_zip = document.getElementById('acc_zip').value;
	if (acc_zip == '') {
		if (document.getElementById('set_focus_to')) {
			document.getElementById('set_focus_to').value = 'acc_zip';
		}
		JSmessage('Please enter a valid Zip-Code / Postal-Code');
		document.getElementById('acc_zip').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_zip').focus();
		return;
	} else {
		document.getElementById('acc_zip').style.backgroundColor = "";
	}

	// get selected country from dorp-down menu
	co = document.getElementById('acc_country');
	acc_country_code = co.options[co.selectedIndex].value;
	if (acc_country_code == "0") {
		if (document.getElementById('set_focus_to')) {
			document.getElementById('set_focus_to').value = 'acc_country';
		}
		JSmessage('Please select your country!');
		document.getElementById('acc_country').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_country').focus();
		return;
	} else {
		document.getElementById('acc_country').style.backgroundColor = "";
		acc_country = co.options[co.selectedIndex].innerHTML;
	}

	// get selected customer type
	acc_cust_type = '';
	if (document.getElementById('acc_cust_type')) {
		ct = document.getElementById('acc_cust_type');
		acc_cust_type = ct.options[ct.selectedIndex].value;
		if (acc_cust_type == "0") {
			//if (document.getElementById('set_focus_to')) {
				//document.getElementById('set_focus_to').value = 'acc_cust_type';
			//}
			JSmessage('Please select a customer type!');
			document.getElementById('acc_cust_type').style.backgroundColor = "#FFE8E8";
			document.getElementById('acc_cust_type').focus();
			return;
		} else {
			document.getElementById('acc_cust_type').style.backgroundColor = "";
			acc_cust_type = ct.options[ct.selectedIndex].innerHTML;
		}
	}

	sess_id = document.getElementById('stick').value;

	// Validation complete, need to update the DB with if values don't exist already
	showForm('timer', 'timer-inner');
	dataset = {
		sess_id: sess_id,
		acc_password: acc_password,
		acc_passhint: acc_passhint,
		acc_firstname: acc_firstname,
		acc_lastname: acc_lastname,
		acc_companyname: acc_companyname,
		acc_email_1: acc_email_1,
		acc_email_2: acc_email_2,
		acc_email_3: acc_email_3,
		acc_phone_1: acc_phone_1,
		acc_phone_2: acc_phone_2,
		acc_othercontact: acc_othercontact,
		acc_address_1: acc_address_1,
		acc_address_2: acc_address_2,
		acc_city: acc_city,
		acc_state: acc_state,
		acc_zip: acc_zip,
		acc_country_code: acc_country_code,
		acc_country: acc_country,
		acc_cust_type: acc_cust_type
	};
	URL = '/includes/inc/ajax_receiver.php?job=AccountSignUp';
	AjaxGeneral(URL, dataset);
}
// end "create customer account"
//#########################################################################################



//##########################################################################################
// create customer account on SSL page
function accSignUp() {
	// get password of at least 6 characters
	acc_password = document.getElementById('acc_password').value;
	if (acc_password == '' || acc_password.length < 6) {
		JSmessage('Please enter a Password with at least 6 characters!');
		document.getElementById('acc_password').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_password').focus();
		return;
	} else {
		document.getElementById('acc_password').style.backgroundColor = "";
	}
	// compare confirmation password with passowrd above
	acc_confirm_password = document.getElementById('acc_confirm_password').value;
	if (acc_confirm_password !== acc_password) {
		JSmessage('Passwords do not match! Please enter again');
		document.getElementById('acc_confirm_password').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_confirm_password').focus();
		return;
	} else {
		document.getElementById('acc_confirm_password').style.backgroundColor = "";
	}
	// any password hint is allowed since it only reminds the customer
	acc_passhint = document.getElementById('acc_passhint').value;
	if (acc_passhint == '') {
		JSmessage('Please enter an account hint, it will help you to recall your Password');
		document.getElementById('acc_passhint').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_passhint').focus();
		return;
	} else {
		document.getElementById('acc_passhint').style.backgroundColor = "";
	}
	acc_firstname = document.getElementById('acc_firstname').value;
	if (acc_firstname == '') {
		JSmessage('Please enter your first name');
		document.getElementById('acc_firstname').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_firstname').focus();
		return;
	} else {
		document.getElementById('acc_firstname').style.backgroundColor = "";
	}
	acc_lastname = document.getElementById('acc_lastname').value;
	if (acc_lastname == '') {
		JSmessage('Please enter your last name');
		document.getElementById('acc_lastname').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_lastname').focus();
		return;
	} else {
		document.getElementById('acc_lastname').style.backgroundColor = "";
	}
	acc_companyname = document.getElementById('acc_companyname').value;
	// one email is required
	acc_email_1 = document.getElementById('acc_email_1').value;
	test = valEmail(acc_email_1);
	if (test == false) {
		JSmessage('Please enter a valid email');
		document.getElementById('acc_email_1').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_email_1').focus();
		return;
	} else {
		document.getElementById('acc_email_1').style.backgroundColor = "";
	}
	acc_email_2 = document.getElementById('acc_email_2').value;
	acc_email_3 = document.getElementById('acc_email_3').value;

	acc_phone_1 = document.getElementById('acc_phone_1').value;
	if (acc_phone_1 == '') {
		JSmessage('Please enter a telephone number');
		document.getElementById('acc_phone_1').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_phone_1').focus();
		return;
	} else {
		document.getElementById('acc_phone_1').style.backgroundColor = "";
	}
	acc_phone_2 = document.getElementById('acc_phone_2').value;
	// get textarea values	
	acc_othercontact = document.getElementById('acc_othercontact').value;

	acc_address_1 = document.getElementById('acc_address_1').value;
	if (acc_address_1 == '') {
		JSmessage('Please enter a valid street address');
		document.getElementById('acc_address_1').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_address_1').focus();
		return;
	} else {
		document.getElementById('acc_address_1').style.backgroundColor = "";
	}
	acc_address_2 = document.getElementById('acc_address_2').value;

	acc_city = document.getElementById('acc_city').value;
	if (acc_city == '') {
		JSmessage('Please enter City / Town name');
		document.getElementById('acc_city').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_city').focus();
		return;
	} else {
		document.getElementById('acc_city').style.backgroundColor = "";
	}

	acc_state = document.getElementById('acc_state').value;
	if (acc_state == '') {
		JSmessage('Please enter State / Province name');
		document.getElementById('acc_state').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_state').focus();
		return;
	} else {
		document.getElementById('acc_state').style.backgroundColor = "";
	}

	acc_zip = document.getElementById('acc_zip').value;
	if (acc_zip == '') {
		JSmessage('Please enter a valid Zip-Code / Postal-Code');
		document.getElementById('acc_zip').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_zip').focus();
		return;
	} else {
		document.getElementById('acc_zip').style.backgroundColor = "";
	}
	// get selected country from dorp-down menu
	co = document.getElementById('acc_country');
	acc_country_code = co.options[co.selectedIndex].value;
	if (acc_country_code == "0") {
		JSmessage('Please select your country!');
		document.getElementById('acc_country').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_country').focus();
		return;
	} else {
		document.getElementById('acc_country').style.backgroundColor = "";
		acc_country = co.options[co.selectedIndex].innerHTML;
	}

	sess_id = document.getElementById('stick').value;

	// Validation complete, need to update the DB with if values don't exist already
	showForm('timer', 'timer-inner');
	dataset = {
		sess_id: sess_id,
		acc_password: acc_password,
		acc_passhint: acc_passhint,
		acc_firstname: acc_firstname,
		acc_lastname: acc_lastname,
		acc_companyname: acc_companyname,
		acc_email_1: acc_email_1,
		acc_email_2: acc_email_2,
		acc_email_3: acc_email_3,
		acc_phone_1: acc_phone_1,
		acc_phone_2: acc_phone_2,
		acc_othercontact: acc_othercontact,
		acc_address_1: acc_address_1,
		acc_address_2: acc_address_2,
		acc_city: acc_city,
		acc_state: acc_state,
		acc_zip: acc_zip,
		acc_country_code: acc_country_code,
		acc_country: acc_country
	};
	URL = '/includes/inc/ajax_receiver.php?job=accSignUp';
	AjaxGeneral(URL, dataset);
}
// end "create customer account"
//#########################################################################################

// call currency popup
function AjaxLastActivity(URL, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL,
		data: dataset,
		dataType: "json",
		success: function(data) {
			if (data.last_activity == 1) {
				// ok
			}
		},
		error: function() {}
	});
}

function userLogin() {
	login_type = 'GS';
	if (document.getElementById('login_type')) {
		login_type = document.getElementById('login_type').value;
	}
	f_email = '';
	if (document.getElementById('f_email')) {
		f_email = document.getElementById('f_email').value;
	}
	sess_id = document.getElementById('stick').value;

	if (login_type == 'facebook') {
		user_name = f_email;
		pass_word = '';
		dataset = {
			sess_id: sess_id,
			pass_word: pass_word,
			login_type: login_type,
			f_email: f_email
		};
		URL = '/includes/inc/ajax_receiver.php?job=userLogin';
		AjaxGeneral(URL, dataset);
		return;
	}

	user_name = document.getElementById('user_name').value;

	if (user_name == '') {
		JSmessage('Please enter your email / user-name');
		document.getElementById('user_name').style.backgroundColor = "#FFE8E8";
		document.getElementById('user_name').focus();
		return;
	} else {
		document.getElementById('user_name').style.backgroundColor = "";
	}
	pass_word = document.getElementById('pass_word').value;
	if (pass_word == '') {
		JSmessage('Please enter your account password');
		document.getElementById('pass_word').style.backgroundColor = "#FFE8E8";
		document.getElementById('pass_word').focus();
		return;
	} else {
		document.getElementById('pass_word').style.backgroundColor = "";
	}
	dataset = {
		sess_id: sess_id,
		user_name: user_name,
		pass_word: pass_word,
		login_type: login_type,
		f_email: f_email
	};
	URL = '/includes/inc/ajax_receiver.php?job=userLogin';
	AjaxGeneral(URL, dataset);
}

function logOut() {
	showForm('timer', 'timer-inner');
	sess_id = document.getElementById('stick').value;
	dataset = {
		sess_id: sess_id
	};
	URL = '/includes/inc/ajax_receiver.php?job=logOut';
	AjaxGeneral(URL, dataset);
}

function openMessage(row_id) {
	button = 'mess_but_' + row_id;
	el_id = 'message_' + row_id;
	close_button = 'mess_close_but_' + row_id;
	style = document.getElementById(el_id).style.display;
	if (style == 'none') {
		document.getElementById(el_id).style.display = '';
		document.getElementById(button).style.display = 'none';
		document.getElementById(close_button).style.display = '';
	} else {
		document.getElementById(el_id).style.display = 'none';
		document.getElementById(button).style.display = '';
		document.getElementById(close_button).style.display = 'none';
	}
}

function openDetails(row_id) {
	button = 'mess_but_' + row_id;
	el_id = 'message_' + row_id;
	button_status = document.getElementById(button).value;
	if (button_status == 'Show Details') {
		document.getElementById(el_id).style.display = '';
		document.getElementById(button).value = 'Close Details';
		document.getElementById(button).style.fontWeight = 'bold';
	} else {
		document.getElementById(el_id).style.display = 'none';
		document.getElementById(button).style.fontWeight = 'normal';
		document.getElementById(button).value = 'Show Details';
	}
}

function openDetailsMobile(row_id) {
	el_id = 'message_' + row_id;
	stat = document.getElementById(el_id).style.display;
	if (stat == 'none') {
		document.getElementById(el_id).style.display = '';
	} else {
		document.getElementById(el_id).style.display = 'none';
		id = 'acc_orders_row_' + row_id;
		document.getElementById(id).style.backgroundColor = "";
	}
}

function openSendMess() {
	style = document.getElementById('send_mail_ssl').style.display;
	if (style == 'none') {
		document.getElementById('send_mail_ssl').style.display = '';
		document.getElementById('send_mess_but').style.display = 'none';
		document.getElementById('close_mess_but').style.display = '';
	} else {
		document.getElementById('send_mail_ssl').style.display = 'none';
		document.getElementById('send_mess_but').style.display = '';
		document.getElementById('close_mess_but').style.display = 'none';
	}
}

function sendContactEmailssl() {
	sess_id = document.getElementById('stick').value;
	custid = document.getElementById('custid').value;
	// get subject from drop-down
	sub_val = document.getElementById('subject_ssl').value;
	if (sub_val == 0) {
		JSmessage('Please select a Subject');
		document.getElementById('subject_ssl').style.backgroundColor = "#FFE8E8";
		return;
	} else {
		document.getElementById('subject_ssl').style.backgroundColor = "";
	}
	subject = document.getElementById('subject_ssl').value;
	msg_ssl = document.getElementById('msg_ssl').value;
	if (msg_ssl == '') {
		JSmessage('Please Enter a Message');
		document.getElementById('msg_ssl').style.backgroundColor = "#FFE8E8";
		document.getElementById('msg_ssl').focus();
		return;
	} else {
		document.getElementById('msg_ssl').style.backgroundColor = "";
	}

	dataset = {
		sess_id: sess_id,
		subject: subject,
		msg_ssl: msg_ssl,
		custid: custid
	};
	URL = '/includes/inc/ajax_receiver.php?job=sendContactEmailssl';
	AjaxGeneral(URL, dataset);
}

function changePass() {
	but_text = document.getElementById('change_pass').value;
	if (but_text == 'Change Password') {
		n = document.getElementsByClassName("pass");
		for (i = 0; i < n.length; i++) {
			n[i].style.display = '';
		}
		document.getElementById('change_pass').style.fontWeight = 'bold';
		document.getElementById('change_pass').value = "Close";
		return;
	} else {
		n = document.getElementsByClassName("pass");
		for (i = 0; i < n.length; i++) {
			n[i].style.display = 'none';
		}
		document.getElementById('change_pass').style.fontWeight = 'normal';
		document.getElementById('change_pass').value = "Change Password";
	}
}

function saveNewPass() {
	old_pass = document.getElementById('old_pass').value;
	if (old_pass == '') {
		JSmessage('Please enter your old password');
		document.getElementById('old_pass').style.backgroundColor = "#FFE8E8";
		document.getElementById('old_pass').focus();
		return;
	} else {
		document.getElementById('old_pass').style.backgroundColor = "";
	}
	new_pass = document.getElementById('new_pass').value;
	if (new_pass == '' || new_pass.length < 6) {
		JSmessage('Please enter a new password with minimum 6 characters');
		document.getElementById('new_pass').style.backgroundColor = "#FFE8E8";
		document.getElementById('new_pass').focus();
		return;
	} else {
		document.getElementById('new_pass').style.backgroundColor = "";
	}
	new_pass_conf = document.getElementById('new_pass_conf').value;
	if (new_pass_conf == '') {
		JSmessage('Please confirm your password');
		document.getElementById('new_pass_conf').style.backgroundColor = "#FFE8E8";
		document.getElementById('new_pass_conf').focus();
		return;
	} else {
		document.getElementById('new_pass_conf').style.backgroundColor = "";
	}
	if (new_pass_conf !== new_pass) {
		JSmessage('Passwords do not match!');
		document.getElementById('new_pass_conf').style.backgroundColor = "#FFE8E8";
		document.getElementById('new_pass_conf').focus();
		return;
	}
	sess_id = document.getElementById('stick').value;
	custid = document.getElementById('custid').value;
	dataset = {
		sess_id: sess_id,
		custid: custid,
		old_pass: old_pass,
		new_pass: new_pass
	};
	URL = '/includes/inc/ajax_receiver.php?job=setNewPassword';
	AjaxGeneral(URL, dataset);
}

function updateAccount() {
	acc_passhint = document.getElementById('acc_passhint').value;
	if (acc_passhint == '') {
		JSmessage('Please enter a password hint');
		document.getElementById('acc_passhint').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_passhint').focus();
		return;
	} else {
		document.getElementById('acc_passhint').style.backgroundColor = "";
	}
	acc_firstname = document.getElementById('acc_firstname').value;
	if (acc_firstname == '') {
		JSmessage('Please enter your First Name');
		document.getElementById('acc_firstname').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_firstname').focus();
		return;
	} else {
		document.getElementById('acc_firstname').style.backgroundColor = "";
	}
	acc_lastname = document.getElementById('acc_lastname').value;
	if (acc_lastname == '') {
		JSmessage('Please enter your Last Name');
		document.getElementById('acc_lastname').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_lastname').focus();
		return;
	} else {
		document.getElementById('acc_lastname').style.backgroundColor = "";
	}
	acc_companyname = document.getElementById('acc_companyname').value;
	acc_phone_1 = document.getElementById('acc_phone_1').value;
	if (acc_phone_1 == '') {
		JSmessage('Please enter a telephone number');
		document.getElementById('acc_phone_1').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_phone_1').focus();
		return;
	} else {
		document.getElementById('acc_phone_1').style.backgroundColor = "";
	}
	acc_phone_2 = document.getElementById('acc_phone_2').value;
	acc_othercontact = document.getElementById('acc_othercontact').value;
	acc_address_1 = document.getElementById('acc_address_1').value;
	if (acc_address_1 == '') {
		JSmessage('Please enter a street address');
		document.getElementById('acc_address_1').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_address_1').focus();
		return;
	} else {
		document.getElementById('acc_address_1').style.backgroundColor = "";
	}
	acc_address_2 = document.getElementById('acc_address_2').value;
	acc_city = document.getElementById('acc_city').value;
	if (acc_city == '') {
		JSmessage('Please enter a City');
		document.getElementById('acc_city').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_city').focus();
		return;
	} else {
		document.getElementById('acc_city').style.backgroundColor = "";
	}
	acc_state = document.getElementById('acc_state').value;
	if (acc_state == '') {
		JSmessage('Please enter a State/Province');
		document.getElementById('acc_state').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_state').focus();
		return;
	} else {
		document.getElementById('acc_state').style.backgroundColor = "";
	}
	acc_zip = document.getElementById('acc_zip').value;
	if (acc_zip == '') {
		JSmessage('Please enter a Zip-Code/Postal-Code');
		document.getElementById('acc_zip').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_zip').focus();
		return;
	} else {
		document.getElementById('acc_zip').style.backgroundColor = "";
	}
	acc_country = document.getElementById('acc_country').value;
	if (acc_country == '0') {
		JSmessage('Please select a country');
		document.getElementById('acc_country').style.backgroundColor = "#FFE8E8";
		document.getElementById('acc_country').focus();
		return;
	} else {
		document.getElementById('acc_country').style.backgroundColor = "";
	}
	// get Newsletter checkbox value and send email-selected
	acc_nl = '';
	acc_emails = '';
	acc_emails_checked = '';
	acc_nl = document.getElementsByName('acc_nl');
	for (var i = 0; i < acc_nl.length; i++) {
		if (!acc_nl[i].checked) {
			// acc_email below is the one which is not checked and has to be set to '0' in "DBoffline.users_online"
			acc_email = acc_nl[i].value;
			//nl_id = acc_nl[i].id;
			acc_emails += acc_email + ',';
		} else {
			acc_email = acc_nl[i].value;
			acc_emails_checked += acc_email + ',';
		}
	}
	acc_nl_emails = acc_emails.slice(0, -1);
	acc_emails_checked = acc_emails_checked.slice(0, -1);
	//JSmessage(acc_emails_checked);

	sess_id = document.getElementById('stick').value;
	custid = document.getElementById('custid').value;
	dataset = {
		sess_id: sess_id,
		custid: custid,
		acc_passhint: acc_passhint,
		acc_firstname: acc_firstname,
		acc_lastname: acc_lastname,
		acc_companyname: acc_companyname,
		acc_phone_1: acc_phone_1,
		acc_phone_2: acc_phone_2,
		acc_othercontact: acc_othercontact,
		acc_address_1: acc_address_1,
		acc_address_2: acc_address_2,
		acc_city: acc_city,
		acc_state: acc_state,
		acc_zip: acc_zip,
		acc_country: acc_country,
		acc_nl_emails: acc_nl_emails,
		acc_emails_checked: acc_emails_checked
	};
	URL = '/includes/inc/ajax_receiver.php?job=updateAccount';
	AjaxGeneral(URL, dataset);
}

function forgotPass() {
	document.getElementById('forgot').style.display = '';
}

function clearTXT(id) {
	check = document.getElementById(id).value;
	if (check == 'Search' || check == 'Password' || check == 'Email / Username' || check == 'Search GemSelect' || check == 'Enter Your Email here') {
		document.getElementById(id).value = '';
		document.getElementById(id).style.color = 'black';
	}
}

function clearTXT_search(id, term) {
	check = document.getElementById(id).value;
	if (check == term) {
		document.getElementById(id).value = '';
		document.getElementById(id).style.color = 'black';
	}
}

function clearTXT_search_new(id) {
	check = document.getElementById(id).value;
	id_hidden = id + '_hidden';
	hidden_val = document.getElementById(id_hidden).value;
	if (check == hidden_val) {
		document.getElementById(id).value = '';
		document.getElementById(id).style.color = 'black';
	}
}

function requestPass() {
	sess_id = document.getElementById('stick').value;
	requ_mail = document.getElementById('forgot_pass').value;
	if (requ_mail == 'Enter Your Email here') {
		JSmessage('Please enter an Email');
		document.getElementById('forgot_pass').style.backgroundColor = "#FFE8E8";
		document.getElementById('forgot_pass').focus();
		return;
	} else {
		document.getElementById('forgot_pass').style.backgroundColor = "";
	}
	// check email format
	if (requ_mail.indexOf("@") > 0) {
		dataset = {
			sess_id: sess_id,
			requ_mail: requ_mail
		};
		URL = '/includes/inc/ajax_receiver.php?job=requestPass';
		AjaxGeneral(URL, dataset);
	} else {
		JSmessage('Please enter a valid email format');
	}
}

function selPayOpt(id, e) {
	// set the checkbox
	pay_id = 'cc-checkout_' + id;
	//JSmessage(e.target);
	if (e.target == '[object HTMLInputElement]' || e.srcElement == '[object HTMLInputElement]') {
		// do nothing
	} else {
		document.getElementById(pay_id).checked = true;
		// check if mobile page
		if (document.getElementById('cust_add_tot_tb')) {
			// clear previously selected at first (pay_opt_cont_div)
			x = document.getElementsByClassName("pay_opt_cont_div");
			for (var i = 0; i < x.length; i++) {
				x[i].style.backgroundColor = '';
			}
			idd = 'cont_div_pay_opt_' + id;
			document.getElementById(idd).style.backgroundColor = '#FFE8E8';
		}
	}
}

function removeNLemail(email) {
	dataset = {
		email_remove: email
	};
	URL = '/includes/inc/ajax_receiver.php?job=removeNLemail';
	AjaxGeneral(URL, dataset);
}

function pageNumber(page_no) {
	form_id = 'page_form_' + page_no;
	uri_path = document.getElementById('uri_path_full').value;
	domain_name = document.getElementById('domain_name').value;
	if (uri_path.indexOf('?') > -1) {
		// found
		url = 'http://' + domain_name + uri_path + '&page=' + page_no;
	} else {
		// not found
		url = 'http://' + domain_name + uri_path + '?page=' + page_no;
	}
	document.forms[form_id].action = url;
	document.forms[form_id].target = '_self';
	document.forms[form_id].submit();
}

function showMI() {
	mob = document.getElementById('mobile_phone').value;
	height = document.getElementById('pager_container').style.height;
	close_txt = document.getElementById('close_txt').value;
	open_txt = document.getElementById('open_txt').value;
	pix = '29px';
	if (mob == 1) {
		pix = '35px';
	}
	if (height == pix) {
		document.getElementById('pager_container').style.height = '';
		document.getElementById('show_butt').value = close_txt;
	} else {
		document.getElementById('show_butt').value = open_txt;
		if (mob == 1) {
			document.getElementById('pager_container').style.height = pix;
		} else {
			document.getElementById('pager_container').style.height = pix;
		}
	}
}

function checkExist() {
	sess_id = document.getElementById('stick').value;
	dataset = {
		sess_id: sess_id
	};
	URL = '/includes/inc/last_activity.php?job=checkExist';
	AjaxLastActivity(URL, dataset);
}

function checksum() {
	val = document.getElementById('md5sum').value;
	if (val == 0) {
		document.getElementById('md5sum').value = 1;
	} else {
		document.getElementById('md5sum').value = 0;
	}
}

function mobile() {
	val = document.getElementById('mobile').value;
	if (val == 0) {
		document.getElementById('mobile').value = 1;
	} else {
		document.getElementById('mobile').value = 0;
	}
}

// swap image for jewelry
function changeImage(img_id, new_url) {
	image = document.getElementById(img_id);
	image.src = new_url;
}

// jewelry
function AjaxJewelry(URL_address, target, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL_address,
		data: dataset,
		dataType: "json",
		success: function(data) {
			hideForm('timer', 'timer-inner');
			msg = data.errmsg;

			if (data.resizeRing == 1) {
				//JSmessage(data.size_id);
				//CallFlyingCart();
			}
			if (data.resizeRing == 0) {}
		},
		error: function() {
			//JSmessage("Error");
		}
	});
}

function resizeRing(prodid) {
	size_id = document.getElementById('ring_size').value;
	sess_id = document.getElementById('stick').value;
	dataset = {
		sess_id: sess_id,
		prodid: prodid,
		size_id: size_id
	};
	URL = '/includes/inc/ajax_jewelry.php?job=resizeRing';
	AjaxJewelry(URL, '', dataset);
}

function test_href() {
	a = document.getElementsByTagName('a');
	for (i = 0; i < a.length; i++) {
		for (i = 0; i < a.length; i++) {
			l = a[i];
			if (l.href && l.href.indexOf('#')) {
				JSmessage(l.href);
			}
		}
	}
}

function QTYdetails(prodid) {
	sess_id = document.getElementById('stick').value;
	page_currency = document.getElementById('page_currency').value;
	id_qty = 'qty_' + prodid;
	if (document.getElementById(id_qty)) {
		qty_selected = document.getElementById(id_qty).value;
		if (document.getElementById('pcs')) {
			if (qty_selected > 1) {
				document.getElementById('pcs').innerHTML = 's';
				document.getElementById('show_weight_pcs').style.display = '';
			} else {
				document.getElementById('pcs').innerHTML = '';
				document.getElementById('show_weight_pcs').style.display = 'none';
			}
		}
		if (document.getElementById('single_pcs_weight')) {
			single_pcs_weight = document.getElementById('single_pcs_weight').value;
			new_weight = single_pcs_weight * qty_selected;
			new_weight = new_weight.toFixed(2);
			total_label = '';
			if (qty_selected > 1) {
				total_label = 'w (total)';
			}
			if (document.getElementById('split_weight')) {
				document.getElementById('split_weight').innerHTML = new_weight + 'ct' + total_label;
			}
		}

		id_price = 'prod_price_' + prodid;
		curr_price = document.getElementById(id_price).value;
		display_price_id = 'prod_' + prodid;
		//document.getElementById(display_price_id).innerHTML = new_price;
		dataset = {
			curr_price: curr_price,
			qty_selected: qty_selected,
			prodid: prodid,
			sess_id: sess_id,
			page_currency: page_currency
		};
		URL = '/includes/inc/ajax_receiver.php?job=QTYdetails';
		AjaxGeneral(URL, dataset);
	}
}

function hideInitTXT(id) {
	id2 = 'cl_' + id;
	if (id == 'country') {
		document.getElementById(id).style.color = '#000000';
	} else {
		document.getElementById(id).value = '';
		document.getElementById(id).style.color = '#000000';
		document.getElementById(id).style.fontWeight = 'bold';
		document.getElementById(id2).style.display = '';
	}
}

function clearTXTcustAd(id) {
	id_sel = 'ov_' + id;
	id2 = 'cl_' + id;
	id_txt = id + '_txt';
	document.getElementById(id_txt).style.display = 'none';
	document.getElementById(id_sel).style.display = '';
	document.getElementById(id2).style.display = 'none';
	document.getElementById(id).style.color = '#666666';
	document.getElementById(id).style.fontWeight = 'normal';
	document.getElementById(id).focus();
	if (id == 'first_name') {
		document.getElementById(id).value = '';
	}
	if (id == 'last_name') {
		document.getElementById(id).value = '';
	}
	if (id == 'address-1') {
		document.getElementById(id).value = '';
	}
	if (id == 'address-2') {
		document.getElementById(id).value = '';
	}

	if (id == 'city') {
		document.getElementById(id).value = '';
	}
	if (id == 'state') {
		document.getElementById(id).value = '';
	}
	if (id == 'customer_postal_code') {
		document.getElementById(id).value = '';
	}
	if (id == 'customer_phone') {
		document.getElementById(id).value = '';
	}
	if (id == 'customer_email') {
		document.getElementById(id).value = '';
	}
	if (id == 'email_conf') {
		document.getElementById(id).value = '';
	}
	if (id == 'special_notes') {
		document.getElementById(id).value = '';
	}
}

function ClearXStartUP() {
	// clear all "X" at first
	x = document.getElementsByClassName("close_div3");
	for (var i = 0; i < x.length; i++) {
		x[i].style.display = 'none';
	}
}

function fillField(id) {
	// clear all "X" at first
	x = document.getElementsByClassName("close_div3");
	for (var i = 0; i < x.length; i++) {
		x[i].style.display = 'none';
	}
	id2 = 'cl_' + id;
	id_sel = 'ov_' + id;
	document.getElementById(id2).style.display = '';
	document.getElementById(id).style.color = '#000000';
	document.getElementById(id).style.fontWeight = 'bold';
	document.getElementById(id).focus();
	status = document.getElementById(id_sel).style.display;
	if (status == 'none') {
		document.getElementById(id_sel).style.display = '';
	} else {
		document.getElementById(id_sel).style.display = 'none';
	}
}
/*
function hideOverLay(id) {
	close_tmp = id.substring(3);
	close_id = 'cl_' + close_tmp;
	txt_id = close_tmp + '_txt';
	document.getElementById(close_tmp).style.color = '#000000';
	document.getElementById(close_tmp).style.fontWeight = 'bold';
	document.getElementById(id).style.display = 'none';
	document.getElementById(close_id).style.display = '';
	if (document.getElementById(txt_id)) {
		document.getElementById(txt_id).style.display = '';
	}
}
*/
function hideOverLay(id) {
	// clear all "X" at first
	x = document.getElementsByClassName("close_div3");
	for (var i = 0; i < x.length; i++) {
		x[i].style.display = 'none';
	}
	id_el = 'ov_' + id;
	if (document.getElementById(id_el)) {
		document.getElementById(id_el).style.display = 'none';
	}
	if (document.getElementById(id)) {
		document.getElementById(id).style.display = 'none';
	}
	id_short = id.substring(3);
	id_el2 = 'cl_' + id_short;
	if (document.getElementById(id_el2)) {
		document.getElementById(id_el2).style.display = '';
	}
}

function showDesigns(prodid) {
	url = '/includes/inc/jewel_design_preview.php?prodid=' + prodid;
	RecURL(url,'showDesigns');
	window.open(url, "_blank");
}

function EnlargeIMG(design_id, prodid, coming_from) {
	if (coming_from == 'onclick') {
		document.getElementById('build_butt').style.color = '';
		document.getElementById('build_butt').innerHTML = "Build this Ring with this gem =&gt;";
	}
	document.getElementById('design_id_selected').innerHTML = design_id;
	document.getElementById('selected_design_id').value = design_id;
	// deselect all currently seleted ones
	n = document.getElementsByClassName("des_high");
	for (var i = 0; i < n.length; i++) {
		n[i].style.border = '';
	}
	document.getElementById('test_tb').style.display = '';
	des_high = 'des_high_' + design_id;
	document.getElementById(des_high).style.border = "2px solid #000099";
	clicked_design_id = document.getElementById('clicked_design_id').value;
	status = document.getElementById('large_img').style.display;
	if (clicked_design_id !== design_id) {
		status = 'none';
	}
	if (status == 'none') {
		document.getElementById('large_img').style.display = '';
		document.getElementById('large_img').style.height = '580px';
		document.getElementById('large_img').innerHTML = '<img src="/jewelry-designs/photos/' + design_id + '.jpg" width="580" height="580">';
		window.scrollTo(0, 550);
	} else {
		document.getElementById('large_img').style.display = 'none';
		document.getElementById('large_img').style.height = '';
		document.getElementById('large_img').innerHTML = '';
	}
	document.getElementById('clicked_design_id').value = design_id;
	// get ring sizes and inject into td
	dataset = {
		design_id: design_id,
		prodid: prodid
	};
	URL = '/includes/inc/ajax_responder.php?job=getRingSizes';
	AjaxGeneral(URL, dataset);
}

function ShowJewelTXT(cond) {
	cc = document.getElementsByClassName("show_designs");
	for (var i = 0; i < cc.length; i++) {
		stat = cc[i].style.display;
		if (cond == 'close') {
			stat = '';
		}
		if (stat == 'none') {
			cc[i].style.display = "";
			document.getElementById('choose_txt').innerHTML = 'Close Jewelry Designs';
			document.getElementById('choose_txt').style.backgroundColor = "#F96302";
			document.getElementById('choose_txt').style.color = "#FFFFFF";
			document.getElementById('choose_txt').style.height = "25px";
			// choose_jewelry
		} else {
			cc[i].style.display = "none";
			document.getElementById('choose_txt').innerHTML = 'Choose Jewelry for Gem';
			document.getElementById('choose_txt').style.backgroundColor = "";
			document.getElementById('choose_txt').style.color = "";
			document.getElementById('choose_txt').style.height = "55px";
		}
	}
}

function ChangeRingSize(size_mm, size_id) {
	// clear all selected bg-colors "size_box"
	cc = document.getElementsByClassName("size_box");
	for (var i = 0; i < cc.length; i++) {
		cc[i].style.backgroundColor = "";
		cc[i].style.color = "#666666";
	}
	id = 'sel_size_' + size_id;
	document.getElementById(id).style.backgroundColor = "#F96302";
	document.getElementById(id).style.color = "#FFFFFF";
	document.getElementById('selected_ring_size').value = size_mm;
}

function addJewelryDesign(prodid) {
	check_stat = 'add_to_cart_' + prodid;
	status = document.getElementById(check_stat).style.display;
	if (status !== 'none') {
		addProd(prodid);
	}
	ring_size_id = document.getElementById('selected_ring_size').value;
	sess_id = document.getElementById('stick').value;
	design_id = document.getElementById('selected_design_id').value;
	flyToCartJD();
	dataset = {
		design_id: design_id,
		prodid: prodid,
		sess_id: sess_id,
		ring_size_id: ring_size_id
	};
	URL = '/includes/inc/ajax_responder.php?job=addJewelryDesign';
	AjaxGeneral(URL, dataset);
}

function SizeDetails() {
	stat = document.getElementById('exact_size1').style.display;
	if (stat == 'none') {
		document.getElementById('exact_size1').style.display = '';
		document.getElementById('exact_size2').style.display = '';
	} else {
		document.getElementById('exact_size1').style.display = 'none';
		document.getElementById('exact_size2').style.display = 'none';
	}
}

function getPDF(prodid, status) {
	showForm('timer', 'timer-inner');
	url = '/includes/inc/make_pdf.php?prodid=' + prodid + '&status=' + status;
	if (status !== 'sold') {
		RecURL(url,'getPDF');
		window.open(url, "_self");
		setTimeout(function() {
			hideForm('timer', 'timer-inner');
		}, 1200);
	} else {
		hideForm('timer', 'timer-inner');
		url = 'http://www.gemselect.com/includes/inc/make_pdf.php?prodid=' + prodid + '&status=' + status;
		RecURL(url,'getPDF');
		window.open(url, "_blank");
	}
}

function getTime() {
	dataset = {
		sess_id: sess_id
	};
	URL = '/includes/inc/ajax_receiver.php?job=leave_page';
	AjaxGeneral(URL, dataset);
}

function leave_page() {
	sess_id = document.getElementById('stick').value;
	if (document.getElementById('time_spent')) {
		time_spent = document.getElementById('time_spent').value;
		if (time_spent == 0) {
			window.onbeforeunload = getTime;
		}
	}
}

function CloseAccount() {
	sess_id = document.getElementById('stick').value;
	custid = document.getElementById('custid').value;
	confirmtxt = 'Are you sure you wish to close your account now?';
	r = confirm(confirmtxt);
	if (r == true) {
		showForm('timer', 'timer-inner');
		dataset = {
			custid: custid,
			sess_id: sess_id
		};
		URL = '/includes/inc/ajax_receiver.php?job=CloseAccount';
		AjaxGeneral(URL, dataset);
	} else {
		return;
	}
}

function goToAccount() {
	domain_name = document.getElementById('domain_name').value;
	url = 'https://' + domain_name + '/account/acc_login.php';
	RecURL(url,'goToAccount');
	window.open(url, "_self");
}

function resizeIframe(obj) {
	obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}

function OpenMmenu(container) {
	var box = document.getElementById(container);

	if (!box) {
		console.error('OpenMmenu: container not found:', container);
		return false;
	}

	var stat = window.getComputedStyle(box).display;

	if (stat === 'none') {
		var currPop = document.getElementById('curr_pop');
		if (currPop) currPop.value = container;

		$("#" + container).slideDown(300);

		if (container != 'm_filters') {
			var menuDiv = document.getElementById('menu-div');
			if (menuDiv) menuDiv.style.display = 'block';
		}

		if (container === 'm_filters' || container === 'm_menu') {
			$(".mmclose").show();
		}

		var filters = [
			"odd_sizes","facet","cab","spl","base_shape",
			"weight_min","weight_max","size_set",
			"clarity","p_min","p_max"
		];

		for (var i = 0; i < filters.length; i++) {
			var el = document.getElementById(filters[i]);

			if (el && el.value !== '') {
				$(".res_all").show();
				break;
			}
		}

	} else {
		$("#" + container).slideUp(400);

		if (container === 'm_filters' || container === 'm_menu') {
			$(".mmclose").hide();
		}
	}
}

function OpenSub(id) {
	stat = document.getElementById(id).style.display;
	if (stat == 'none') {
		document.getElementById(id).style.display = '';
	} else {
		document.getElementById(id).style.display = 'none';
	}
}

function OpenSearch() {
	stat = document.getElementById('td_search').style.display;
	if (stat == 'none') {
		$("#td_search").fadeIn(400);
		$('#b_crumbs_mobile').hide();
	} else {
		$("#td_search").fadeOut(400);
		$('#b_crumbs_mobile').show();
	}
}

function OpenFilters() {
	stat = document.getElementById('m_filters').style.display;
	if (stat == 'none') {
		document.getElementById('m_filters').style.display = '';
		document.getElementById('menu-div').style.display = 'block';
	} else {
		document.getElementById('m_filters').style.display = 'none';
	}
}

function hideMForm() {
	$("#menu-div").slideUp(400);
	if (curr_pop = document.getElementById('curr_pop')) {
		curr_pop = document.getElementById('curr_pop').value;
	}
	$("#" + curr_pop).slideUp(150);
	if (document.getElementsByClassName("mmclose")) {
		$(".mmclose").hide();
	}
	if (document.getElementById('but_cont_bot')) {
		document.getElementById('but_cont_bot').style.display = 'none';
	}
}

function setFilterM(type, label, sel_value) {
	// if type = clarity then we need to delete the old container and replace
	if (type == 'clarity') {
		s = document.getElementsByClassName('clar');
		for (var i = 0; i < s.length; i++) {
			cont_id = s[i].id;
			$("#" + cont_id).remove();
			document.getElementById('clarity').value = '';
		}
	}
	document.getElementById('f_selection').style.display = '';
	rand_number = Math.floor(Math.random() * 90000) + 10000;
	unique_id = type + '_' + rand_number;
	input_id = type;
	node = '<div onClick="clearSelF(\'' + unique_id + '\')" class="sel_f" id="' + unique_id + '">' + label + '<input name="' + input_id + '" type="hidden" value="' + sel_value + '"></div>';
	$('#sel_item').append(node);
	window.location.href = "#top_1";
	tb_id = type + '_cont';
	document.getElementById(tb_id).style.display = 'none';
}

function clearSelF(div_id) {
	// extract color name, example: color_148514
	val = div_id.split("_");
	cs = val[0];
	//cs = div_id.slice(0, -7);
	if (cs == 'color') {
		if (document.getElementById('color')) {
			document.getElementById('color').value = '';
		}
	}

	// remove the numeric values of the string (last six characters)
	clean = div_id.substring(0, div_id.length - 6);
	if (clean == 'base_color_') {
		if (document.getElementById('base_color')) {
			document.getElementById('base_color').value = '';
		}
	}
	if (cs == 'clarity') {
		if (document.getElementById('clarity')) {
			document.getElementById('clarity').value = '';
		}
	}
	if (div_id == 'weight_range') {
		// clear values in hidden fields
		s = document.getElementsByClassName('clear_val');
		for (i = 0; i < s.length; i++) {
			s[i].value = '';
		}
	}

	// remove div and hidden input with selected property
	$("#" + div_id).remove();

	if (document.getElementById(div_id)) {
		//
	}

	if (div_id == 'size_range') {
		// clear values in hidden fields
		s = document.getElementsByClassName('clear_val_s');
		for (i = 0; i < s.length; i++) {
			s[i].value = '';
		}
	}
	if (div_id == 'price_range') {
		// clear values in hidden fields
		s = document.getElementsByClassName('clear_val_p');
		for (i = 0; i < s.length; i++) {
			s[i].value = '';
		}
	}
	// check if any of the elements with class=sel_f are open
	// if none is open close upper tr (f_selection)
	z = document.getElementsByClassName('sel_f');
	check2 = 0;
	for (i = 0; i < z.length; i++) {
		check = z[i].style.display;
		if (check != 'none') {
			// leave open
			check2 = 1;
		}
	}
	if (check2 == 0) {
		document.getElementById('f_selection').style.display = 'none';
		showForm('timer', 'timer-inner');
		gemMenuMobile();
	}
}

function OpenSubF(type) {
	mobile = document.getElementById('mobile_phone').value;
	if (mobile == 1) {
		stat = document.getElementById(type).style.display;
		if (stat == 'none') {
			document.getElementById(type).style.display = '';
		} else {
			document.getElementById(type).style.display = 'none';
		}
	}
	if (mobile == 0) {
		OpenSubF_desk(type);
	}
}

function OpenSubF_desk(type) {
	if (type == 'weight_cont') {
		document.getElementById('td-weight').style.backgroundColor = "#E6FFE6";
		document.getElementById('td-weight').style.fontWeight = "bold";
	}
	if (type == 'clarity_cont') {
		document.getElementById('td-clarity').style.backgroundColor = "#E6FFE6";
		document.getElementById('td-clarity').style.fontWeight = "bold";
	}
	if (type == 'price_cont') {
		document.getElementById('td-price').style.backgroundColor = "#E6FFE6";
		document.getElementById('td-price').style.fontWeight = "bold";
	}
}

// gem-menu mobile
function gemMenuMobile(cond) {
	l_from = document.getElementById('length_from').value;
	if (l_from > 0) {
		setSize();
	}
	w_from = document.getElementById('weight_from').value;
	if (w_from > 0) {
		setWeight();
	}
	gem_types = '';
	gem_colors = '';
	gem_base_colors = '';
	color_details = '';
	gem_shapes = '';
	shapes_det = '';
	gem_weight = '';
	gem_size = '';
	date_sort = '';
	clarity_sel = '';
	price_range = '';
	gem_countries = '';
	gem_style = '';
	gem_drilled = '';
	spls = '';
	faceted = '';
	cab = '';
	items = '';
	treatment = '';
	new_arrivals = '';
	sort = '';
	top_grade = '';
	huge_gem = '';
	items = '';

	gem_types = '';
	if (cond === undefined) {
		gem_types = gemTypes_mobile();
	} else {
		val = cond.split("=");
		var_name = val[0];
		var_value = val[1];
		if (var_name == 'g_type') {
			gem_types = '&g_type=' + var_value;
		}
	}

	gem_colors = gemColors_mobile();
	gem_base_colors = gemBaseColors_mobile();
	gem_shapes = gemShapes_mobile();

	//clarity options
	clarity_sel = '';
	hh = document.getElementsByName('clarity');
	var i;
	for (i = 0; i < hh.length; i++) {
		cl_sel = hh[i].value;
		if (cl_sel !== '') {
			clarity_sel = '&clarity=' + cl_sel;
		}
	}

	gem_countries = gemCountry_mobile();

	min_weight_tmp = (document.getElementById('weight_min').value * 1);
	max_weight_tmp = (document.getElementById('weight_max').value * 1);
	if (min_weight_tmp > max_weight_tmp) {
		min_weight = max_weight_tmp;
		max_weight = min_weight_tmp;
	} else {
		min_weight = min_weight_tmp;
		max_weight = max_weight_tmp;
	}
	if (max_weight > 0) {
		gem_weight = '&weight_min=' + min_weight + '&weight_max=' + max_weight;
	}

	gem_size = gemSize_mobile();

	price_min = (document.getElementById('p_min').value * 1);
	price_max = (document.getElementById('p_max').value * 1);
	if (price_max > 0) {
		price_range = '&p_min=' + price_min + '&p_max=' + price_max;
	} else {
		price_range = '';
	}

	// top menu / single, pair, lots...	
	spls = '';
	top1 = document.getElementsByName('top_select');
	for (i = 0; i < top1.length; i++) {
		if (top1[i].type == "checkbox") {
			if (top1[i].checked == true) {
				top_check = top1[i].value;
				if (top_check == 'single' || top_check == 'pair' || top_check == 'lot' || top_check == 'by_pcs') {
					spls += top_check + "','";
				}
			}
		}
	}
	if (spls !== '') {
		spls = spls.substring(0, spls.length - 3);
		spls = '&spl=' + spls;
	} else {
		spls = '';
	}

	// top menu / faceted, cab
	faceted = '';
	f = '';
	if (document.getElementById('facet')) {
		f = document.getElementById('facet').checked;
	}
	if (f == true) {
		faceted = '&facet=facet';
	}
	cab = '';
	ca = '';
	if (document.getElementById('cab')) {
		ca = document.getElementById('cab').checked;
	}
	if (ca == true) {
		cab = '&cab=cabochon';
	}

	treatment = '';
	treat_tmp = '';
	if (document.getElementById('treatment')) {
		treat_tmp = document.getElementById('treatment').value;
	}
	if (treat_tmp !== '') {
		treatment = '&treat=' + treat_tmp;
	}

	new_arrivals = '';
	new_arr_tmp = '';
	if (document.getElementById('new_arrivals')) {
		new_arr_tmp = document.getElementById('new_arrivals').value;
	}
	if (new_arr_tmp == 1) {
		new_arrivals = '&new_arrivals=1';
	}

	top_grade = '';
	top_grade_tmp = '';
	if (document.getElementById('top_grade')) {
		top_grade_tmp = document.getElementById('top_grade').value;
	}
	if (top_grade_tmp == 1) {
		top_grade = '&top_grade=1';
	}

	huge_gem = '';
	huge_gem_tmp = '';
	if (document.getElementById('huge_gem')) {
		huge_gem_tmp = document.getElementById('huge_gem').value;
	}
	if (huge_gem_tmp == 1) {
		huge_gem = '&huge_gem=1';
	}

	sort = '';
	if (document.getElementById('sort_by')) {
		sort_val = document.getElementById('sort_by').value;
		if (sort_val !== '') {
			sort = '&' + sort_val + '=1';
		}
	}

	lang_selected = document.getElementById('lang_selected').value;
	lang_lower = lang_selected.toLowerCase();
	lang_str = '/' + lang_lower;
	if (lang_lower == 'english') {
		lang_str = '';
	}
	URL = lang_str + '/group/gemselect.php' + '?a=0' + gem_types + gem_base_colors + gem_shapes + shapes_det + gem_weight + gem_size + date_sort + clarity_sel + price_range + gem_countries + gem_style + gem_drilled + spls + faceted + cab + items + treatment + new_arrivals + sort + top_grade + huge_gem;
	RecURL(URL,'gemMenuMobile');
	window.open(URL, '_self');
}

function setSortBy(val) {
	document.getElementById('sort_by').value = val;
	gemMenuMobile();
}

function setSortBy_2(sort_by) {
	document.getElementById('sort_by').value = sort_by;
	c_uri = window.location.search;
	c_uri = ClearOldSort(c_uri);
	uri_p = document.getElementById('uri_path').value;
	if (c_uri != '') {
		new_uri = '/' + uri_p + c_uri + '&' + sort_by + '=1';
	} else {
		new_uri = '/' + uri_p + '?' + sort_by + '=1';
	}
	new_uri = new_uri.replace("default=1","");
	last_char = new_uri.substr(-1);
	if (last_char == '?') {
		new_uri = new_uri.substring(0, new_uri.length - 1);
	}
	if (last_char == '&') {
		new_uri = new_uri.substring(0, new_uri.length - 1);
	}
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'setSortBy_2');
	window.open(new_uri, '_self');
}

function gemSize_mobile() {
	gem_size = '';
	min_l = (document.getElementById('min_l').value * 1);
	min_l = (min_l * 0.96).toFixed(2);
	max_l = (document.getElementById('max_l').value * 1);
	max_l = (max_l * 1.04).toFixed(2);
	min_w = (document.getElementById('min_w').value * 1);
	min_w = (min_w * 0.96).toFixed(2);
	max_w = (document.getElementById('max_w').value * 1);
	max_w = (max_w * 1.04).toFixed(2);
	if (max_l > 0 && max_w > 0) {
		gem_size = '&min_l=' + min_l + '&max_l=' + max_l + '&min_w=' + min_w + '&max_w=' + max_w;
	}
	if (max_l > 0 && max_w == 0) {
		gem_size = '&min_l=' + min_l + '&max_l=' + max_l;
	}
	return gem_size;
}

//country
function gemCountry_mobile() {
	gem_countries = '';
	country = '';
	co = document.getElementsByName('country');
	for (var i = 0; i < co.length; i++) {
		country = co[i].value;
		gem_countries += country + "','";
	}
	gem_countries = gem_countries.substring(0, gem_countries.length - 3);
	if (gem_countries !== '') {
		gem_countries = '&countries=' + gem_countries;
	} else {
		gem_countries = '';
	}
	return gem_countries;
}

function gemShapes_mobile() {
	gem_shapes = '';
	g_shape = '';
	shapes = '';
	base_shape = 0;
	if (document.getElementsByName('m_shape').length > 0) {
		k = document.getElementsByName('m_shape');
		base_shape = 1;
	} else {
		k = document.getElementsByName('shape');
	}
	for (var i = 0; i < k.length; i++) {
		shape = k[i].value;
		shapes += shape + ',';
	}
	gem_shapes = shapes.substring(0, shapes.length - 1);
	if (gem_shapes !== '') {
		if (base_shape == 1) {
			gem_shapes = '&base_shape=' + gem_shapes;
		} else {
			gem_shapes = '&shape=' + gem_shapes;
		}
	}
	return gem_shapes;
}

function gemTypes_mobile() {
	// handle gem-types
	uri = '';
	gemtype = '';
	gem_types = '';
	x = document.getElementsByName('gemtype');
	for (var i = 0; i < x.length; i++) {
		gemtype = x[i].value;
		gem_types += gemtype + ',';
	}
	gem_types = gem_types.substring(0, gem_types.length - 1);
	if (gem_types !== '') {
		gem_types = '&g_type=' + gem_types;
	}
	return gem_types;
}

function gemBaseColors_mobile() {
	gemcolor = '';
	gem_colors = '';
	gem_base_colors = '';
	x = document.getElementsByName('base_color');
	for (var i = 0; i < x.length; i++) {
		gemcolor = x[i].value;
		if (gem_colors.indexOf(gemcolor) == -1) {
			gem_colors += gemcolor + ',';
		}
	}
	gem_colors = gem_colors.substring(0, gem_colors.length - 1);
	color = '';
	if (gem_colors !== '') {
		gem_colors = '&base_color=' + gem_colors;
	}
	gem_base_colors = gem_colors;
	return gem_base_colors;
}

function gemColors_mobile() {
	gemcolor = '';
	gem_colors = '';
	x = document.getElementsByName('color');
	for (var i = 0; i < x.length; i++) {
		gemcolor = x[i].value;
		if (gem_colors.indexOf(gemcolor) == -1) {
			gem_colors += gemcolor + ',';
		}
	}
	gem_colors = gem_colors.substring(0, gem_colors.length - 1);
	color = '';
	if (gem_colors !== '') {
		gem_colors = '&color=' + gem_colors;
	}
	return gem_colors;
}

function openWA(val) {
	document.getElementById('w_left').innerHTML = val;
}

function openWA(val) {
	document.getElementById('w_left').innerHTML = val;
}

function setWeight() {
	w_from_tmp = (document.getElementById('weight_from').value * 1);
	w_to_tmp = (document.getElementById('weight_to').value * 1);
	if (w_from_tmp > w_to_tmp) {
		w_from = w_to_tmp;
		w_to = w_from_tmp;
	} else {
		w_from = w_from_tmp;
		w_to = w_to_tmp;
	}
	document.getElementById('f_selection').style.display = '';
	if (document.getElementById('weight_range')) {
		document.getElementById('weight_range').style.display = '';
		range = w_from + 'ct to ' + w_to + 'ct';
		document.getElementById('weight_range').innerHTML = range;
	}
	document.getElementById('weight_min').value = w_from;
	document.getElementById('weight_max').value = w_to;
	document.getElementById('weight_cont').style.display = 'none';
}

function setSize() {
	length_from_tmp = (document.getElementById('length_from').value * 1);
	length_to_tmp = (document.getElementById('length_to').value * 1);
	if (length_from_tmp > length_to_tmp) {
		length_from = length_to_tmp;
		length_to = length_from_tmp;
	} else {
		length_from = length_from_tmp;
		length_to = length_to_tmp;
	}
	width_from_tmp = (document.getElementById('width_from').value * 1);
	width_to_tmp = (document.getElementById('width_to').value * 1);
	if (width_from_tmp > width_to_tmp) {
		width_from = width_to_tmp;
		width_to = width_from_tmp;
	} else {
		width_from = width_from_tmp;
		width_to = width_to_tmp;
	}
	l_fromtmp = length_from;
	l_totmp = length_to;
	w_fromtmp = width_from;
	w_totmp = width_to;
	if (length_to < width_to) {
		length_from = w_fromtmp;
		length_to = w_totmp;
		width_from = l_fromtmp;
		width_to = l_totmp;
	}
	document.getElementById('f_selection').style.display = '';
	document.getElementById('size_cont').style.display = '';
	if (document.getElementById('size_range')) {
		document.getElementById('size_range').style.display = '';
		size_range = length_from + '-' + length_to + ' to ' + width_from + '-' + width_to + 'mm';
		document.getElementById('size_range').innerHTML = size_range;
	}
	document.getElementById('min_l').value = length_from;
	document.getElementById('max_l').value = length_to;
	document.getElementById('min_w').value = width_from;
	document.getElementById('max_w').value = width_to;
	document.getElementById('size_cont').style.display = 'none';
}

function upLeTo() {
	len_from = document.getElementById('length_from').value;
	len_to = document.getElementById('length_to').value;
	if (len_to == '0') {
		document.getElementById('length_to').value = len_from;
	}
}

function upWiTo() {
	width_from = document.getElementById('width_from').value;
	width_to = document.getElementById('width_to').value;
	if (width_to == '0') {
		document.getElementById('width_to').value = width_from;
	}
}

function popMxVal() {
	weight_from = document.getElementById('weight_from').value;
	document.getElementById('weight_to').value = (weight_from * 1) + 1;
}

function setPrange(p_min, p_max) {
	document.getElementById('p_min').value = p_min;
	document.getElementById('p_max').value = p_max;
	document.getElementById('f_selection').style.display = '';
	document.getElementById('price_range').style.display = '';
	if (p_max == '100000') {
		price_range = '$' + p_min + ' and higher';
	} else {
		price_range = '$' + p_min + ' - ' + '$' + p_max;
	}
	document.getElementById('price_range').innerHTML = price_range;
	document.getElementById('size_cont').style.display = 'none';
}

function PrCheckout() {
	document.forms['totals_f'].action = '/cart/cust-address.php';
	document.forms['totals_f'].target = '_self';
	document.forms['totals_f'].submit();
}

function valInputs() {
	first_name = document.getElementById('first_name').value;
	if (first_name == '') {
		JSmessage('Please fill in your First Name');
		document.getElementById('first_name').focus();
		document.getElementById('first_name').backgroundColor = "#E6FFE6";
		return;
	}
	last_name = document.getElementById('last_name').value;
	if (last_name == '') {
		JSmessage('Please fill in your Last Name');
		document.getElementById('last_name').focus();
		document.getElementById('last_name').backgroundColor = "#E6FFE6";
		return;
	}
	address_1 = document.getElementById('address-1').value;
	if (address_1 == '') {
		JSmessage('Please fill in your Street Address');
		document.getElementById('address-1').focus();
		document.getElementById('address-1').backgroundColor = "#E6FFE6";
		return;
	}
	address_2 = document.getElementById('address-2').value;
	city = document.getElementById('city').value;
	if (city == '') {
		JSmessage('Please fill in the City');
		document.getElementById('city').focus();
		document.getElementById('city').backgroundColor = "#E6FFE6";
		return;
	}
	state = document.getElementById('state').value;
	if (state == '') {
		JSmessage('Please fill in the State / Province');
		document.getElementById('state').focus();
		document.getElementById('state').backgroundColor = "#E6FFE6";
		return;
	}
	customer_postal_code = document.getElementById('customer_postal_code').value;
	if (customer_postal_code == '') {
		JSmessage('Please fill in the Postal Code');
		document.getElementById('customer_postal_code').focus();
		document.getElementById('customer_postal_code').backgroundColor = "#E6FFE6";
		return;
	}
	country = document.getElementById('country').value;
	if (country == '0') {
		JSmessage('Please fill in the Country');
		document.getElementById('country').focus();
		document.getElementById('country').backgroundColor = "#E6FFE6";
		return;
	}
	customer_phone = document.getElementById('customer_phone').value;
	if (customer_phone == '') {
		JSmessage('Please fill in your Phone Number');
		document.getElementById('customer_phone').focus();
		document.getElementById('customer_phone').backgroundColor = "#E6FFE6";
		return;
	}
	customer_email = document.getElementById('customer_email').value;
	if (customer_email == '') {
		JSmessage('Please fill in your Email');
		document.getElementById('customer_email').focus();
		document.getElementById('customer_email').backgroundColor = "#E6FFE6";
		return;
	}
	email_conf = document.getElementById('email_conf').value;
	if (email_conf == '') {
		JSmessage('Please confirm your Email');
		document.getElementById('email_conf').focus();
		document.getElementById('email_conf').backgroundColor = "#E6FFE6";
		return;
	} else {
		// compare the emails
		if (customer_email != email_conf) {
			JSmessage("Emails don't match!");
			document.getElementById('email_conf').focus();
			document.getElementById('email_conf').backgroundColor = "#E6FFE6";
			return;
		}
	}
	//special_notes
	special_notes = document.getElementById('special_notes').value;
	showForm('timer', 'timer-inner');
	setProductToLocked();
}

function HelpCU() {
	//m_cu_cont
	if (document.getElementById('m_cu_cont')) {
		document.getElementById('c_us_div1').style.display = 'none';
	}
}
// use this fior Destop version in order to hide or show elements at startup
// the script is executed at the end of each page.
function HideorShow() {
	// use to hide sidebar for certain pages (Destop version)
	if (document.getElementById('acc_main_table')) {
		if (document.getElementById('right-panel')) {
			stat = document.getElementById('right-panel').style.display;
			if (stat == '' || stat == 'block') {
				document.getElementById('right-panel').style.display = 'none';
			}
		}
	}
	if (document.getElementById('filename')) {
		file_name = document.getElementById('filename').value;
		if (file_name == 'western-union-confirm-notify.php' || file_name == 'bank-transfer-confirm-notify.php') {
			if (document.getElementById('right-panel')) {
				document.getElementById('right-panel').style.display = 'none';
			}
		}
	}
	// add background color for selected shipping method in cart.php
	// check which chekbox is selected "rb_shiptype:
	if (document.getElementsByName('rb_shiptype')) {
		cb = document.getElementsByName('rb_shiptype');
		for (var i = 0; i < cb.length; i++) {
			if (cb[i].checked == true) {
				// clear current bg-color
				c_bg = document.getElementsByClassName('ship_bg');
				for (var z = 0; z < c_bg.length; z++) {
					c_bg[z].style.backgroundColor = '';
				}
				// set bg-color
				id = 'bg_' + cb[i].value;
				document.getElementById(id).style.backgroundColor = '#DADADA';
			}
		}
	}
	ShowShareBar_content();
}

function ShowShareBar_content() {
	if (document.getElementById('share_pages')) {
		$("#share_pages").delay(1800).slideDown(1500);
	}
}

function swapCL(id) {
	// m_mail_init
	cl = document.getElementsByClassName('m_mail_init');
	for (var i = 0; i < cl.length; i++) {
		cl[i].style.backgroundColor = '';
	}
	document.getElementById(id).style.color = 'black';
	document.getElementById(id).style.backgroundColor = '#E8FFE8';
	if (document.getElementById(id).placeholder) {
		document.getElementById(id).placeholder = '';
	}
}

function checkRadioBut(count) {
	ci = 'inp_' + count;
	document.getElementById(ci).checked = true;
}

function sendContactEmailMobile() {
	sess_id = document.getElementById('stick').value;
	newsletter = '1';
	// subject
	s = document.getElementsByName('categories');
	for (var i = 0; i < s.length; i++) {
		if (s[i].checked == true) {
			v = s[i].value;
			//s_id = 'subj_' + v;
			//subject = document.getElementById(s_id).innerHTML;
			subject = v;
		}
	}
	email = document.getElementById('email').value;
	email = email.toLowerCase();
	if (email == '') {
		JSmessage('Please Enter an Email');
		document.getElementById('email').style.backgroundColor = "#FFE8E8";
		document.getElementById('email').focus();
		return;
	} else {
		test = valEmail(email);
		if (test == false) {
			JSmessage('invalid email format (' + email + ')');
			document.getElementById('email').style.backgroundColor = "#FFE8E8";
			document.getElementById('email').focus();
			return;
		} else {
			// valid email returned, we can now move on
			document.getElementById('email').style.backgroundColor = "";
		}
	}
	confirm_email = document.getElementById('confirm_email').value;
	confirm_email = confirm_email.toLowerCase();
	if (confirm_email !== email) {
		JSmessage('Emails do not Match!');
		document.getElementById('confirm_email').style.backgroundColor = "#FFE8E8";
		document.getElementById('confirm_email').focus();
		return;
	} else {
		document.getElementById('confirm_email').style.backgroundColor = "";
	}
	msg = document.getElementById('msg').value;
	if (msg == '') {
		JSmessage('Please Enter a Message');
		document.getElementById('msg').style.backgroundColor = "#FFE8E8";
		document.getElementById('msg').focus();
		return;
	} else {
		document.getElementById('msg').style.backgroundColor = "";
	}
	validate = document.getElementById('validate_cont_img').value;
	if (validate == '') {
		JSmessage('Please Enter the Validation Code shown on the Image');
		document.getElementById('validate_cont_img').style.backgroundColor = "#FFE8E8";
		document.getElementById('validate_cont_img').focus();
		return;
	} else {
		document.getElementById('validate_cont_img').style.backgroundColor = "";
	}
	val_img_name = document.getElementById('img_v_contact').value;
	dataset = {
		sess_id: sess_id,
		nl: newsletter,
		subject: subject,
		email: email,
		msg: msg,
		validate: validate,
		val_img_name: val_img_name
	};
	URL = '/includes/inc/ajax_receiver.php?job=sendContactEmail';
	AjaxGeneral(URL, dataset);
}

function setHeightContainer() {
	//bread_all
	if (document.getElementById('bread_all')) {
		stat = document.getElementById('bread_all').style.display;
		if (stat == 'none') {
			if (document.getElementById('m_content')) {
				document.getElementById('m_content').style.marginTop = '3.6em';
			}
		}
	}
	// add background color for selected shipping method in cart.php
	// check which chekbox is selected "rb_shiptype:
	if (document.getElementsByName('rb_shiptype')) {
		cb = document.getElementsByName('rb_shiptype');
		for (var i = 0; i < cb.length; i++) {
			if (cb[i].checked == true) {
				// clear current bg-color
				c_bg = document.getElementsByClassName('ship_bg');
				for (var z = 0; z < c_bg.length; z++) {
					c_bg[z].style.backgroundColor = '';
				}
				// set bg-color
				id = 'bg_' + cb[i].value;
				document.getElementById(id).style.backgroundColor = '#DADADA';
			}
		}
	}
}

function openAccMsg(row_id) {
	e_id = 'acc_e-msg_' + row_id;
	stat = document.getElementById(e_id).style.display;
	if (stat == 'none') {
		document.getElementById(e_id).style.display = 'block';
	} else {
		document.getElementById(e_id).style.display = 'none';
	}
}

function openCLhome(id, e, img_id) {
	if (e.target == '[object HTMLImageElement]' || e.srcElement == '[object HTMLDivElement]') {
		stat = document.getElementById(id).style.display;
		if (stat == 'none') {
			$("#" + id).slideDown(800);
			document.getElementById(img_id).style.opacity = "0.4";
		} else {
			$("#" + id).slideUp(250);
			document.getElementById(img_id).style.opacity = "";
		}
	}
}

function THlogin() {
	sess_id = document.getElementById('sess_id').value;
	th_user = document.getElementById('th_user').value;
	if (th_user == '') {
		alert('Please enter a valid username');
		document.getElementById('th_user').focus();
		return;
	}
	th_pwd = document.getElementById('th_pwd').value;
	if (th_pwd == '' || th_pwd == 0 || th_pwd == '0') {
		alert('Please enter a valid password');
		document.getElementById('th_pwd').focus();
		return;
	}
	dataset = {
		th_user: th_user,
		th_pwd: th_pwd,
		sess_id: sess_id
	};
	URL = '/includes/inc/ajax_responder.php?job=THlogin';
	AjaxGeneral(URL, dataset);
}

function swapMimg(img_src) {
	document.getElementById('img_main').src = img_src;
}

function set_CHB(val, e) {
	check = document.getElementById(val).checked;
	if (check == false) {
		if (e.target == '[object HTMLTableCellElement]' || e.srcElement == '[object HTMLDivElement]') {
			document.getElementById(val).checked = true;
		}
	} else {
		if (e.target == '[object HTMLTableCellElement]' || e.srcElement == '[object HTMLDivElement]') {
			document.getElementById(val).checked = false;
		}
	}
}

function OpenSubTypes(div_id, idcnt) {
	stat = document.getElementById(div_id).style.display;
	if (stat == 'none') {
		$("#" + div_id).slideDown(350);
		document.getElementById('subGtype' + idcnt).style.backgroundColor = "#000066";
		document.getElementById('subGtype' + idcnt).style.color = "white";
		document.getElementById('subGtype' + idcnt).style.opacity = "0.4";
		if (document.getElementById('sel_sort')) {
			document.getElementById('sel_sort').style.display = 'none';
		}
	} else {
		$("#" + div_id).slideUp(300);
		document.getElementById('subGtype' + idcnt).style.opacity = "";
		document.getElementById('subGtype' + idcnt).style.backgroundColor = "white";
		document.getElementById('subGtype' + idcnt).style.color = "#000066";
		document.getElementById('subGtype' + idcnt).style.backgroundColor = '#efefef';
		if (document.getElementsByClassName("bg_gt_sel")) {
			bgcl = document.getElementsByClassName("bg_gt_sel");
			for (i = 0; i < bgcl.length; i++) {
				// class exists, item selected
				document.getElementById('subGtype').style.color = '#C0571D';
				document.getElementById('subGtype').style.backgroundColor = '#D9FFD9';
			}
		}
	}
}

function promoAnimation() {
	if (document.getElementById('promo_count')) {
		var count = (document.getElementById('promo_count').value * 1);
		var x = 0;
		for (var i = 0; i < 1000; i++) {
			setTimeout(function() {
				if (x == count) {
					x = 0;
				}
				x++;
				sA(count, x);
			}, 8000 * i);
		}
	}
}

function sA(count, x) {
	$('.promo_p').hide();
	$('.d_' + x).fadeIn(2500);
	x++;
}

function UpTranslation(aa, event) {
	if (event.preventDefault) {
		event.preventDefault();
	}

	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}
	if (event.target == '[object HTMLInputElement]') {
		// open popup to add new value
		showForm('trans-div', 'trans-cont');
		document.getElementById('curr_value').value = aa.value;
	}
}

function SaveTransVal() {
	language = document.getElementById('lang_selected').value;
	custid = document.getElementById('custid').value;
	curr_val = document.getElementById('curr_value').value;
	new_val_tmp = document.getElementById('new_value').value;
	if (new_val_tmp == '') {
		JSmessage('Please enter a new value');
		document.getElementById('new_value').focus();
		return;
	} else {
		new_val = new_val_tmp;
	}
	dataset = {
		language: language,
		custid: custid,
		curr_val: curr_val,
		new_val: new_val
	};
	URL = '/includes/inc/ajax_responder.php?job=SaveTransVal';
	AjaxGeneral(URL, dataset);
}

function ScrollD(e_id) {
	$("#" + e_id).animate({
		scrollTop: $("#inner_tb").height()
	}, 1000);
}

function GSaccountCheck(email) {
	if (email != '') {
		dataset = {
			email: email
		};
		URL = '/includes/inc/ajax_receiver.php?job=GSaccountCheck';
		AjaxGeneral(URL, dataset);
	} else {
		JSmessage('No email provided to login? Please allow to provide your email!');
	}
}

function NoEmail() {
	hideForm('timer', 'timer-inner');
	showForm('fb-div2', 'fb-cont2');
}

function showShareTR() {
	if (document.getElementById('over_div')) {
		$("#over_div").delay(1800).fadeOut(1500);
	}
}

function firstIMG() {
	first_img = $('#main_content:first img').attr('src');
	first_img = 'https://www.gemselect.com' + first_img;
	document.querySelector('meta[property="og:image"]').setAttribute("content", first_img);
}

/* convert Javascript alerts in all languages */
function JSmessage(msg) {
	msg = ReadLangObject(msg);
	showFormPOP('jp-div', 'jp-cont');
	document.getElementById('jp-inner').innerHTML = msg;
}

function JSmessageCHK(msg) {
	msg = ReadLangObject(msg);
	showFormPOP('chk-div', 'chk-cont');
	document.getElementById('chk-inner').innerHTML = msg;
}

function JSmessage_2(msg) {
	msg = ReadLangObject(msg);
	showFormPOP('jp-div_2', 'jp-cont_2');
	document.getElementById('jp-inner_2').innerHTML = msg;
}

function JSmessage_closeAcc(msg) {
	msg = ReadLangObject(msg);
	showFormPOP('clacc-div', 'clacc-cont');
	document.getElementById('clacc-inner').innerHTML = msg;
}

function JSmessage_accSignup(msg, email, pwd) {
	if (email != '') {
		if (document.getElementById('acc-inner2')) {
			document.getElementById('accS_email').innerHTML = '<div>Username: <strong>' + email + '</strong></div>';
			document.getElementById('accS_pwd').innerHTML = '<div>Password: <strong>' + pwd + '</strong></div>';
			document.getElementById('acc-inner2').style.display = '';
		}
	}
	msg = ReadLangObject(msg);
	showFormPOP('acc-div', 'acc-cont');
	document.getElementById('acc-inner').innerHTML = msg;
}

function ReadLangObject(msg) {
	lang = document.getElementById('lang_selected').value;
	if (lang == 'English') {
		return msg;
	}
	var lang_array = '';
	if (lang == 'Arabic') {
		if (typeof(Arabic_array) === 'object') {
			lang_array = Arabic_array;
		}
	}
	if (lang == 'Chinese') {
		if (typeof(Chinese_array) === 'object') {
			lang_array = Chinese_array;
		}
	}
	if (lang == 'French') {
		if (typeof(French_array) === 'object') {
			lang_array = French_array;
		}
	}
	if (lang == 'German') {
		if (typeof(German_array) === 'object') {
			lang_array = German_array;
		}
	}
	if (lang == 'Italian') {
		if (typeof(Italian_array) === 'object') {
			lang_array = Italian_array;
		}
	}
	if (lang == 'Japanese') {
		if (typeof(Japanese_array) === 'object') {
			lang_array = Japanese_array;
		}
	}
	if (lang == 'Russian') {
		if (typeof(Russian_array) === 'object') {
			lang_array = Russian_array;
		}
	}
	if (lang == 'Spanish') {
		if (typeof(Spanish_array) === 'object') {
			lang_array = Spanish_array;
		}
	}
	if (lang == 'Korean') {
		if (typeof(Korean_array) === 'object') {
			lang_array = Korean_array;
		}
	}
	if (lang == 'Portuguese') {
		if (typeof(Portuguese_array) === 'object') {
			lang_array = Portuguese_array;
		}
	}
	// loop through key => value pairs
	for (key in lang_array) {
		if (key == msg) {
			msg = lang_array[key];
		}
	}
	return msg;
}

function showFormPOP(bgdiv, contdiv) {
	//if (dId('video-hide') !== null) {
	//	MM_changeProp('video-hide', '', 'visibility', 'hidden', 'IMG');
	//}
	if (document.getElementById(bgdiv)) {
		oDiv = document.getElementById(bgdiv);
		$("#" + bgdiv).fadeIn(280);
		//oDiv.style.display='block';
		if (navigator.appName == "Microsoft Internet Explorer" && navigator.userAgent.toLowerCase().indexOf('msie 6') != -1) {
			oDiv.style.position = "absolute";
		}
		oDiv = document.getElementById(contdiv);
		$("#" + contdiv).fadeIn(280);
		//oDiv.style.display='block';
	}
	return false;
}
/* END Javascript alerts in all languages */

function EnlargeIMG(uri) {
	document.getElementById('enl-img').src = uri;
	showFormPOP('enl-div', 'enl-cont');
}

function getCustDetails_new() {
	document.getElementById('new_checkout').value = 1;
	getCustDetails();
}

function getCustDetails() {
	sess_id = document.getElementById('sess_id').value;
	// log the initial button hit
	dataset = {
		data_init: 'Button Clicked',
		sess_id: sess_id
	};
	URL2 = '/includes/inc/ajax_receiver.php?job=RecordPayAttempt_1';
	AjaxGeneral(URL2, dataset);

	new_checkout = 0;
	if (document.getElementById('new_checkout')) {
		new_checkout = document.getElementById('new_checkout').value;
	}

	first_name = document.getElementById('first_name').value;
	if (first_name == '') {
		JSmessage('Please fill in your First Name');
		document.getElementById('first_name').style.backgroundColor = '#E6FFE6';
		document.getElementById('first_name').focus();
		return;
	}
	last_name = document.getElementById('last_name').value;
	if (last_name == '') {
		JSmessage('Please fill in your Last Name');
		document.getElementById('last_name').focus();
		document.getElementById('last_name').style.backgroundColor = "#E6FFE6";
		return;
	}
	address_1 = document.getElementById('address-1').value;
	if (address_1 == '') {
		JSmessage('Please fill in your Street Address');
		document.getElementById('address-1').focus();
		document.getElementById('address-1').style.backgroundColor = "#E6FFE6";
		return;
	}
	address_2 = document.getElementById('address-2').value;
	city = document.getElementById('city').value;
	if (city == '') {
		JSmessage('Please fill in the City');
		document.getElementById('city').focus();
		document.getElementById('city').style.backgroundColor = "#E6FFE6";
		return;
	}

	// try to get the paypal state from the dropdown at first
	pp_state = 0;
	// check if tr is visible "state_dropdown"
	if (document.getElementById("state_dropdown")) {
		sd = document.getElementById("state_dropdown").style.display;
		if (sd != 'none') {
			if (document.getElementById('pp_state')) {
				e = document.getElementById("pp_state");
				pp_state = e.options[e.selectedIndex].value;
				if (pp_state == 0) {
					JSmessage('Please select a State / Province');
					document.getElementById('pp_state').focus();
					return;
				}
				state = pp_state;
			}
		}
	}

	if (pp_state == 0) {
		state = document.getElementById('state').value;
		if (state == '') {
			JSmessage('Please fill in the State / Province');
			document.getElementById('state').focus();
			document.getElementById('state').style.backgroundColor = "#E6FFE6";
			return;
		}
	}

	customer_postal_code = document.getElementById('customer_postal_code').value;
	if (customer_postal_code == '') {
		JSmessage('Please fill in the Postal Code');
		document.getElementById('customer_postal_code').focus();
		document.getElementById('customer_postal_code').style.backgroundColor = "#E6FFE6";
		return;
	}
	country = document.getElementById('country').value;
	if (country == '0') {
		JSmessage('Please fill in the Country');
		document.getElementById('country').focus();
		document.getElementById('country').style.backgroundColor = "#E6FFE6";
		return;
	}
	customer_phone = document.getElementById('customer_phone').value;
	if (customer_phone.length < 5) {
		JSmessage('Please fill in your Phone Number');
		document.getElementById('customer_phone').focus();
		document.getElementById('customer_phone').style.backgroundColor = "#E6FFE6";
		return;
	}
	customer_email = document.getElementById('customer_email').value;
	if (customer_email == '') {
		JSmessage('Please fill in your Email');
		document.getElementById('customer_email').focus();
		document.getElementById('customer_email').style.backgroundColor = "#E6FFE6";
		return;
	}
	email_conf = document.getElementById('email_conf').value;
	if (email_conf == '') {
		JSmessage('Please confirm your Email');
		document.getElementById('email_conf').focus();
		document.getElementById('email_conf').style.backgroundColor = "#E6FFE6";
		return;
	} else {
		// compare the emails
		if (customer_email != email_conf) {
			JSmessage("Emails don't match!");
			document.getElementById('email_conf').focus();
			document.getElementById('email_conf').style.backgroundColor = "#E6FFE6";
			return;
		}
	}
	alternative_email = document.getElementById('alternative_email').value;
	skype = document.getElementById('skype').value;

	special_notes = document.getElementById('special_notes').value;
	lang_selected = document.getElementById('lang_selected').value;
	mobile = document.getElementById('mobile').value;
	md5sum = document.getElementById('md5sum').value;
	shippingcharge = document.getElementById('shippingcharge').value;
	pay_init_shippingcharge = document.getElementById('pay_init_shippingcharge').value;
	shippingtype = document.getElementById('shippingtype').value;
	pay_init_shippingtype = document.getElementById('pay_init_shippingtype').value;
	subtotal = document.getElementById('subtotal').value;
	grandsubtotal = document.getElementById('grandtotal').value;
	want_newsletter = document.getElementById('want_newsletter').value;
	save_address = document.getElementById('save_address').value;
	filename = document.getElementById('filename').value;
	custid = document.getElementById('custid').value;

	// GET BY NAME
	cc = document.getElementsByName('cc-checkout');
	for (var i = 0; i < cc.length; i++) {
		if (cc[i].checked == true) {
			cc_checkout = cc[i].value;
		}
	}

	// VALIDATE WITH PHP
	showForm('timer', 'timer-inner');
	dataset = {
		first_name: first_name,
		last_name: last_name,
		address_1: address_1,
		address_2: address_2,
		city: city,
		state: state,
		customer_postal_code: customer_postal_code,
		country: country,
		customer_phone: customer_phone,
		customer_email: customer_email,
		email_conf: email_conf,
		alternative_email: alternative_email,
		skype: skype,
		special_notes: special_notes,
		lang_selected: lang_selected,
		mobile: mobile,
		md5sum: md5sum,
		shippingcharge: shippingcharge,
		pay_init_shippingcharge: pay_init_shippingcharge,
		pay_init_shippingtype: pay_init_shippingtype,
		shippingtype: shippingtype,
		subtotal: subtotal,
		grandsubtotal: grandsubtotal,
		sess_id: sess_id,
		want_newsletter: want_newsletter,
		save_address: save_address,
		filename: filename,
		cc_checkout: cc_checkout,
		new_checkout: new_checkout,
		custid: custid
	};
	URL = '/cart/pay-gateway.php?job=getCustDetails';
	AjaxCustDetails(URL, dataset);

	URL2 = '/includes/inc/ajax_receiver.php?job=RecordPayAttempt';
	AjaxGeneral(URL2, dataset);
}

function AjaxCustDetails(URL, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL,
		data: dataset,
		dataType: "json",
		success: function(data) {
			if (data.setProductToLocked2 == 2) {
				prodid_locked = data.item_to_lock;
				sess_id = document.getElementById('stick').value;
				JSmessage('One Item is currently unavailable! We removed it from your cart and will refresh your Page');
				url = 'https://www.gemselect.com/cart/cart.php';
				RecURL(url,'AjaxCustDetails');
				window.open(url, '_self');
				return;
			}

			if (data.getCustDetails == 1) {
				//hideForm('timer','timer-inner');
				RecURL(data.url,'AjaxCustDetails');
				window.open(data.url, '_self');
			}
			if (data.getCustDetails == 2) {
				hideForm('timer', 'timer-inner');
				JSmessage(data.err_msg);
			}
			// new paypal checkout function
			if (data.getCustDetails_new == 1) {
				RecURL(data.url,'AjaxCustDetails');
				window.open(data.url, '_self');
			}
			if (data.getCustDetails_new == 2) {
				hideForm('timer', 'timer-inner');
				JSmessage('The PayPal checkout did not complete! Please choose another option or try again later.');
			}

		},
		error: function() {
			// alert errors here			
		}
	});
}

function CheckVisibility() {
	var focused = true;
	document.addEventListener("visibilitychange", function() {
		focused = !focused;
		if (!focused)
			document.getElementById("v").pause();
	});
}

function GetCSV(val) {
	text = document.getElementById(val).value;
	var input = document.createElement('input');
	input.setAttribute('value', text);
	document.body.appendChild(input);
	input.select();
	document.execCommand('copy');
	document.body.removeChild(input);
}

function getStates() {
	showForm('timer', 'timer-inner');
	mobile = document.getElementById('mobile').value;
	country = document.getElementById('country').value;
	dataset = {
		country: country,
		mobile: mobile
	};
	URL = '/includes/inc/ajax_responder.php?job=getStates';
	AjaxGeneral(URL, dataset);
}

function chColor() {
	document.getElementById('pp_state').style.backgroundColor = '';
}

function setSwitch(type) {
	sess_id = document.getElementById('stick').value;
	dataset = {
		sess_id: sess_id,
		type: type
	};
	URL = '/includes/inc/ajax_receiver.php?job=setSwitch';
	AjaxGeneral(URL, dataset);
}

//*****************************************************************************************
// NEW CHECKOUT FUNCTIONS, May-02-2018

function ValidateAndCheckout_2() {
	// check for country_code
	// return message if country is not allowed temporarily
	if (document.getElementById('country')) {
		country = document.getElementById('country').value;
		if (country == 'India') {
			// popup msg and exit process
			JSmessage('We currently cannot ship to India due to customs policies in India, we apologize for this issue');
			//alert("We currently cannot ship to India due to India's customs policies!, We apologize for this issue");
			return;
		}
	}
	// new_checkout
	document.getElementById('new_checkout').value = 1;
	ValidateAndCheckout();
}

function ValidateAndCheckout() {
	new_checkout = 0;
	if (document.getElementById('new_checkout')) {
		new_checkout = document.getElementById('new_checkout').value;
	}
	sess_id = document.getElementById('sess_id').value;
	// log the initial button hit
	dataset = {
		data_init: 'Button Clicked',
		sess_id: sess_id
	};
	URL2 = '/includes/inc/ajax_receiver.php?job=RecordPayAttempt_1';
	AjaxGeneral(URL2, dataset);

	first_name = document.getElementById('first_name').value;
	if (first_name == '') {
		JSmessage('Please fill in your First Name');
		document.getElementById('first_name').style.backgroundColor = '#E6FFE6';
		document.getElementById('first_name').focus();
		return;
	}
	last_name = document.getElementById('last_name').value;
	if (last_name == '') {
		JSmessage('Please fill in your Last Name');
		document.getElementById('last_name').focus();
		document.getElementById('last_name').style.backgroundColor = "#E6FFE6";
		return;
	}
	address_1 = document.getElementById('address-1').value;
	if (address_1 == '') {
		JSmessage('Please fill in your Street Address');
		document.getElementById('address-1').focus();
		document.getElementById('address-1').style.backgroundColor = "#E6FFE6";
		return;
	}
	address_2 = document.getElementById('address-2').value;
	city = document.getElementById('city').value;
	if (city == '') {
		JSmessage('Please fill in the City');
		document.getElementById('city').focus();
		document.getElementById('city').style.backgroundColor = "#E6FFE6";
		return;
	}

	// try to get the paypal state from the dropdown at first
	pp_state = 0;
	// check if tr is visible "state_dropdown"
	if (document.getElementById("state_dropdown")) {
		sd = document.getElementById("state_dropdown").style.display;
		if (sd != 'none') {
			if (document.getElementById('pp_state')) {
				e = document.getElementById("pp_state");
				pp_state = e.options[e.selectedIndex].value;
				if (pp_state == 0) {
					JSmessage('Please select a State / Province');
					document.getElementById('pp_state').focus();
					return;
				}
				state = pp_state;
			}
		}
	}

	if (pp_state == 0) {
		state = document.getElementById('state').value;
		if (state == '') {
			JSmessage('Please fill in the State / Province');
			document.getElementById('state').focus();
			document.getElementById('state').style.backgroundColor = "#E6FFE6";
			return;
		}
	}

	customer_postal_code = document.getElementById('customer_postal_code').value;
	if (customer_postal_code == '') {
		JSmessage('Please fill in the Postal Code');
		document.getElementById('customer_postal_code').focus();
		document.getElementById('customer_postal_code').style.backgroundColor = "#E6FFE6";
		return;
	}
	country = document.getElementById('country').value;
	if (country == '0') {
		JSmessage('Please fill in the Country');
		document.getElementById('country').focus();
		document.getElementById('country').style.backgroundColor = "#E6FFE6";
		return;
	}
	customer_phone = document.getElementById('customer_phone').value;
	if (customer_phone.length < 5) {
		JSmessage('Please fill in your Phone Number');
		document.getElementById('customer_phone').focus();
		document.getElementById('customer_phone').style.backgroundColor = "#E6FFE6";
		return;
	}
	customer_email = document.getElementById('customer_email').value;
	customer_email = customer_email.trim();
	if (customer_email == '') {
		JSmessage('Please fill in your Email');
		document.getElementById('customer_email').focus();
		document.getElementById('customer_email').style.backgroundColor = "#E6FFE6";
		return;
	}
	email_conf = document.getElementById('email_conf').value;
	email_conf = email_conf.trim();
	if (email_conf == '') {
		JSmessage('Please confirm your Email');
		document.getElementById('email_conf').focus();
		document.getElementById('email_conf').style.backgroundColor = "#E6FFE6";
		return;
	} else {
		// compare the emails
		if (customer_email != email_conf) {
			JSmessage("Emails don't match!");
			document.getElementById('email_conf').focus();
			document.getElementById('email_conf').style.backgroundColor = "#E6FFE6";
			return;
		}
	}
	alternative_email = document.getElementById('alternative_email').value;
	skype = document.getElementById('skype').value;

	special_notes = document.getElementById('special_notes').value;
	lang_selected = document.getElementById('lang_selected').value;
	mobile = document.getElementById('mobile').value;
	md5sum = document.getElementById('md5sum').value;
	shippingcharge = document.getElementById('shippingcharge').value;
	pay_init_shippingcharge = document.getElementById('pay_init_shippingcharge').value;
	shippingtype = document.getElementById('shippingtype').value;
	pay_init_shippingtype = document.getElementById('pay_init_shippingtype').value;
	subtotal = document.getElementById('subtotal').value;
	grandsubtotal = document.getElementById('grandtotal').value;
	want_newsletter = document.getElementById('want_newsletter').value;
	save_address = document.getElementById('save_address').value;
	filename = document.getElementById('filename').value;
	custid = document.getElementById('custid').value;

	cust_discount = 0;
	if (document.getElementById('cust_discount')) {
		cust_discount = document.getElementById('cust_discount').value;
	}
	cust_discount_perc = 0;
	if (document.getElementById('cust_discount_perc')) {
		cust_discount_perc = document.getElementById('cust_discount_perc').value;
	}
	cust_discount_nulti = 0;
	if (document.getElementById('cust_discount_nulti')) {
		cust_discount_nulti = document.getElementById('cust_discount_nulti').value;
	}

	// GET BY NAME
	cc = document.getElementsByName('cc-checkout');
	for (var i = 0; i < cc.length; i++) {
		if (cc[i].checked == true) {
			cc_checkout = cc[i].value;
		}
	}

	// VALIDATE WITH PHP
	// show timer, auto hide in a few seconds
	showForm('timer', 'timer-inner');
	setTimeout(function() {
		hideForm('timer', 'timer-inner');
	}, 6000);
	dataset = {
		first_name: first_name,
		last_name: last_name,
		address_1: address_1,
		address_2: address_2,
		city: city,
		state: state,
		customer_postal_code: customer_postal_code,
		country: country,
		customer_phone: customer_phone,
		customer_email: customer_email,
		email_conf: email_conf,
		alternative_email: alternative_email,
		skype: skype,
		special_notes: special_notes,
		lang_selected: lang_selected,
		mobile: mobile,
		md5sum: md5sum,
		shippingcharge: shippingcharge,
		pay_init_shippingcharge: pay_init_shippingcharge,
		pay_init_shippingtype: pay_init_shippingtype,
		shippingtype: shippingtype,
		subtotal: subtotal,
		grandsubtotal: grandsubtotal,
		sess_id: sess_id,
		want_newsletter: want_newsletter,
		save_address: save_address,
		filename: filename,
		cc_checkout: cc_checkout,
		custid: custid,
		cust_discount: cust_discount,
		cust_discount_perc: cust_discount_perc,
		cust_discount_nulti: cust_discount_nulti
	};

	if (new_checkout == 1) {
		URL = '/cart/pay-gateway_v3.php?job=ValidateAndCheckout';
	} else {
		URL = '/cart/pay-gateway_v2.php?job=ValidateAndCheckout';
	}

	Ajax_Checkout(URL, dataset);
}

function CheckoutBuyNow(prodid) {
	lang = document.getElementById('lang_selected').value;
	lang_lower = lang.toLowerCase();
	if (lang_lower == 'english') {
		window.open('/cart/buy-now.php?prodid=' + prodid, '_self');
	} else {
		window.open('/' + lang_lower + '/cart/buy-now.php?prodid=' + prodid, '_self');
	}

	/*
	item_price = '';
	sess_id = document.getElementById('stick').value;	
	lang_selected = document.getElementById('lang_selected').value;
	mobile = document.getElementById('mobile_phone').value;
	if (document.getElementById('prod2_' + prodid)) {
		item_price = document.getElementById('prod2_' + prodid).innerHTML;
	}
	subtotal = document.getElementById('prod_price_' + prodid).value;
	filename = document.getElementById('filename').value;
	custid = document.getElementById('custid').value;
	country_code = document.getElementById('country_code').value;

	cust_discount = 0;
	if (document.getElementById('cust_discount')) {
		cust_discount = document.getElementById('cust_discount').value;
	}
	cust_discount_perc = 0;
	if (document.getElementById('dis_percentage')) {
		cust_discount_perc = document.getElementById('dis_percentage').value;
	}
	cust_discount_nulti = 0;
	if (document.getElementById('dis_multiplier')) {
		cust_discount_nulti = document.getElementById('dis_multiplier').value;
	}
	current_uri = document.getElementById('uri_path').value;

	showForm('timer','timer-inner');
	dataset = {current_uri: current_uri, country_code: country_code, prodid: prodid, sess_id: sess_id, lang_selected: lang_selected, mobile: mobile, item_price: item_price, subtotal: subtotal, filename: filename, custid: custid, cust_discount: cust_discount, cust_discount_perc: cust_discount_perc, cust_discount_nulti: cust_discount_nulti};

	URL = '/cart/pay-gateway_v3.php?job=CheckoutBuyNow';	
	Ajax_Checkout(URL, dataset);
	*/

}

function Ajax_Checkout(URL, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL,
		data: dataset,
		dataType: "json",
		success: function(data) {
			if (data.ValidateAndCheckout == 2) {
				hideForm('timer', 'timer-inner');
				JSmessage(data.message);
			}

			if (data.UpdateButtonType == 1) {
				ValidateAndCheckout_4();
			}

			if (data.k_payment == 1) {
				document.querySelector(".pay-button").click();
				//hideForm('timer', 'timer-inner');
			}

			if (data.ValidateAndCheckout == 3) {
				if (data.type == 'all') {
					// show message and return to cart
					hideForm('timer', 'timer-inner');
					url = 'https://www.gemselect.com/cart/cart.php';
					if (document.getElementById('jp-div')) {
						document.getElementById('jp-div').onclick = function() {
							RecURL(url,'Ajax_Checkout');
							window.open(url, '_self');
						};
					}
					if (document.getElementById('cl_cross')) {
						document.getElementById('cl_cross').onclick = function() {
							RecURL(url,'Ajax_Checkout');
							window.open(url, '_self');
						};
					}
					JSmessage(data.message);
				}
				if (data.type == 'some') {
					// show message and return to cust-address
					hideForm('timer', 'timer-inner');
					url = 'https://www.gemselect.com/cart/cust-address.php';
					if (document.getElementById('jp-div')) {
						document.getElementById('jp-div').onclick = function() {
							RecURL(url,'Ajax_Checkout');
							window.open(url, '_self');
						};
					}
					if (document.getElementById('cl_cross')) {
						document.getElementById('cl_cross').onclick = function() {
							window.open(url, '_self');
						};
					}
					JSmessage(data.message);
				}
			}

			// new paypal checkout, success
			if (data.ValidateAndCheckout == 4) {
				RecURL(data.url,'Ajax_Checkout');
				window.open(data.url, '_self');
			}
			// new paypal checkout, failed
			if (data.ValidateAndCheckout == 5) {
				hideForm('timer', 'timer-inner');
				JSmessage('The PayPal checkout did not complete! Please choose another option or try again later.');
			}

			if (data.ValidateAndCheckout == 6) {
				RecURL(data.url,'Ajax_Checkout');
				window.open(data.url, '_self');
			}

			if (data.ValidateAndCheckout == 7) {
				// inject form and submit
				document.getElementById('ksk_form_div').innerHTML = data.html;
				document.getElementById('Kasikorn').submit();
			}

			if (data.ValidateAndCheckout == 8) {
				// error
			}

			if (data.ValidateAndCheckout == 9) {
				hideForm('timer', 'timer-inner');
				JSmessage('CITY, ZIP-CODE or STATE is not correct, Please verify!');
			}
			if (data.ValidateAndCheckout == 10) {
				hideForm('timer', 'timer-inner');
				JSmessage('POSTAL CODE IS INVALID, Please verify!');
			}
			if (data.ValidateAndCheckout == 11) {
				hideForm('timer', 'timer-inner');
				JSmessage('STATE / PROVINCE text is too long!');
			}
			if (data.ValidateAndCheckout == 12) {
				hideForm('timer', 'timer-inner');
				JSmessage("The Card was either declined by the processor or bank, or it can't be used for this payment.");
			}
			if (data.ValidateAndCheckout == 13) {
				hideForm('timer', 'timer-inner');
				JSmessage("The Phone number has an incorrect format.");
			}
		},
		error: function() {
			alert('Ajax_Checkout ERROR');
		}
	});
}

function toggleButtons(show, hide) {
	i_h = hide;
	i_s = show;
	document.getElementById('go_to_home').style.display = '';
	document.getElementById('wu_back_sh').style.display = 'none';
}

function TriggerSearch(term) {
	document.getElementById('search').value = term;
	search();
}

function ChangeColorDropDown(prodid) {
	showForm('timer', 'timer-inner');
	sess_id = document.getElementById('stick').value;
	base_color = document.getElementById('up_base_color').value;
	type_id = document.getElementById('type_id').value;
	dataset = {
		type_id: type_id,
		sess_id: sess_id,
		prodid: prodid,
		base_color: base_color
	};
	URL = '/includes/inc/ajax_responder.php?job=ChangeColorDropDown';
	AjaxAttributeUpdate(URL, dataset);
}

function UpdateBC_C(prodid) {
	showForm('timer', 'timer-inner');
	sess_id = document.getElementById('stick').value;
	base_color = document.getElementById('up_base_color').value;
	color = document.getElementById('up_color').value;
	//alert(sess_id + ' - ' + base_color + ' - ' + color + ' - ' + prodid)
	dataset = {
		sess_id: sess_id,
		prodid: prodid,
		base_color: base_color,
		color: color
	};
	URL = '/includes/inc/ajax_responder.php?job=UpdateBC_C';
	AjaxAttributeUpdate(URL, dataset);
}

function AjaxAttributeUpdate(URL, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL,
		data: dataset,
		dataType: "json",
		success: function(data) {
			hideForm('timer', 'timer-inner');
			if (data.ChangeColorDropDown == 1) {
				document.getElementById('up_color').innerHTML = data.html;
				document.getElementById('up_color').focus();
			}
			if (data.UpdateBC_C == 1) {
				//alert('Color and Base-Color have been updaed, refreshing page now...');
				location.reload();
			}
		},
		error: function() {
			alert('AjaxAttributeUpdate ERROR');
		}
	});
}

// new multiple product page functions

function checkEventNEW(e, prodid) {
	e.preventDefault();
	if (e.target == '[object HTMLDivElement]') {
		comp_id = 'comp_' + prodid;
		checked_comp = document.getElementById(comp_id).checked;
	} else {
		comp_id = 'comp_' + prodid;
		checked_comp = document.getElementById(comp_id).checked;
		if (checked_comp == false) {
			checked_comp = true;
		} else {
			checked_comp = false;
		}
	}
	compItems(prodid, checked_comp);
}

function removeFromCompList(prodid) {
	lang = document.getElementById('lang_selected').value.toLowerCase();
	sess_id = document.getElementById('stick').value;
	comp_value = 'remove';
	reload = '1';
	dataset = {
		lang: lang,
		prodid: prodid,
		sess_id: sess_id,
		comp_item: comp_value,
		reload: reload
	};
	URL = '/includes/inc/compare_products.php';
	AjaxGeneral(URL, dataset);
}

function removeProd_NEW_mobile(prodid, event) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}

	sess_id = document.getElementById('stick').value;
	adcart_id = 'add_to_cart_' + prodid;
	incart_id = 'in_cart_' + prodid;
	instock_id = 'in_stock_' + prodid;
	removefroncart_id = 'remove_from_cart_' + prodid;

	if (document.getElementById(adcart_id)) {
		document.getElementById(adcart_id).style.display = '';
	}

	//buynow = 'buynow_' + prodid;
	//if (document.getElementById(buynow)) {
		//document.getElementById(buynow).style.display = '';
	//}

	if (document.getElementById(incart_id)) {
		document.getElementById(incart_id).style.display = 'none';
	}

	if (document.getElementById(instock_id)) {
		document.getElementById(instock_id).style.display = '';
	}

	if (document.getElementById('NO')) {
		document.getElementById('NO').checked = true;
	}
	if (document.getElementById('cert-options')) {
		document.getElementById('cert-options').style.display = 'none';
	}
	document.getElementById(removefroncart_id).style.display = 'none';
	language = document.getElementById('lang_selected').value;
	var dataset = {
		prodid: prodid,
		sess_id: sess_id,
		language: language
	};
	showForm('cert-div', 'cert-cont');
	URL_address = '/includes/inc/ajax_receiver.php?job=removeProd';
	AjaxAddProd(URL_address, dataset);
}

function removeProd_NEW(prodid, event) {
	if (event.preventDefault) {
		event.preventDefault();
	}

	cond = 'close';
	ShowJewelTXT(cond);
	// show jewelry button
	je_id = 'choose_jewelry_' + prodid;
	if (document.getElementById(je_id)) {
		document.getElementById(je_id).style.display = '';
	}
	sess_id = document.getElementById('stick').value;
	adcart_id = 'add_to_cart_' + prodid;
	incart_id = 'in_cart_' + prodid;
	instock_id = 'in_stock_' + prodid;
	removefroncart_id = 'remove_from_cart_' + prodid;

	if (document.getElementById('buynow_' + prodid)) {
		document.getElementById('buynow_' + prodid).style.display = '';
	}

	if (document.getElementById(adcart_id)) {
		document.getElementById(adcart_id).style.display = '';
	}

	if (document.getElementById(incart_id)) {
		document.getElementById(incart_id).style.display = 'none';
	}

	if (document.getElementById(instock_id)) {
		document.getElementById(instock_id).style.display = '';
	}

	x = document.getElementsByName('RadioGroup1');
	for (var i = 0; i < x.length; i++) {
		x[i].checked = false;
	}
	if (document.getElementById('NO')) {
		document.getElementById('NO').checked = true;
	}
	if (document.getElementById('cert-options')) {
		document.getElementById('cert-options').style.display = 'none';
	}
	document.getElementById(removefroncart_id).style.display = 'none';
	language = document.getElementById('lang_selected').value;
	var dataset = {
		prodid: prodid,
		sess_id: sess_id,
		language: language
	};
	showForm('timer', 'timer-inner');
	URL_address = '/includes/inc/ajax_receiver.php?job=removeProd';
	AjaxAddProd(URL_address, dataset);

	RestoreCertsItemDetail();
}


function addProd_NEW_mobile(prodid, event) {
	JSmessageCHK('Item added to shopping cart');
	setTimeout(function() {
		$("#chk-div").fadeOut("slow");
		$("#chk-cont").fadeOut("slow");
	}, 2000);
	is_b = 0;
	if (document.getElementById('is_b')) {is_b = document.getElementById('is_b').value;}
	if (is_b == 1) {return;}

	if (event.preventDefault) {
		event.preventDefault();
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}

	// hide jewelry button
	je_id = 'choose_jewelry_' + prodid;
	if (document.getElementById(je_id)) {
		document.getElementById(je_id).style.display = 'none';
	}

	// get addons like cerificates from the hidden field on the page
	addons = '';
	if (document.getElementById('addon_selected')) {
		addons = document.getElementById('addon_selected').value;
	}
	if (prodid == 0) {
		prodid = 0;
		sess_id = document.getElementById('stick').value;
		price = '';

	} else {
		// check if customer is new
		checkExist();
		if (document.getElementById('mobile_site')) {
			flyToCartMobile(prodid);
		} else {
			//flyToCart(prodid);
		}
		price_id = 'prod_price_' + prodid;
		price = document.getElementById(price_id).value;
		sess_id = document.getElementById('stick').value;
		adcart_id = 'add_to_cart_' + prodid;
		incart_id = 'in_cart_' + prodid;
		instock_id = 'in_stock_' + prodid;
		removefroncart_id = 'remove_from_cart_' + prodid;

		if (document.getElementById(adcart_id)) {
			document.getElementById(adcart_id).style.display = 'none';
		}

		if (document.getElementById(incart_id)) {
			document.getElementById(incart_id).style.display = '';
		}
		/*
		if (document.getElementById('cont_sp')) {
			document.getElementById('cont_sp').style.display = 'inline-block';
			document.getElementById('sh_wrap').style.display = 'none';
		}
		*/

		if (document.getElementById(instock_id)) {
			document.getElementById(instock_id).style.display = 'none';
		}
		if (document.getElementById(removefroncart_id)) {
			document.getElementById(removefroncart_id).style.display = '';
		}
	}
	if (document.getElementById('page_currency')) {
		currency = document.getElementById('page_currency').value;
	}
	type = 'mobile_category';
	var dataset = {
		type: type,
		prodid: prodid,
		sess_id: sess_id,
		price: price,
		addons: addons,
		pieces: pieces
	};
	//var dataset2 = {sess_id: sess_id, prodid: prodid, currency: currency};

	URL_address = '/includes/inc/ajax_receiver.php?job=addProd';
	AjaxAddProd(URL_address, dataset);

	// change cart icon to green one
	if (document.getElementById("cart-tr")) {
		//document.getElementById("cart-tr").classList.remove('car');
		//document.getElementById("cart-tr").classList.add('car_2');
	}
	//JSmessageByPCS('Item has been added to your shopping cart');
}

// for mobile jquery transfer + shake effect for flying cart
function flyToCartMobile(prodid) {
	//cart_button = '#add_to_cart_' + prodid;
	check_element = document.getElementById('fly5');
	if (check_element !== null) {
		$(document).ready(function() {
			$('#add_to_cart_' + prodid).effect('transfer', {
				to: $('#fly5'),
				className: 'fly1'
			}, 800);
			$('#cart_place').delay(700).effect('shake', {
				direction: 'down',
				times: 1,
				distance: 4
			}, 800);
		});
	}
}

function addProd_NEW(prodid, event) {
	is_b = 0;
	if (document.getElementById('is_b')) {is_b = document.getElementById('is_b').value;}
	if (is_b == 1) {return;}

	event_off = 0;
	if (document.getElementById('event_off')) {
		event_off = document.getElementById('event_off').value;
	}
	if (event_off == 0) {
		if (event.preventDefault) {
			event.preventDefault();
		}
	}

	if (prodid != undefined && prodid != 0) {
		var isbot = false;
		var phpSessionId = /SESS\w*ID=([^;]+)/i.test(document.cookie) ? RegExp.$1 : false;

		// This code doesn't run if the user has a session generated for him, so we minimize hits to checkIsBot function
		if (phpSessionId == false) {
			$.ajax({
				async: true,
				url: "/includes/inc/ajax_receiver.php?job=checkIsBot",
				cache: false,
				success: function(data) {
					var jobj = JSON.parse(data);
					if (jobj.isbot == true) {
						isbot = true;
					}
				},
				complete: function(e) {
					i_e = e;
					if (isbot == true) {
						showBotDialog();
					}
				}
			});
		}
	}

	if (prodid > 1) {
		QTYdetails(prodid);
	}
	// hide jewelry button
	je_id = 'choose_jewelry_' + prodid;
	if (document.getElementById(je_id)) {
		document.getElementById(je_id).style.display = 'none';
	}

	// get addons like cerificates from the hidden field on the page
	addons = '';
	if (document.getElementById('addon_selected')) {
		addons = document.getElementById('addon_selected').value;
	}
	if (prodid == 0) {
		prodid = 0;
		sess_id = document.getElementById('stick').value;
		price = '';

	} else {
		// check if customer is new
		checkExist();
		if (document.getElementById('mobile_site')) {
			flyToCartMobile(prodid);
		} else {
			//flyToCart(prodid);
		}
		price_id = 'prod_price_' + prodid;
		price = document.getElementById(price_id).value;
		sess_id = document.getElementById('stick').value;
		adcart_id = 'add_to_cart_' + prodid;
		incart_id = 'in_cart_' + prodid;
		instock_id = 'in_stock_' + prodid;
		removefroncart_id = 'remove_from_cart_' + prodid;

		flyToCheckout(prodid);
		/*
		if (document.getElementById('cont_sp')) {
			document.getElementById('cont_sp').style.display = 'inline-block';
		}
		*/

		if (document.getElementById(adcart_id)) {
			document.getElementById(adcart_id).style.display = 'none';
		}

		if (document.getElementById(incart_id)) {
			document.getElementById(incart_id).style.display = '';
		}

		if (document.getElementById(instock_id)) {
			document.getElementById(instock_id).style.display = 'none';
		}
		if (document.getElementById(removefroncart_id)) {
			document.getElementById(removefroncart_id).style.display = '';
		}
	}
	if (document.getElementById('page_currency')) {
		currency = document.getElementById('page_currency').value;
	}

	// get piece count from drop-down
	pcs = 'qty_' + prodid;
	if (document.getElementById(pcs)) {
		pieces = document.getElementById(pcs).value;
	} else {
		pieces = 0;
	}
	var dataset = {
		prodid: prodid,
		sess_id: sess_id,
		price: price,
		addons: addons,
		pieces: pieces,
		type: 'detail_page'
	};
	//var dataset2 = {sess_id: sess_id, prodid: prodid, currency: currency};

	URL_address = '/includes/inc/ajax_receiver.php?job=addProd';
	AjaxAddProd(URL_address, dataset);

	// change cart icon to green one
	if (document.getElementById("cart-tr")) {
		document.getElementById("cart-tr").classList.remove('car');
		document.getElementById("cart-tr").classList.add('car_2');
	}
}

function GreenBorder(prodid, status, event) {
	if (window.event) {
		window.event.cancelBubble = true;
	} else {
		event.preventDefault();
	}
	el_id = 'prod_over_' + prodid;
	el_id2 = 'prod_det_txt_' + prodid;
	if (status == 'hide') {
		document.getElementById(el_id).style.display = 'none';
		document.getElementById(el_id2).style.display = 'none';
	}
	if (status == 'show') {
		document.getElementById(el_id).style.display = 'block';
		document.getElementById(el_id2).style.display = 'block';
		//document.getElementById('d_wrap').style.textDecoration = 'none';
	}
}


function open_Certs() {
	document.getElementById('tb_block').style.display = 'block';
	document.getElementById('timer').style.display = 'block';
}

function AddCert_new(prodid, certkey) {
	// check if item is in cart at first
	// add_to_cart_399869
	id = 'add_to_cart_' + prodid;
	val = document.getElementById(id).style.display;
	if (val == 'none') {
		hideForm('cert-div', 'cert-cont');
		selectCert_new(prodid, certkey);
	} else {
		hideForm('cert-div', 'cert-cont');
		addProd_NEW(prodid, event);
		selectCert_new(prodid, certkey);
	}

	RestoreCertsItemDetail();

	div_add = 'addcert_' + certkey;
	div_rem = 'removecert_' + certkey;
	document.getElementById(div_add).style.display = 'none';
	document.getElementById(div_rem).style.display = '';

	div_turn = 'cert_turn_' + certkey;
	document.getElementById(div_turn).style.display = '';
}

function selectCert_new(prodid, certkey) {
	document.getElementById('addon_selected').value = certkey;
	sess_id = document.getElementById('stick').value;
	dataset = {
		sess_id: sess_id,
		certkey: certkey,
		prodid: prodid
	};
	URL = '/includes/inc/ajax_receiver.php?job=selectCert';
	AjaxGeneral(URL, dataset);
}

function RemoveCert_new(prodid) {
	page = document.getElementById('uri_path').value;
	sess_id = document.getElementById('stick').value;
	hideForm('cert-div', 'cert-cont');
	showForm('timer', 'timer-inner');
	dataset = {
		sess_id: sess_id,
		prodid: prodid,
		page: page
	};
	URL = '/includes/inc/ajax_receiver.php?job=RemoveCert_new';
	Ajax_ItemDetailPage(URL, dataset);
}

/* convert Javascript alerts in all languages */
function JSmessageByPCS(msg) {
	msg2 = 'Items will expire from your cart in 3 hours!';
	msg2 = ReadLangObject(msg2);
	msg2 = '<div id="bot_msg">' + msg2 + '</div>';
	msg = ReadLangObject(msg);
	showFormPOP('jppcs-div', 'jppcs-cont');
	msg = '<div id="top_msg">' + msg + '</div>';
	//document.getElementById('jppcs-inner').innerHTML = msg + msg2;
	document.getElementById('jppcs-inner').innerHTML = msg;
}

function hideForm_AccSignUp(bgdiv, contdiv) {
	//if (dId('video-hide') !== null) {
	//	MM_changeProp('video-hide', '', 'visibility', 'visible', 'IMG');
	//}
	if (document.getElementById(bgdiv)) {
		oDiv = document.getElementById(bgdiv);
		oDiv.style.display = 'none';
	}
	if (document.getElementById(contdiv)) {
		oDiv = document.getElementById(contdiv);
		oDiv.style.display = 'none';
	}
	userLogin();
	//url = 'https://www.gemselect.com/';
	//window.open(url, '_self');
	//return false;
}
/*
function hideForm_PCS(bgdiv, contdiv) {
	//if (dId('video-hide') !== null) {
	//	MM_changeProp('video-hide', '', 'visibility', 'visible', 'IMG');
	//}
	if (document.getElementById(bgdiv)) {
		oDiv = document.getElementById(bgdiv);
		oDiv.style.display = 'none';
	}
	if (document.getElementById(contdiv)) {
		oDiv = document.getElementById(contdiv);
		oDiv.style.display = 'none';
	}
	showForm('timer', 'timer-inner');
	location.reload();
	return false;
}
*/

function hideForm_PCS(bgdiv, contdiv) {
	if (document.getElementById(bgdiv)) {
		oDiv = document.getElementById(bgdiv);
		oDiv.style.display = 'none';
	}
	if (document.getElementById(contdiv)) {
		oDiv = document.getElementById(contdiv);
		oDiv.style.display = 'none';
	}
	showForm('timer', 'timer-inner');
	location.reload();
	return false;
}

function Ajax_ItemDetailPage(URL, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL,
		data: dataset,
		dataType: "json",
		success: function(data) {
			if (data.RemoveCert_new == 1) {
				hideForm('timer', 'timer-inner');
				url = '/' + data.page;
				RecURL(url,'Ajax_ItemDetailPage');
				window.open(url, '_self');
			}
			if (data.addProd_BYpcs == 1) {
				hideForm('timer', 'timer-inner');
				JSmessageByPCS('Item added to shopping cart');
				setTimeout(function() {
					$("#jppcs-div").fadeOut("slow");
					$("#jppcs-cont").fadeOut("slow");
				}, 2000);
				if (document.getElementById("c_txt")) {
					document.getElementById("c_txt").style.backgroundColor = 'green';
					document.getElementById('c_txt').style.color = 'white';
					$("#cart-tr").removeClass("car").addClass("car_2");
				}
				if (document.getElementById('cart-count')) {
					document.getElementById('cart-count').innerHTML = data.cart_count;
				}
				if (document.getElementById('cimgm')) {
					$("#cimgm").removeClass("m_ca_img").addClass("m_ca_img_in");
				}
				if (document.getElementById('cart_td')) {
					document.getElementById('cart_td').style.color = '#99FF00';
				}
			}
			if (data.BuyNow_BYpcs == 1) {
				BuyNow1(data.prodid);
				//location.reload();
			}
			if (data.addProd_BYpcs == 2) {
				hideForm('timer', 'timer-inner');
				JSmessage('Selected Items exceed available, we will refresh the page so you can select new');
			}
		},
		error: function() {
			// new Iphone seem not to work with Ajax on the receiving part
			// we just send the form anyway if we get this Error
			setTimeout(function() {
				hideForm('timer', 'timer-inner');
			}, 60000);
			// submit form "form1"
			if (document.getElementById("form1")) {
				document.getElementById("form1").submit();
			}
		}
	});
}

function BuyNow_ByPiece_m(prodid, event) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}
	dis_multiplier = 0;
	type = 'BuyNow';
	if (document.getElementById('dis_multiplier')) {
		dis_multiplier = document.getElementById('dis_multiplier').value;
	}
	sess_id = document.getElementById('stick').value;
	el_id1 = 'new_pcs_' + prodid;
	new_pcs = document.getElementById(el_id1).value;
	el_id2 = 'new_pcs_price_' + prodid;
	new_pcs_price = document.getElementById(el_id2).value;
	new_pcs_price_dis = (new_pcs_price * dis_multiplier).toFixed(2);
	showForm('timer', 'timer-inner');
	dataset = {
		type: type,
		sess_id: sess_id,
		prodid: prodid,
		new_pcs: new_pcs,
		new_pcs_price: new_pcs_price,
		new_pcs_price_dis: new_pcs_price_dis
	};
	URL = '/includes/inc/ajax_receiver.php?job=addProd_BYpcs';
	Ajax_ItemDetailPage(URL, dataset);
}

function BuyNow_ByPiece(prodid, event) {
	i_e = event;
	dis_multiplier = 0;
	type = 'BuyNow';
	if (document.getElementById('dis_multiplier')) {
		dis_multiplier = document.getElementById('dis_multiplier').value;
	}
	sess_id = document.getElementById('stick').value;
	new_pcs = document.getElementById('new_pcs').value;
	new_pcs_price = document.getElementById('new_pcs_price').value;
	new_pcs_price_dis = (new_pcs_price * dis_multiplier).toFixed(2);
	showForm('timer', 'timer-inner');
	dataset = {
		type: type,
		sess_id: sess_id,
		prodid: prodid,
		new_pcs: new_pcs,
		new_pcs_price: new_pcs_price,
		new_pcs_price_dis: new_pcs_price_dis
	};
	URL = '/includes/inc/ajax_receiver.php?job=addProd_BYpcs';
	Ajax_ItemDetailPage(URL, dataset);
}

function RestoreCertsItemDetail() {
	// restore cert popup
	c = document.getElementsByClassName('rem_clear');
	for (z = 0; z < c.length; z++) {
		c[z].style.display = 'none';
	}
	a = document.getElementsByClassName('add_clear');
	for (z = 0; z < a.length; z++) {
		a[z].style.display = '';
	}
}

function showForm_NEW(bgdiv, contdiv) {
	if (document.getElementById(bgdiv)) {
		oDiv = document.getElementById(bgdiv);
		//oDiv.style.display='block';
		$("#" + bgdiv).fadeIn(90);
		oDiv.style.zIndex = "5001";
		if (navigator.appName == "Microsoft Internet Explorer" && navigator.userAgent.toLowerCase().indexOf('msie 6') != -1) {
			oDiv.style.position = "absolute";
		}
		oDiv = document.getElementById(contdiv);
		oDiv.style.display = 'block';
		//$("#" + contdiv).fadeIn(280);
	}
	return false;
}

function hideForm_NEW(event, bgdiv, contdiv) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}

	if (document.getElementById(bgdiv)) {
		oDiv = document.getElementById(bgdiv);
		oDiv.style.display = 'none';
	}
	if (document.getElementById(contdiv)) {
		oDiv = document.getElementById(contdiv);
		oDiv.style.display = 'none';
	}
	return false;
}

function getPDF_new(prodid, status) {
	hideForm('cert-div', 'cert-cont');
	showForm('timer', 'timer-inner');
	url = '/includes/inc/make_pdf.php?prodid=' + prodid + '&status=' + status;
	if (status == 'online' || status == 'sold') {
		RecURL(url,'getPDF_new');
		window.open(url, "_self");
		setTimeout(function() {
			hideForm('timer', 'timer-inner');
		}, 1200);
	} else {
		hideForm('timer', 'timer-inner');
		//url = '/includes/inc/make_pdf.php?prodid=' + prodid + '&status=' + status;
		//RecURL(url,'getPDF_new');
		//window.open(url, "_blank");
	}
}

function hideForm_2(event, bgdiv, contdiv) {
	// hide all sub-divs
	// subs
	if (document.getElementsByClassName('subs')) {
		sd = document.getElementsByClassName('subs');
		for (z = 0; z < sd.length; z++) {
			sd[z].style.display = 'none';
		}
	}

	if (event.preventDefault) {
		event.preventDefault();
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}

	if (document.getElementById(bgdiv)) {
		oDiv = document.getElementById(bgdiv);
		//oDiv.style.display='none';
		$("#" + bgdiv).fadeOut(190);
	}
	if (document.getElementById(contdiv)) {
		oDiv = document.getElementById(contdiv);
		//oDiv.style.display='none';
		$("#" + contdiv).fadeOut(190);
	}

	if (document.getElementsByClassName('hide_bg')) {
		a = document.getElementsByClassName('hide_bg');
		for (z = 0; z < a.length; z++) {
			a[z].style.display = 'none';
		}
	}
	return false;
}

function showForm_HEAD(curr_li, bgdiv, contdiv, overdiv) {
	// hide all cover-top divs in case one is open
	if (document.getElementsByClassName('cover-top')) {
		a = document.getElementsByClassName('cover-top');
		for (var z = 0; z < a.length; z++) {
			a[z].style.display = 'none';
		}
	}
	// compare set-div
	idiv = document.getElementById('inside_div').value;

	if (idiv == curr_li) {
		// show cover-top div (overdiv)
		if (document.getElementById(overdiv)) {
			document.getElementById(overdiv).style.display = 'inline';
		}
		if (document.getElementById(bgdiv)) {
			oDiv = document.getElementById(contdiv);
			//oDiv.style.display = 'block';
			$("#" + contdiv).fadeIn(10);

			oDiv = document.getElementById(bgdiv);
			//oDiv.style.display='block';
			$("#" + bgdiv).fadeIn(320);

			if (navigator.appName == "Microsoft Internet Explorer" && navigator.userAgent.toLowerCase().indexOf('msie 6') != -1) {
				oDiv.style.position = "absolute";
			}
		}
	}
	return false;
}

function openURL(event, URL) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}
	showForm('timer', 'timer-inner');
	RecURL(URL,'openURL');
	window.open(URL, '_self');
}

function MouseCoords(event, sub_div) {
	// record mouse coordinates at mouseout event
	if (document.getElementById(sub_div)) {
		// show sub-category div (id = sub_div)
		document.getElementById(sub_div).style.display = 'inline';
	}
	// hide all other li menu elements with overlaying div
	document.getElementById('tmp_cover').style.display = 'inline';
	left_x = event.clientX;
	top_y = event.clientY;
	// store values on page
	document.getElementById("xy_bottom").value = left_x + '|' + top_y;
}

function CurrMouse(event) {
	// event is triggered and constantly running when overlaying div is shown (hiding all other li elements)
	// get stored mouse coordinates from last mouseout event
	xy_bottom = document.getElementById("xy_bottom").value;
	//document.getElementById("xy_bott").innerHTML = xy_bottom;
	xy = xy_bottom.split("|");
	x2 = xy[0];
	y2 = xy[1];

	// give the mouse 5 pixels to move before calculating the exit angle
	y_new = (y2 * 1) + 5;
	y_new_up = (y2 * 1) - 5;
	m_x = event.clientX;
	m_y = event.clientY;
	//coords = "X: " + m_x + ", Y: " + m_y;
	//document.getElementById("coords").innerHTML = coords;

	if (m_y > y_new || m_y < y_new_up) {
		// create new "last mouse point" to get an accurate angle
		document.getElementById("xy_bottom").value = m_x + '|' + m_y;
		deltaX = x2 - m_x;
		deltaY = y2 - m_y;
		deg = Math.atan2(deltaY, deltaX) * 180.0 / Math.PI;
		if (deg > -100) {
			document.getElementById('tmp_cover').style.display = 'none';
			h = document.getElementsByClassName('sub-drop');
			for (var z = 0; z < h.length; z++) {
				h[z].style.zIndex = '2000';
				h[z].style.color = '#555555';
				h[z].style.backgroundColor = '';
				h[z].style.border = '1px solid white';
			}
			// sub-drop
			a = document.getElementsByClassName('subs');
			for (z = 0; z < a.length; z++) {
				a[z].style.display = 'none';
			}
		}
	}
}

function showDivSub(sub_div, li_show) {
	li = document.getElementById(li_show);
	li.style.zIndex = '8000';
	li.style.color = '#FF9900';
	li.style.backgroundColor = '#E8E8EA';
	li.style.border = '1px solid #A8A8A8';
	if (document.getElementById(sub_div)) {
		$("#" + sub_div).fadeIn(190);
		//document.getElementById(sub_div).style.display = 'inline-block';
	}
}

function HideSubDiv(hide_div) {
	if (document.getElementById(hide_div)) {
		document.getElementById(hide_div).style.display = 'none';
		//$("#" + hide_div).fadeOut(190);
	}
}

function pauseVDO() {
	vid = document.getElementById("vdo");
	vid.pause();
}

function pauseVDO_ID(id) {
	vid = document.getElementById(id);
	vid.pause();
}

function MoreShapes() {
	lang = document.getElementById('lang_selected').value;
	dataset = {lang: lang};
	URL = '/includes/inc/ajax_responder.php?job=MoreShapes';
	AjaxGeneral(URL, dataset);
}

function showForm_HEAD_new(curr_li, bgdiv, contdiv, overdiv) {
	if (curr_li == 'acc_1' || curr_li == 'acc' || curr_li == 'fla' || curr_li == 'cur') {
		SetBGborder_1(1, curr_li);
	} else {
		SetBGborder(1, curr_li);
	}
	document.getElementById('inside_div').value = curr_li;
	setTimeout(function() {
		x = document.getElementById('inside_div').value;
		if (x != '') {
			showForm_HEAD(curr_li, bgdiv, contdiv, overdiv);
		}
	}, 150);
}

function SetBGborder_1(stat, e_id) {
	if (stat == 1) {
		document.getElementById(e_id).style.backgroundColor = "#E8E8EA";
		document.getElementById(e_id).style.border = "1px solid #A8A8A8";
		document.getElementById(e_id).style.borderRadius = "5px";
		document.getElementById(e_id).style.color = "black";
	} else {
		document.getElementById(e_id).style.backgroundColor = "";
		document.getElementById(e_id).style.border = "";
		document.getElementById(e_id).style.borderRadius = "";
		document.getElementById(e_id).style.color = "";
	}
}

function SetBGborder(stat, e_id) {
	if (stat == 1) {
		document.getElementById(e_id).style.backgroundColor = "#415267";
		document.getElementById(e_id).style.border = "1px solid #EFEFEF";
		document.getElementById(e_id).style.borderRadius = "5px";
	} else {
		document.getElementById(e_id).style.backgroundColor = "";
		document.getElementById(e_id).style.border = "";
		document.getElementById(e_id).style.borderRadius = "";
		document.getElementById(e_id).style.color = "";
	}
}

function ClearInsideDiv(e_id) {
	document.getElementById('inside_div').value = '';
	SetBGborder(0, e_id);
}

function sc_to(e_id) {
	var elmnt = document.getElementById(e_id);
	elmnt.scrollIntoView({
		block: "start",
		behavior: "smooth"
	});
}

function UpdatePricePCS(prodid) {
	dis_multiplier = 0;
	if (document.getElementById('dis_multiplier')) {
		dis_multiplier = document.getElementById('dis_multiplier').value;
	}
	pcs = document.getElementById('pcs_select').value;
	document.getElementById('new_pcs').value = pcs;
	pcs_total = document.getElementById('pcs_total').value;
	price_pcs = document.getElementById('price_pcs').value;

	// new price
	new_price = (price_pcs * pcs).toFixed(2);
	new_price_disc = (new_price * dis_multiplier).toFixed(2);

	//################################################################################################
	// check if the last digit is a 5
	// if yes, add another 1 to the end of that number so toFixed() will round up
	id = (new_price * dis_multiplier);
	type = typeof id;
	if (type == 'number') {
		// convert to string and get last character
		l_char = id.toString();
		l_char = l_char.replace(".", "");
		l_char = l_char.substr(-1);
		// if last character is a 5 we will add another 1 to the end in order to round up with toFixed(2)
		if (l_char == 5) {
			n1 = (new_price * dis_multiplier) + '1';
			// convert n1 to a number by multiplying by 1
			new_price_disc = (n1 * 1).toFixed(2);
		}
	}
	//################################################################################################

	pr_id = 'prod_' + prodid;
	pr_dis_id = 'prod2_' + prodid;

	// page_currency
	page_currency = document.getElementById('page_currency').value;

	if (page_currency != 'USD') {
		// per currency
		rate_USD = document.getElementById('rate_USD').value;
		rate_selected = document.getElementById('rate_SELECTED').value;
		price_thb = (new_price * rate_USD).toFixed(2);
		new_price_curr = (price_thb / rate_selected).toFixed(2);
		new_price_disc_curr = (new_price_curr * dis_multiplier).toFixed(2);
	} else {
		new_price_curr = new_price;
		new_price_disc_curr = new_price_disc;
	}
	/*
	// re-format to new HTMl output
	// create price array
	p_array = new_price_curr.split(".");
	p1 = p_array[0];
	p2 = p_array[1];
	p1 = numberWithCommas(p1);
	new_price_curr = '<span class="whole_pr">' + p1 + '</span><span class="fraction_pr">' + p2 + '</span>';

	pd_array = new_price_disc_curr.split(".");
	pd1 = pd_array[0];
	pd2 = pd_array[1];
	pd1 = numberWithCommas(pd1);
	new_price_disc_curr = '<span class="whole_pr">' + pd1 + '</span><span class="fraction_pr">' + pd2 + '</span>';
	*/

	if (document.getElementById(pr_id)) {
		document.getElementById(pr_id).innerHTML = new_price_curr;
	}
	if (document.getElementById(pr_dis_id)) {
		document.getElementById(pr_dis_id).innerHTML = new_price_disc_curr;
	}

	if (document.getElementById('new_pcs_price')) {
		document.getElementById('new_pcs_price').value = new_price;
	}
	if (document.getElementById('new_pcs_price_dis')) {
		document.getElementById('new_pcs_price_dis').value = new_price_disc;
	}
	new_pcs_count = pcs_total - pcs;
	if (document.getElementById('pcs_displ')) {
		document.getElementById('pcs_displ').innerHTML = new_pcs_count;
	}
}

function addProd_BYpcs(prodid) {
	flyToCheckout(prodid);
	is_b = 0;
	if (document.getElementById('is_b')) {is_b = document.getElementById('is_b').value;}
	if (is_b == 1) {return;}

	dis_multiplier = 0;
	if (document.getElementById('dis_multiplier')) {
		dis_multiplier = document.getElementById('dis_multiplier').value;
	}
	sess_id = document.getElementById('stick').value;
	new_pcs = document.getElementById('new_pcs').value;
	new_pcs_price = document.getElementById('new_pcs_price').value;
	new_pcs_price_dis = (new_pcs_price * dis_multiplier).toFixed(2);
	showForm('timer', 'timer-inner');
	dataset = {
		sess_id: sess_id,
		prodid: prodid,
		new_pcs: new_pcs,
		new_pcs_price: new_pcs_price,
		new_pcs_price_dis: new_pcs_price_dis
	};
	URL = '/includes/inc/ajax_receiver.php?job=addProd_BYpcs';
	Ajax_ItemDetailPage(URL, dataset);
}


function SelectPCS_Multi(event) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}
}

function GetPCSmulti(prodid) {
	el_id = 'multi_pcs_' + prodid;
	pieces = document.getElementById(el_id).value;
	UpdatePricePCS_multi(prodid);
}

function UpdatePricePCS_multi(prodid) {
	dis_multiplier = 1;
	if (document.getElementById('dis_multiplier')) {
		dis_multiplier = document.getElementById('dis_multiplier').value;
	}
	pcs_id = 'multi_pcs_' + prodid;
	pcs = document.getElementById(pcs_id).value;
	new_pcs_id = 'new_pcs_' + prodid;
	document.getElementById(new_pcs_id).value = pcs;
	pcs_tot_id = 'pcs_total_' + prodid;
	pcs_total = document.getElementById(pcs_tot_id).value;

	// set value on screen
	p_id = 'pieces_' + prodid;
	if (document.getElementById(p_id)) {
		document.getElementById(p_id).innerHTML = pcs_total - pcs + ' pcs';
	}

	price_pcs_id = 'price_pcs_' + prodid;
	price_pcs = document.getElementById(price_pcs_id).value;

	// new price
	new_price = (price_pcs * pcs).toFixed(2);
	new_price_disc = (new_price * dis_multiplier).toFixed(2);

	//################################################################################################
	// check if the last digit is a 5
	// if yes, add another 1 to the end of that number so toFixed() will round up
	id = (new_price * dis_multiplier);
	type = typeof id;
	if (type == 'number') {
		// convert to string and get last character
		l_char = id.toString();
		l_char = l_char.replace(".", "");
		l_char = l_char.substr(-1);
		// if last character is a 5 we will add another 1 to the end in order to round up with toFixed(2)
		if (l_char == 5) {
			n1 = (new_price * dis_multiplier) + '1';
			// convert n1 to a number by multiplying by 1
			new_price_disc = (n1 * 1).toFixed(2);
		}
	}
	//################################################################################################

	// per currency
	rate_USD = document.getElementById('rate_USD').value;
	rate_selected = document.getElementById('rate_SELECTED').value;
	price_thb = (new_price * rate_USD).toFixed(2);
	new_price_curr = (price_thb / rate_selected).toFixed(2);
	new_price_disc_curr = (new_price_curr * dis_multiplier).toFixed(2);

	/*
	// re-format to new HTMl output
	// create price array
	p_array = new_price_curr.split(".");
	p1 = p_array[0];
	p2 = p_array[1];
	p1 = numberWithCommas(p1);
	new_price_curr = '<span class="whole_pr">' + p1 + '</span><span class="fraction_pr">' + p2 + '</span>';

	pd_array = new_price_disc_curr.split(".");
	pd1 = pd_array[0];
	pd2 = pd_array[1];
	pd1 = numberWithCommas(pd1);
	new_price_disc_curr = '<span class="whole_pr">' + pd1 + '</span><span class="fraction_pr">' + pd2 + '</span>';
	*/

	pr_id = 'prod_' + prodid;
	pr_dis_id = 'prod2_' + prodid;

	if (document.getElementById(pr_id)) {
		document.getElementById(pr_id).innerHTML = new_price_curr;
	}
	if (document.getElementById(pr_dis_id)) {
		document.getElementById(pr_dis_id).innerHTML = new_price_disc_curr;
	}

	new_p_price_id = 'new_pcs_price_' + prodid;
	disc_id = 'new_pcs_price_dis_' + prodid;
	document.getElementById(new_p_price_id).value = new_price;
	document.getElementById(disc_id).value = new_price_disc;

	if (document.getElementById('mobile')) {
		mob = document.getElementById('mobile').value;
		if (mob == 1) {
			if (document.getElementById('add_to_cart_' + prodid)) {
				document.getElementById('add_to_cart_' + prodid).className = "i_cart_mob_g";
			}
		}
	}

	//new_pcs_count = pcs_total - pcs;
	//document.getElementById('pcs_displ').innerHTML = new_pcs_count;
}


function add_Prod(prodid, event) {
	if (document.getElementById('sbp_' + prodid).value == 1) {
		addProd_BYpcs_multi(prodid, event);
	} else {
		addProd_NEW_v2(prodid, event);
	}
}

function add_Prod_Mo(prodid, event) {
	if (document.getElementById('sbp_' + prodid).value == 1) {
		addProd_BYpcs_multi(prodid, event);
	} else {
		addProd_NEW_mobile(prodid, event);
	}
}

function rem_Prod(prodid, event) {
	if (document.getElementById('sbp_' + prodid).value == 1) {
		removeProd_NEW(prodid, event);
	} else {
		removeProd_NEW_v2(prodid, event);
	}
}

function rem_Prod_Mo(prodid, event) {
	if (document.getElementById('sbp_' + prodid).value == 1) {
		removeProd_NEW_mobile(prodid, event);
	} else {
		removeProd_NEW_mobile(prodid, event);
	}
}

function Buy_Now(prodid, event) {
	if (document.getElementById('sbp_' + prodid).value == 1) {
		BuyNow_ByPiece_m(prodid, event);
	} else {
		BuyNow2(prodid, event);
	}
}

function addProd_BYpcs_multi(prodid, event) {
	flyToCheckout(prodid);
	is_b = 0;
	if (document.getElementById('is_b')) {is_b = document.getElementById('is_b').value;}
	if (is_b == 1) {return;}

	if (event.preventDefault) {
		event.preventDefault();
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}

	multi = 1;
	dis_multiplier = 0;
	if (document.getElementById('dis_multiplier')) {
		dis_multiplier = document.getElementById('dis_multiplier').value;
	}
	sess_id = document.getElementById('stick').value;
	new_pc_id = 'new_pcs_' + prodid;
	new_pcs = document.getElementById(new_pc_id).value;

	new_pr_id = 'new_pcs_price_' + prodid;
	new_pcs_price = document.getElementById(new_pr_id).value;
	new_pcs_price_dis = (new_pcs_price * dis_multiplier).toFixed(2);

	showForm('timer', 'timer-inner');
	dataset = {
		multi: multi,
		sess_id: sess_id,
		prodid: prodid,
		new_pcs: new_pcs,
		new_pcs_price: new_pcs_price,
		new_pcs_price_dis: new_pcs_price_dis
	};
	URL = '/includes/inc/ajax_receiver.php?job=addProd_BYpcs';
	Ajax_MultiPage(URL, dataset);
}

function Ajax_MultiPage(URL, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL,
		data: dataset,
		dataType: "json",
		success: function(data) {
			if (data.RemoveCert_new == 1) {
				hideForm('timer', 'timer-inner');
				url = '/' + data.page;
				RecURL(url,'Ajax_MultiPage');
				window.open(url, '_self');
			}
			if (data.addProd_BYpcs_multi == 1) {
				hideForm('timer', 'timer-inner');
				if (data.pcs == 1) {
					JSmessageByPCS('Item added to shopping cart');
					setTimeout(function() {
						$("#jppcs-div").fadeOut("slow");
						$("#jppcs-cont").fadeOut("slow");
						hideForm_PCS('jppcs-div','jppcs-cont');
					}, 1800);
					if (document.getElementById("cart-count")) {
						//document.getElementById("c_txt").style.backgroundColor = 'green';
						//document.getElementById('c_txt').style.color = 'white';
						//$("#cart-tr").removeClass("car").addClass("car_2");
						document.getElementById('cart-count').innerHTML = data.cart_count;
					}
				} else {
					JSmessageCHK('Item added to shopping cart');
					setTimeout(function() {
						location.reload();
						//$("#jchk-div").fadeOut("slow");
						//$("#chk-cont").fadeOut("slow");
					}, 1800);
					//JSmessageCHK('Item added to shopping cart<br> Free Shipping on orders over $300');
					/*
					if (document.getElementById('jppcs-div')) {
						setTimeout(function() {
							$( "#jppcs-div" ).fadeOut( "slow" );
							$( "#jppcs-cont" ).fadeOut( "slow" );
							hideForm_PCS('jppcs-div','jppcs-cont');
						}, 2800);
					}
					*/
				}
				//location.reload();
			}
			if (data.addProd_BYpcs_multi == 2) {
				hideForm('timer', 'timer-inner');
				JSmessage('Selected Items exceed available, we will refresh the page so you can select new');
			}
			if (data.NewPhotos == 1) {
				hideForm('timer', 'timer-inner');
				document.getElementById('new_photos_' + data.prodid).style.display = 'none';
				//JSmessage('Item added to GemQA, It may take a few minutes to appear in that application');
			}
			if (data.AddToShowCase == 1) {
				hideForm('timer', 'timer-inner');
				//JSmessage('Item has been added to Showcase');
				// hide show_case button
				sh_id = 'show_case_' + data.prodid;
				document.getElementById(sh_id).style.display = 'none';
			}
			if (data.AddPinterest == 1) {
				hideForm('timer', 'timer-inner');
				document.getElementById('board_name').selectedIndex = 0;
				hideForm('pin-div', 'pin-cont');
				sh_id = 'pin_' + data.prodid;
				document.getElementById(sh_id).style.display = 'none';
			}
			if (data.AddPinterest == 2) {
				hideForm('timer', 'timer-inner');
				document.getElementById('board_name').selectedIndex = 0;
				hideForm('pin-div', 'pin-cont');
				alert('Image too small, Cannot us for Pinterest');
				sh_id = 'pin_' + data.prodid;
				document.getElementById(sh_id).style.display = 'none';
			}
			if (data.AddPinterest == 3) {
				hideForm('timer', 'timer-inner');
				document.getElementById('board_name').selectedIndex = 0;
				hideForm('pin-div', 'pin-cont');
				alert('The url should not contain "group". Use a proper category page to select item');
				sh_id = 'pin_' + data.prodid;
				document.getElementById(sh_id).style.display = 'none';
			}
		},
		error: function() {
			// new Iphone seem not to work with Ajax on the receiving part
			// we just send the form anyway if we get this Error
			setTimeout(function() {
				hideForm('timer', 'timer-inner');
			}, 60000);
			// submit form "form1"
			if (document.getElementById("form1")) {
				document.getElementById("form1").submit();
			}
		}
	});
}

function OpenIndex(e_id) {
	if (document.getElementById(e_id)) {
		url = document.getElementById(e_id).value;
		RecURL(url,'OpenIndex');
		window.open(url, '_self');
	}
}

function RemoveExpired(prodid) {
	sess_id = document.getElementById('stick').value;
	dataset = {
		prodid: prodid,
		sess_id: sess_id
	};
	URL_address = '/includes/inc/ajax_receiver.php?job=RemoveExpired';
	AjaxAddProd(URL_address, dataset);
}

function AddToShowCase(prodid, event) {
	event_off = 0;
	if (document.getElementById('event_off')) {
		event_off = document.getElementById('event_off').value;
	}
	if (event_off == 0) {
		if (event.preventDefault) {
			event.preventDefault();
		}
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}
	showForm('timer', 'timer-inner');
	dataset = {
		prodid: prodid
	};
	URL = '/includes/inc/ajax_receiver.php?job=AddToShowCase';
	Ajax_MultiPage(URL, dataset);
}

function AddPinterest_init(prodid, event) {
	event_off = 0;
	if (document.getElementById('event_off')) {
		event_off = document.getElementById('event_off').value;
	}
	if (event_off == 0) {
		if (event.preventDefault) {
			event.preventDefault();
		}
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}
	// open popup with board_names
	showForm_NEW('pin-div', 'pin-cont');
	document.getElementById('board_prod').value = prodid;
}

function GetB_Name() {
	prodid = document.getElementById('board_prod').value;
	board_id = document.getElementById('board_name').value;
	if (board_id == 0) {
		alert('Please select a boardf name');
		document.getElementById('board_name').focus();
		return;
	}
	AddPinterest(prodid, board_id);
}

function AddPinterest(prodid, board_id) {
	uri_path = document.getElementById('uri_path').value;
	showForm('timer', 'timer-inner');
	dataset = {
		prodid: prodid,
		uri_path: uri_path,
		board_id: board_id
	};
	URL = '/includes/inc/ajax_receiver.php?job=AddPinterest';
	Ajax_MultiPage(URL, dataset);
}

function OpenSimItems(url, event) {
	event_off = 0;
	if (document.getElementById('event_off')) {
		event_off = document.getElementById('event_off').value;
	}
	if (event_off == 0) {
		if (event.preventDefault) {
			event.preventDefault();
		}
	}
	RecURL(url,'OpenSimItems');
	window.open(url, '_self');
}

function addProd_NEW_v2(prodid, event) {
	is_b = 0;
	if (document.getElementById('is_b')) {is_b = document.getElementById('is_b').value;}
	if (is_b == 1) {return;}

	event_off = 0;
	if (document.getElementById('event_off')) {
		event_off = document.getElementById('event_off').value;
	}
	if (event_off == 0) {
		if (event.preventDefault) {
			event.preventDefault();
		}
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}

	if (prodid != undefined && prodid != 0) {
		var isbot = false;
		var phpSessionId = /SESS\w*ID=([^;]+)/i.test(document.cookie) ? RegExp.$1 : false;

		// This code doesn't run if the user has a session generated for him, so we minimize hits to checkIsBot function
		if (phpSessionId == false) {
			$.ajax({
				async: true,
				url: "/includes/inc/ajax_receiver.php?job=checkIsBot",
				cache: false,
				success: function(data) {
					var jobj = JSON.parse(data);
					if (jobj.isbot == true) {
						isbot = true;
					}
				},
				complete: function(e) {
					i_e = e;
					if (isbot == true) {
						showBotDialog();
					}
				}
			});
		}
	}

	if (prodid > 1) {
		QTYdetails(prodid);
	}
	// hide jewelry button
	je_id = 'choose_jewelry_' + prodid;
	if (document.getElementById(je_id)) {
		document.getElementById(je_id).style.display = 'none';
	}

	// get addons like cerificates from the hidden field on the page
	addons = '';
	if (document.getElementById('addon_selected')) {
		addons = document.getElementById('addon_selected').value;
	}
	if (prodid == 0) {
		prodid = 0;
		sess_id = document.getElementById('stick').value;
		price = '';

	} else {
		// check if customer is new
		checkExist();
		if (document.getElementById('mobile_site')) {
			flyToCartMobile(prodid);
		} else {
			//flyToCart(prodid);
		}
		price_id = 'prod_price_' + prodid;
		price = document.getElementById(price_id).value;
		sess_id = document.getElementById('stick').value;
		adcart_id = 'add_to_cart_' + prodid;
		incart_id = 'in_cart_' + prodid;
		instock_id = 'in_stock_' + prodid;
		removefroncart_id = 'remove_from_cart_' + prodid;

		flyToCheckout(prodid);
		/*
		if (document.getElementById('cont_sp')) {
			document.getElementById('cont_sp').style.display = 'inline-block';
		}
		*/

		if (document.getElementById(adcart_id)) {
			document.getElementById(adcart_id).style.display = 'none';
		}

		if (document.getElementById(incart_id)) {
			document.getElementById(incart_id).style.display = '';
		}

		if (document.getElementById(instock_id)) {
			document.getElementById(instock_id).style.display = 'none';
		}
		if (document.getElementById(removefroncart_id)) {
			document.getElementById(removefroncart_id).style.display = '';
		}
	}
	if (document.getElementById('page_currency')) {
		currency = document.getElementById('page_currency').value;
	}
	user_ip = 0;
	if (document.getElementById('user_ip')) {
		user_ip = document.getElementById('user_ip').value;
	}

	// get piece count from drop-down
	pcs = 'qty_' + prodid;
	if (document.getElementById(pcs)) {
		pieces = document.getElementById(pcs).value;
	} else {
		pieces = 0;
	}
	var dataset = {
		prodid: prodid,
		sess_id: sess_id,
		price: price,
		addons: addons,
		pieces: pieces,
		type: 'prod_cat_page',
		user_ip: user_ip
	};

	URL_address = '/includes/inc/ajax_receiver.php?job=addProd';
	AjaxAddProd(URL_address, dataset);

	// change cart icon to green one
	if (document.getElementById("cart-tr")) {
		document.getElementById("cart-tr").classList.remove('car');
		document.getElementById("cart-tr").classList.add('car_2');
	}
	//JSmessage('Selected Items exceed available, we will refresh the page so you can select new');
}

function checkEventNEW_v2(e, prodid) {
	if (e.preventDefault) {
		e.preventDefault();
	}
	if (e.stopPropagation) {
		e.stopPropagation();
	} else if (window.e) {
		window.e.cancelBubble = true;
	}
	if (e.target == '[object HTMLDivElement]') {
		comp_id = 'comp_' + prodid;
		checked_comp = document.getElementById(comp_id).checked;
	} else {
		comp_id = 'comp_' + prodid;
		checked_comp = document.getElementById(comp_id).checked;
		if (checked_comp == false) {
			checked_comp = true;
		} else {
			checked_comp = false;
		}
	}
	compItems(prodid, checked_comp);
}

function removeProd_NEW_v2(prodid, event) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}

	cond = 'close';
	ShowJewelTXT(cond);
	// show jewelry button
	je_id = 'choose_jewelry_' + prodid;
	if (document.getElementById(je_id)) {
		document.getElementById(je_id).style.display = '';
	}
	sess_id = document.getElementById('stick').value;
	adcart_id = 'add_to_cart_' + prodid;
	incart_id = 'in_cart_' + prodid;
	instock_id = 'in_stock_' + prodid;
	removefroncart_id = 'remove_from_cart_' + prodid;

	if (document.getElementById(adcart_id)) {
		document.getElementById(adcart_id).style.display = '';
	}

	if (document.getElementById(incart_id)) {
		document.getElementById(incart_id).style.display = 'none';
	}

	if (document.getElementById(instock_id)) {
		document.getElementById(instock_id).style.display = '';
	}
	if (document.getElementById('buynow_wrap_' + prodid)) {
		document.getElementById('buynow_wrap_' + prodid).style.display = '';
	}

	x = document.getElementsByName('RadioGroup1');
	for (var i = 0; i < x.length; i++) {
		x[i].checked = false;
	}
	if (document.getElementById('NO')) {
		document.getElementById('NO').checked = true;
	}
	if (document.getElementById('cert-options')) {
		document.getElementById('cert-options').style.display = 'none';
	}
	document.getElementById(removefroncart_id).style.display = 'none';
	language = document.getElementById('lang_selected').value;
	var dataset = {
		prodid: prodid,
		sess_id: sess_id,
		language: language
	};
	showForm('timer', 'timer-inner');
	URL_address = '/includes/inc/ajax_receiver.php?job=removeProd';
	AjaxAddProd(URL_address, dataset);

	RestoreCertsItemDetail();
}

function openIP_URL(event, URL, id) {
	i_id = id;
	showForm('timer', 'timer-inner');
	RecURL(URL,'openIP_URL');
	window.open(URL, '_self');
}

function NewPhotos(prodid, event) {
	event_off = 0;
	if (document.getElementById('event_off')) {
		event_off = document.getElementById('event_off').value;
	}
	if (event_off == 0) {
		if (event.preventDefault) {
			event.preventDefault();
		}
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}
	showForm('timer', 'timer-inner');
	dataset = {
		prodid: prodid
	};
	URL = '/includes/inc/ajax_receiver.php?job=NewPhotos';
	Ajax_MultiPage(URL, dataset);
}

/* TESTING BANNER LOGIC */
function BannerAjax(URL, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL,
		data: dataset,
		dataType: "json",
		success: function(data) {
			if (data.StartBanner == 1) {
				ht = data.html;
				if (ht != '') {
					setTimeout(function() {
						randomFuncs(ht);
						StartBanner2(data.banner_id);
					}, 18000);
				}
			}
		},
		error: function() {
			//alert('ERROR -- BannerAjax');
		}
	});
}

function randomFrom(array) {
	if (document.getElementById('curr_func')) {
		curr_func = document.getElementById('curr_func').value;
	} else {
		curr_func = '';
	}
	i = Math.floor(Math.random() * array.length);
	new_func = array[i];
	if (curr_func == new_func) {
		if (i < (array.length - 1)) {
			new_func = array[i + 1];
		} else {
			new_func = array[i - 1];
		}
	}
	return new_func;
	//return Math.floor(Math.random()*(max-min+1)+min);
}

function randomFuncs(ht) {
	curr_page = '';
	if (document.getElementById('requ_uri')) {
		curr_page = document.getElementById('requ_uri').value;
	}
	if (curr_page != '/cart/cust-address.php') {
		var func = randomFrom(['fn1', 'fn2', 'fn3', 'fn4', 'fn5', 'fn6', 'fn7', 'fn8']);
		document.getElementById('curr_func').value = func;
		if (ht != '') {
			window[func](ht);
		} else {
			//
		}
	}
}

function StartBanner2(banner_id) {
	$('#rotate_2').attr('id', 'rotate');
	$('#rotate_1').attr('id', 'rotate_2');
	$('#rotate').attr('id', 'rotate_1');
	StartBanner(banner_id);
}

function fn1(ht) {
	$("#rotate_1").hide("slide", {
		direction: "left"
	}, 1200);
	$('#rotate_2').html(ht).fadeIn(2400);
}

function fn2(ht) {
	$("#rotate_1").hide("slide", {
		direction: "right"
	}, 1200);
	$('#rotate_2').html(ht).fadeIn(2400);
}

function fn3(ht) {
	$("#rotate_1").hide("slide", {
		direction: "up"
	}, 1200);
	$('#rotate_2').html(ht).fadeIn(2400);
}

function fn4(ht) {
	$('#rotate_1').fadeOut(2800);
	$('#rotate_2').html(ht).fadeIn(2400);
}

function fn5(ht) {
	$('#rotate_1').fadeOut(2800);
	$('#rotate_2').html(ht).fadeIn(2400);
}

function fn6(ht) {
	$("#rotate_1").hide("slide", {
		direction: "down"
	}, 1200);
	$('#rotate_2').html(ht).fadeIn(2400);
}

function fn7(ht) {
	$("#rotate_1").hide("blind", {
		direction: "vertical"
	}, 1200);
	$('#rotate_2').html(ht).fadeIn(2400);
}

function fn8(ht) {
	$("#rotate_1").hide("blind", {
		direction: "horizontal"
	}, 1200);
	$('#rotate_2').html(ht).fadeIn(2400);
}

function StartBanner(banner_id) {
	if (banner_id == '' || typeof banner_id == 'undefined') {
		banner_id = 0;
	}
	if (document.getElementById('lang_selected')) {
		language = document.getElementById('lang_selected').value;
	} else {
		language = 'English';
	}

	domain_name = document.getElementById('domain_name').value;
	if (document.getElementById('page_currency')) {
		currency = document.getElementById('page_currency').value;
	} else {
		currency = 'USD';
	}
	if (document.getElementById('banner')) {
		dataset = {
			language: language,
			domain_name: domain_name,
			currency: currency,
			banner_id: banner_id
		};
		URL = '/includes/inc/banner-inc.php';
		BannerAjax(URL, dataset);
	}
}
/* TESTING BANNER LOGIC */

function ShowSMen(e) {
	if (e.stopPropagation) {
		e.stopPropagation();
	} else {
		if (e.preventDefault) {
			e.preventDefault();
		}
	}
	document.getElementById('banner-div').style.display = 'block';
	$("#all_banners").show("blind", {
		direction: "vertical"
	}, 300);
}

function ShowSMen_2(e) {
	if (e.stopPropagation) {
		e.stopPropagation();
	} else {
		if (e.preventDefault) {
			e.preventDefault();
		}
	}
	showForm('gtype-div', 'gtype-cont');
}

//######################################################################################
// CTA related functions
function CTA(cta_id) {
	showForm('gtype-div', 'gtype-cont');
	sess_id = document.getElementById('stick').value;
	cta_txt = document.getElementById('cta_' + cta_id).innerHTML;
	uri = document.getElementById('uri_path_full').value;
	lang = document.getElementById('lang_selected').value;
	user_ip = document.getElementById('user_ip').value;
	dataset = {
		sess_id: sess_id,
		uri: uri,
		cta_id: cta_id,
		cta_txt: cta_txt,
		lang: lang,
		user_ip: user_ip
	};
	URL = '/includes/inc/ajax_receiver.php?job=CTA';
	CTA_Ajax(URL, dataset);
}

function CTA_Ajax(URL, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL,
		data: dataset,
		dataType: "json",
		success: function(data) {
			if (data.CTA == 1) {
				//
			}
		},
		error: function() {
			//alert('ERROR -- BannerAjax');
		}
	});
}
// CTA related functions
//######################################################################################

function clearDetShapes(c_uri) {
	uri_para = '';
	found = 0;
	new_str = '';
	if (c_uri.indexOf("?") !== -1) {
		uripara = c_uri.split("?");
		uri_para = uripara[1];
	} else {
		return c_uri;
	}
	if (uri_para != '') {
		a = uri_para.split("&");
		for (i = 0; i < a.length; i++) {
			str = a[i];
			if (str.indexOf("shape=") !== -1) {
				str = '';
				found = 1;
			}
			new_str += str + '&';
		}
		new_str = new_str.slice(0, -1);
	}
	if (new_str == '') {
		c_uri = uripara[0];
	} else {
		c_uri = uripara[0] + '?' + new_str;
	}
	return c_uri;
}

function StyleSelect(style, event) {
	i_ev = event;
	el_id = 'q_' + style;
	el_class = document.getElementById(el_id).className;
	if (el_class == 'now_sel' || el_class == 'ch_sel now_sel') {
		UnselectStyle(style);
	} else {
		if (style == 'pairs' || style == 'single' || style == 'lots') {
			Get_Style(style);
		}
		if (style == 'cabochons' || style == 'faceted') {
			Get_Style_2(style);
		}
	}
}

function UnselectStyle(style) {
	if (style == 'faceted') {
		style = 'facet';
	}
	if (style == 'cabochons') {
		style = 'cab';
	}
	c_uri = window.location.search;
	uri_p = document.getElementById('uri_path').value;
	new_uri = removeURLParameter(c_uri, style);
	if (style == 'single' || style == 'lots' || style == 'pairs') {
		new_uri = removeURLParameter(c_uri, 'spl');
	}
	new_uri = '/' + uri_p + new_uri;
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'UnselectStyle');
	window.open(new_uri, '_self');
}

function replaceAll(str, find, replace) {
	return str.replace(new RegExp(find, 'g'), replace);
}

function Get_Style_2(style) {
	c_uri = document.getElementById('uri_path_full').value;
	last_char = c_uri.substr(-1);
	if (last_char == '?') {
		c_uri = c_uri.substring(0, c_uri.length - 1);
	}

	uri_p = document.getElementById('uri_path').value;
	new_str = '';
	uri_para = '';
	if (style == 'cabochons') {
		style = 'cab';
		c_uri = removeURLParameter(c_uri, 'facet');
	}
	if (style == 'faceted') {
		style = 'facet';
		c_uri = removeURLParameter(c_uri, 'cab');
	}

	found = 0;
	if (c_uri.indexOf("?") !== -1) {
		uripara = c_uri.split("?");
		uri_para = uripara[1];
	}
	if (uri_para != '') {
		a = uri_para.split("&");
		for (i = 0; i < a.length; i++) {
			str = a[i];
			if (str.indexOf("cab=") !== -1) {
				str = 'cab=cabochon';
				found = 1;
			}
			if (str.indexOf("facet=") !== -1) {
				str = 'facet=facet';
				found = 1;
			}
			new_str += str + '&';
		}
		new_str = new_str.slice(0, -1);
		if (found == 0) {
			if (style == 'cab') {
				new_str = new_str + '&cab=cabochon';
			}
			if (style == 'facet' || style == 'faceted') {
				new_str = new_str + '&facet=facet';
			}
		} else {
			new_str = new_str;
		}
	}
	if (new_str == '') {
		if (style == 'cab') {
			new_uri = c_uri + '?cab=cabochon';
		}
		if (style == 'facet' || style == 'faceted') {
			new_uri = c_uri + '?facet=facet';
		}
		//new_uri = removeURLParameter(new_uri, 'styles');
	} else {
		new_uri = '/' + uri_p + '?' + new_str;
		//new_uri = removeURLParameter(new_uri, 'styles');
	}
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'Get_Style_2');
	window.open(new_uri, '_self');
}

function Get_Style(style) {
	if (style == 'pairs') {
		style = 'pair';
	}
	if (style == 'lots') {
		style = 'lot';
	}
	c_uri = document.getElementById('uri_path_full').value;
	uri_p = document.getElementById('uri_path').value;
	new_str = '';
	uri_para = '';
	found = 0;
	if (c_uri.indexOf("?") !== -1) {
		uripara = c_uri.split("?");
		uri_para = uripara[1];
	}
	if (uri_para != '') {
		a = uri_para.split("&");
		for (i = 0; i < a.length; i++) {
			str = a[i];
			if (str.indexOf("spl=") !== -1) {
				str = 'spl=' + style;
				found = 1;
			}
			new_str += str + '&';
		}
		new_str = new_str.slice(0, -1);
		if (found == 0) {
			new_str = new_str + '&spl=' + style;
		} else {
			new_str = new_str;
		}
	}
	// check if last char is a ? or &
	last_char = c_uri.slice(-1);
	if (last_char == '?' || last_char == '&') {
		c_uri = c_uri.slice(0, -1);
	}
	if (new_str == '') {
		new_uri = c_uri + '?spl=' + style;
	} else {
		new_uri = '/' + uri_p + '?' + new_str;
	}
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'Get_Style');
	window.open(new_uri, '_self');
}

function Get_Shape_mob(el_id, shape) {
	c_uri = document.getElementById('uri_path_full').value;
	c_uri = clearDetShapes(c_uri);
	uri_p = document.getElementById('uri_path').value;
	new_str = '';
	uri_para = '';
	found = 0;
	if (c_uri.indexOf("?") !== -1) {
		uripara = c_uri.split("?");
		uri_para = uripara[1];
	}
	if (uri_para != '') {
		a = uri_para.split("&");
		for (i = 0; i < a.length; i++) {
			str = a[i];
			if (str.indexOf("base_shape") !== -1) {
				str = 'base_shape=' + shape;
				found = 1;
			}
			new_str += str + '&';
		}
		new_str = new_str.slice(0, -1);
		if (found == 0) {
			new_str = new_str + '&base_shape=' + shape;
		} else {
			new_str = new_str;
		}
	}
	if (new_str == '') {
		new_uri = c_uri + '?base_shape=' + shape;
	} else {
		new_uri = '/' + uri_p + '?' + new_str;
	}
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'Get_Shape_mob');
	window.open(new_uri, '_self');
}

function Get_Shape(el_id, shape) {
	el_class = document.getElementById(el_id).className;
	if (el_class == 'shape_un') {
		c_uri = document.getElementById('uri_path_full').value;
		c_uri = removeURLParameter(c_uri,'base_shape');
		c_uri = removeURLParameter(c_uri,'shape');
		uri_p = document.getElementById('uri_path').value;
		new_str = '';
		uri_para = '';
		found = 0;
		if (c_uri.indexOf("?") !== -1) {
			uripara = c_uri.split("?");
			uri_para = uripara[1];
		}
		if (uri_para != '') {
			a = uri_para.split("&");
			for (i = 0; i < a.length; i++) {
				str = a[i];
				if (str.indexOf("base_shape") !== -1) {
					str = 'base_shape=' + shape;
					found = 1;
				}
				new_str += str + '&';
			}
			new_str = new_str.slice(0, -1);
			if (found == 0) {
				new_str = new_str + '&base_shape=' + shape;
			} else {
				new_str = new_str;
			}
		}
		if (new_str == '') {
			new_uri = c_uri + '?base_shape=' + shape;
		} else {
			new_uri = '/' + uri_p + '?' + new_str;
		}
		showForm('timer', 'timer-inner');
		RecURL(new_uri,'Get_Shape');
		window.open(new_uri, '_self');
	} else {
		Unselect_Shape(el_id, shape);
	}
}

function AddGemType(type_id) {
	c_uri = window.location.search;
	uri_p = document.getElementById('uri_path').value;
	if (c_uri != '') {
		// check if g_type is in str already
		if (c_uri.indexOf("g_type=") !== -1) {
			// add type_id to current g_type in c_uri
			c_uri = UpdateURIstring(c_uri, type_id);
			new_uri = '/' + uri_p + '?' + c_uri;
		} else {
			new_uri = '/' + uri_p + c_uri + '&g_type=' + type_id;
		}
	} else {
		new_uri = '/' + uri_p + '?g_type=' + type_id;
	}
	if (new_uri.indexOf("page=") !== -1) {
		new_uri = removeURLParameter(new_uri, 'page');
	}
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'AddGemType');
	window.open(new_uri, '_self');
}

function AddShape(shape_id) {
	c_uri = window.location.search;
	uri_p = document.getElementById('uri_path').value;
	if (c_uri != '') {
		// check if base_shape is in str already
		if (c_uri.indexOf("base_shape=") !== -1) {
			// add shape_id to current base_shape in c_uri
			c_uri = UpdateURIstring2(c_uri, shape_id);
			if (c_uri.indexOf("?") === -1) {
				new_uri = '/' + uri_p + '?' + c_uri;
			} else {
				new_uri = '/' + uri_p + c_uri;
			}
		} else {
			new_uri = '/' + uri_p + c_uri + '&base_shape=' + shape_id;
		}
	} else {
		new_uri = '/' + uri_p + '?base_shape=' + shape_id;
	}
	if (new_uri.indexOf("page=") !== -1) {
		new_uri = removeURLParameter(new_uri, 'page');
	}
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'AddShape');
	window.open(new_uri, '_self');
}

function UpdateURIstring2(c_uri, shape_id) {
	a = c_uri.split("&");
	new_str = '';
	for (i = 0; i < a.length; i++) {
		str = a[i];
		if (str.indexOf("base_shape=") !== -1) {
			str = 'base_shape=' + shape_id;
			found = 1;
		}
		new_str += str + '&';
	}
	new_str = new_str.slice(0, -1);
	return new_str;
}

function UpdateURIstring(c_uri, type_id) {
	a = c_uri.split("&");
	new_str = '';
	for (i = 0; i < a.length; i++) {
		str = a[i];
		if (str.indexOf("g_type=") !== -1) {
			str = 'g_type=' + type_id;
			found = 1;
		}
		new_str += str + '&';
	}
	new_str = new_str.slice(0, -1);
	return new_str;
}

function Unselect_Shape(el_id, shape) {
	i_id = el_id;
	i_sh = shape;
	c_uri = document.getElementById('uri_path_full').value;
	uri_p = document.getElementById('uri_path').value;
	new_str = '';
	uri_para = '';
	found = 0;
	uripara = '';
	uripara[0] = '';
	if (c_uri.indexOf("?") !== -1) {
		uripara = c_uri.split("?");
		uri_para = uripara[1];
	}
	if (uri_para != '') {
		a = uri_para.split("&");
		for (i = 0; i < a.length; i++) {
			str = a[i];
			if (str.indexOf("base_shape") !== -1) {
				str = '';
			} else {
				new_str += str + '&';
			}
		}
		new_str = new_str.slice(0, -1);
	}
	if (new_str == '') {
		if (uripara[0]) {
			new_uri = uripara[0];
		} else {
			new_uri = '';
		}
	} else {
		new_uri = '/' + uri_p + '?' + new_str;
		if (new_uri == '') {
			new_uri = '/' + uri_p;
		}
	}
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'Unselect_Shape');
	window.open(new_uri, '_self');
}

function Get_Shape_det(shape) {
	c_uri = document.getElementById('uri_path_full').value;
	uri_p = document.getElementById('uri_path').value;
	new_str = '';
	uri_para = '';
	found = 0;
	if (c_uri.indexOf("?") !== -1) {
		uripara = c_uri.split("?");
		uri_para = uripara[1];
	}
	if (uri_para != '') {
		a = uri_para.split("&");
		for (i = 0; i < a.length; i++) {
			str = a[i];
			if (str.indexOf("shape=") !== -1) {
				str = 'shape=' + shape;
				found = 1;
			}
			new_str += str + '&';
		}
		new_str = new_str.slice(0, -1);
		if (found == 0) {
			new_str = new_str + '&shape=' + shape;
		} else {
			new_str = new_str;
		}
	}
	if (new_str == '') {
		new_uri = c_uri + '?shape=' + shape;
	} else {
		new_uri = '/' + uri_p + '?' + new_str;
	}
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'Get_Shape_det');
	window.open(new_uri, '_self');
}

function BackPrev() {
	curr_uri = document.getElementById('uri_path_full').value;
	sess_id = document.getElementById('stick').value;
	user_ip = document.getElementById('user_ip').value;
	lang = document.getElementById('lang_selected').value;
	dataset = {
		lang: lang,
		user_ip: user_ip,
		curr_uri: curr_uri,
		sess_id: sess_id
	};
	URL = '/includes/inc/ajax_receiver.php?job=BackPrev';
	AjaxGeneral(URL, dataset);
	uri_p = document.getElementById('previous_page').value;
	domain_name = document.getElementById('domain_name').value;
	lang_low = lang.toLowerCase();
	url2 = 'http://' + domain_name + '/' + lang_low + '/all-gemstones.php';
	//console.log('uri_p = ' + uri_p);
	if (uri_p == '') {
		uri_p = url2;
	}
	showForm('timer', 'timer-inner');
	RecURL(uri_p,'BackPrev');
	window.open(uri_p, '_self');
}

function CheckAvail(prodid) {
	available = 1;
	sess_id = document.getElementById('stick').value;
	lang = document.getElementById('lang_selected').value;
	dataset = {
		lang: lang,
		prodid: prodid,
		sess_id: sess_id
	};
	URL = '/includes/inc/ajax_receiver.php?job=CheckAvail';
	AjaxGeneral(URL, dataset);
	return available;
}

function BuyNow2(prodid, event) {
	event_off = 0;
	if (document.getElementById('event_off')) {
		event_off = document.getElementById('event_off').value;
	}
	if (event_off == 0) {
		if (event.preventDefault) {
			event.preventDefault();
		}
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}
	BuyNow1(prodid);
}

function BuyNow1(prodid) {
	showForm('timer', 'timer-inner');
	// get addons like cerificates from the hidden field on the page
	addons = '';
	if (document.getElementById('addon_selected')) {
		addons = document.getElementById('addon_selected').value;
	}
	// check if customer is new
	checkExist();

	price_id = 'prod_price_' + prodid;
	if (document.getElementById(price_id)) {
		price = document.getElementById(price_id).value;
	}
	p_id2 = 'new_pcs_price_' + prodid;
	if (document.getElementById(p_id2)) {
		price = document.getElementById(p_id2).value;
	}
	sess_id = document.getElementById('stick').value;

	if (document.getElementById('page_currency')) {
		currency = document.getElementById('page_currency').value;
	}
	// get piece count from drop-down
	pcs = 'qty_' + prodid;
	pcs2 = 'new_pcs' + prodid;
	if (document.getElementById(pcs)) {
		pieces = document.getElementById(pcs).value;
	} else {
		pieces = 0;
	}
	if (document.getElementById(pcs2)) {
		pieces = document.getElementById(pcs2).value;
	}
	type = 'add_buynow';
	if (document.getElementById('but_type')) {
		document.getElementById('but_type').value = 'buy_now';
	}
	lang = document.getElementById('lang_selected').value;
	var dataset = {
		lang: lang,
		type: type,
		prodid: prodid,
		sess_id: sess_id,
		price: price,
		addons: addons,
		pieces: pieces
	};
	URL_address = '/includes/inc/ajax_receiver.php?job=addProd';
	AjaxAddProd(URL_address, dataset);
}

function showProdPop(img) {
	src_tmp = document.getElementById('gg').src;
	src = src_tmp.replace('a.jpg', img + '.jpg');
	document.getElementById('l_image_pop').src = src;
	if (document.getElementById('large-cont')) {
		oDiv = document.getElementById('large-cont');
		//oDiv.style.display='block';
		$('#large-cont').fadeIn(150);
		if (navigator.appName == "Microsoft Internet Explorer" && navigator.userAgent.toLowerCase().indexOf('msie 6') != -1) {
			oDiv.style.position = "absolute";
		}
	}
}

function hide_showProdPop() {
	if (document.getElementById('large-cont')) {
		oDiv = document.getElementById('large-cont');
		if (oDiv.style.display != 'none') {
			oDiv.style.display = 'none';
			if (navigator.appName == "Microsoft Internet Explorer" && navigator.userAgent.toLowerCase().indexOf('msie 6') != -1) {
				oDiv.style.position = "absolute";
			}
		}
	}
}

// call currency popup
function Ajax_2(URL, dataset) {
	$.ajaxSetup({
		cache: false
	});
	$.ajax({
		type: "POST",
		url: URL,
		data: dataset,
		dataType: "json",
		success: function(data) {
			if (data.selPayOpt_2 == 1) {
				//
			}
			if (data.ClearF_BN == 1) {
				hideForm('timer', 'timer-inner');
				clearDataResetInit();
			}
		},
		error: function() {
			setTimeout(function() {
				hideForm('timer', 'timer-inner');
			}, 60000);
			if (document.getElementById("form1")) {
				document.getElementById("form1").submit();
			}
		}
	});
}

function GetSubCl(base_cl_id) {
	lang = document.getElementById('lang_selected').value;
	mobile = document.getElementById('mobile_phone').value;
	sel_clgroup = '';
	if (document.getElementById('sel_clgroup')) {
		sel_clgroup = document.getElementById('sel_clgroup').value;
	}
	ca = '';
	if (document.getElementsByName('sel_colors')) {
		x = document.getElementsByName('sel_colors');
		color_array = [];
		for (var i = 0; i < x.length; i++) {
			//type_array = x[i].value;
			ca = ca + x[i].value + ',';
			color_array.push(x[i].value);
		}
	}
	dataset = {
		mobile: mobile,
		base_cl_id: base_cl_id,
		lang: lang,
		color_array: color_array,
		sel_clgroup: sel_clgroup
	};
		//console.log(dataset);
	URL = '/includes/inc/ajax_responder.php?job=GetSubCl';
	AjaxGeneral(URL, dataset);
}

function GetColorGroup(groupid) {
	c_uri = window.location.search;
	uri_p = document.getElementById('uri_path').value;
	new_str = '';
	uri_para = '';
	found = 0;
	if (c_uri.indexOf("?") !== -1) {
		uripara = c_uri.split("?");
		uri_para = uripara[1];
	}
	if (uri_para != '') {
		a = uri_para.split("&");
		for (i = 0; i < a.length; i++) {
			str = a[i];
			if (str.indexOf("clgroup=") !== -1) {
				str = 'clgroup=' + groupid;
				found = 1;
			}
			new_str += str + '&';
		}
		new_str = new_str.slice(0, -1);
		if (found == 0) {
			new_str = new_str + '&clgroup=' + groupid;
		} else {
			new_str = new_str;
		}
	}
	if (new_str == '') {
		new_uri = c_uri + '?clgroup=' + groupid;
	} else {
		new_uri = '/' + uri_p + '?' + new_str;
	}
	if (new_uri.indexOf("base_color") !== -1) {
		new_uri = removeURLParameter(new_uri, 'base_color');
	}
	if (new_uri.indexOf("page") !== -1) {
		new_uri = removeURLParameter(new_uri, 'page');
	}
	loc = '';
	if (document.getElementById('loc')) {
		loc = document.getElementById('loc').value;
		if (loc == 'home') {
			// /index.php
			new_uri = removeURLParameter(new_uri, '/index.php');
			new_uri = '/group/gemselect.php' + new_uri;
		}
	}
	new_uri = new_uri.replace("/help/newsletter/newsletter-feb-22.php", "");
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'GetColorGroup');
	window.open(new_uri, '_self');
}

function GetBaseCL(base_color) {
	c_uri = window.location.search;
	uri_p = document.getElementById('uri_path').value;
	new_str = '';
	uri_para = '';
	found = 0;
	if (c_uri.indexOf("?") !== -1) {
		uripara = c_uri.split("?");
		uri_para = uripara[1];
	}
	if (uri_para != '') {
		a = uri_para.split("&");
		for (i = 0; i < a.length; i++) {
			str = a[i];
			if (str.indexOf("base_color=") !== -1) {
				str = 'base_color=' + base_color;
				found = 1;
			}
			new_str += str + '&';
		}
		new_str = new_str.slice(0, -1);
		if (found == 0) {
			new_str = new_str + '&base_color=' + base_color;
		} else {
			new_str = new_str;
		}
	}
	if (new_str == '') {
		new_uri = c_uri + '?base_color=' + base_color;
	} else {
		new_uri = '/' + uri_p + '?' + new_str;
	}

	if (new_uri.indexOf("clgroup") !== -1) {
		new_uri = removeURLParameter(new_uri, 'clgroup');
	}
	if (new_uri.indexOf("page") !== -1) {
		new_uri = removeURLParameter(new_uri, 'page');
	}
	loc = '';
	if (document.getElementById('loc')) {
		loc = document.getElementById('loc').value;
		if (loc == 'home') {
			// /index.php
			new_uri = removeURLParameter(new_uri, '/index.php');
			new_uri = '/group/gemselect.php' + new_uri;
		}
	}
	new_uri = new_uri.replace("/help/newsletter/newsletter-feb-22.php", "");
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'GetBaseCL');
	window.open(new_uri, '_self');
}

function removeURLParameter(url, parameter) {
	//prefer to use l.search if you have a location/link object
	var urlparts = url.split('?');
	if (urlparts.length >= 2) {
		var prefix = encodeURIComponent(parameter) + '=';
		var pars = urlparts[1].split(/[&;]/g);
		//reverse iteration as may be destructive
		for (var i = pars.length; i-- > 0;) {
			//idiom for string.startsWith
			if (pars[i].lastIndexOf(prefix, 0) !== -1) {
				pars.splice(i, 1);
			}
		}
		return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
	}
	return url;
}

function clear_CL() {
	c_uri = window.location.search;
	uri_p = document.getElementById('uri_path').value;
	c_uri = removeURLParameter(c_uri, 'clgroup');
	c_uri = removeURLParameter(c_uri, 'base_color');
	new_uri = '/' + uri_p + c_uri;
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'clear_CL');
	window.open(new_uri, '_self');
}

function Expand_Element(elem_id, outer) {
	now = $('#' + elem_id).height();
	if (now == '500') {
		document.getElementById(elem_id).style.height = '100%';
		document.getElementById(outer).style.height = '100%';
	} else {
		document.getElementById(elem_id).style.height = '500px';
		document.getElementById(outer).style.height = '625px';
	}
}

function getPDF_chart(status) {
	showForm('timer', 'timer-inner');
	url = '/includes/inc/make_pdf_chart.php?status=' + status;
	RecURL(url,'getPDF_chart');
	window.open(url, "_self");
	setTimeout(function() {
		hideForm('timer', 'timer-inner');
	}, 1200);
}

function togUL2(ul) {
	if ($('#' + ul).is(':visible')) {
		$('#' + ul).slideUp(200);
		$('#p_arr').toggleClass('arrow-down');
		$('#p_arr').removeClass('arrow-up');
	} else {
		$('#' + ul).slideDown(200);
		$('#p_arr').toggleClass('arrow-up');
		$('#p_arr').removeClass('arrow-down');
	}
}

function togUL(ul) {
	if ($('#' + ul).is(':visible')) {
		$('#' + ul).slideUp(200);
		if (document.getElementById('ar_1')) {
			document.getElementById('ar_1').style.borderWidth = '11px 8px 0 8px';
		}
		$("#vistxt").attr('class', 'vistxt');
	} else {
		$('#' + ul).slideDown(200);
		if (document.getElementById('ar_1')) {
			document.getElementById('ar_1').style.borderWidth = '0 8px 11px 8px';
		}
		$("#vistxt").attr('class', 'vistxt_u');
	}
}

function NMAIL() {
	nl_email = document.getElementById('email_nl').value;
	if ( /(.+)@(.+){2,}\.(.+){2,}/.test(nl_email) ) {
		showForm('timer', 'timer-inner');
		dataset = {sess_id: sess_id, nl_email: nl_email};
		URL = '/includes/inc/ajax_receiver.php?job=NLsubscribe_2';
		AjaxGeneral(URL, dataset);
	} else {
		JSmessage('Invalid format, please verify.');
		document.getElementById('email_nl').focus();
	}
}

function GotoCustAdd_2() {
	showForm('timer', 'timer-inner');
	lang = document.getElementById('lang_selected').value;
	domain_name = document.getElementById('domain_name').value;
	prod_list = '';
	cp = document.getElementsByName('cart_prod');
	for (i = 0; i < cp.length; i++) {
		if (cp[i].value != '') {
			prod_list += cp[i].value + ',';
		}
	}
	prod_list = prod_list.slice(0, -1);
	sess_id = document.getElementById('stick').value;
	testing = 1;
	dataset = {
		domain_name: domain_name,
		lang: lang,
		sess_id: sess_id,
		prod_list: prod_list,
		test: testing
	};
	URL = '/includes/inc/ajax_receiver.php?job=GotoCustAdd';
	AjaxGeneral(URL, dataset);
}

function GotoCustAdd() {
	showForm('timer', 'timer-inner');
	//mobile_phone
	mobile = document.getElementById('mobile_phone').value;
	lang = document.getElementById('lang_selected').value;
	domain_name = document.getElementById('domain_name').value;
	prod_list = '';
	cp = document.getElementsByName('cart_prod');
	for (i = 0; i < cp.length; i++) {
		if (cp[i].value != '') {
			prod_list += cp[i].value + ',';
		}
	}
	prod_list = prod_list.slice(0, -1);
	sess_id = document.getElementById('stick').value;
	dataset = {
		domain_name: domain_name,
		lang: lang,
		sess_id: sess_id,
		prod_list: prod_list,
		mobile: mobile
	};
	URL = '/includes/inc/ajax_receiver.php?job=GotoCustAdd';
	AjaxGeneral(URL, dataset);
}

function UpdateTopazColor(color, prodid) {
	curr_count = document.getElementById('count').innerHTML;
	showForm('timer', 'timer-inner');
	dataset = {
		color: color,
		prodid: prodid,
		curr_count: curr_count
	};
	URL = '/includes/inc/ajax_responder.php?job=UpdateTopazColor';
	AjaxGeneral(URL, dataset);
}

//############################################################################################
// Zoom in/out clothing img
$('.image').click(function() {
	$(this).toggleClass('normal-zoom zoom-in');
});

$('.image').on('mousemove', function(event) {
	// This gives you the position of the image on the page
	var bbox = event.target.getBoundingClientRect();

	// Then we measure how far into the image the mouse is in both x and y directions
	var mouseX = event.clientX - bbox.left;
	var mouseY = event.clientY - bbox.top;

	// Then work out how far through the image as a percentage the mouse is
	var xPercent = (mouseX / bbox.width) * 100;
	var yPercent = (mouseY / bbox.height) * 100;

	// Then we change the `transform-origin` css property on the image to center the zoom effect on the mouse position
	//event.target.style.transformOrigin = xPercent + '% ' + yPercent + '%';
	// It's a bit clearer in jQuery:
	$(this).css('transform-origin', (xPercent + '% ' + yPercent + '%'));
	// We add the '%' units to make sure the string looks exactly like the css declaration it becomes.

});

// If you want it to automatically trigger on hover
$('.image').on('mouseenter', function() {
	$(this).addClass('zoom-in');
	$(this).removeClass('normal-zoom');
});

// and stop when not hovering
$('.image').on('mouseleave', function() {
	$(this).addClass('normal-zoom');
	$(this).removeClass('zoom-in');
});

function SIMG(img_id) {
	src_a = document.getElementById('img_1').src;
	document.getElementById('img_a').src = src_a;
	el_id = 'img_' + img_id;
	src_tmp = document.getElementById(el_id).src;
	document.getElementById('img_1').src = src_tmp;
}
function SBIMG() {
	src_tmp = document.getElementById('img_a').src;
	document.getElementById('img_1').src = src_tmp;
}


/*--------------------------------------------------------------------------
 *  Smooth Scroller Script, version 1.0.1
 *  (c) 2007 Dezinerfolio Inc. <midart@gmail.com>
 *
 *  For details, please check the website : http://dezinerfolio.com/
 *
/*--------------------------------------------------------------------------*/

Scroller = {
		// control the speed of the scroller.
		// dont change it here directly, please use Scroller.speed=50;
		speed: 40,

		// returns the Y position of the div
		gy: function(d) {
			gy = d.offsetTop - 0;
			if (d.offsetParent)
				while (d = d.offsetParent) gy += d.offsetTop;
			return gy;
		},

		// returns the current scroll position
		scrollTop: function() {
			body = document.body;
			d = document.documentElement;
			if (body && body.scrollTop) return body.scrollTop;
			if (d && d.scrollTop) return d.scrollTop;
			if (window.pageYOffset) return window.pageYOffset;
			return 0;
		},

		// attach an event for an element
		// (element, type, function)
		add: function(event, body, d) {
			if (event.addEventListener) return event.addEventListener(body, d, false);
			if (event.attachEvent) return event.attachEvent('on' + body, d);
		},

		// kill an event of an element
		end: function(e) {
			if (window.event) {
				window.event.cancelBubble = true;
				window.event.returnValue = false;
				return;
			}
			if (e.preventDefault && e.stopPropagation) {
				e.preventDefault();
				e.stopPropagation();
			}
		},

		// move the scroll bar to the particular div.
		scroll: function(d) {
			Scroller.speed = 30;
			i = window.innerHeight || document.documentElement.clientHeight;
			h = document.body.scrollHeight;
			a = Scroller.scrollTop();
			if (d > a)
				if (h - d > i)
					a += Math.ceil((d - a) / Scroller.speed);
				else
					a += Math.ceil((d - a - (h - d)) / Scroller.speed);
			else
				a = a + (d - a) / Scroller.speed;
			window.scrollTo(0, a);
			if (a == d || Scroller.offsetTop == a) clearInterval(Scroller.interval);
			Scroller.offsetTop = a;
		},
		// initializer that adds the renderer to the onload function of the window
		init: function() {
			Scroller.add(window, 'load', Scroller.render);
		},

		// this method extracts all the anchors and validates then as # and attaches the events.
		render: function() {
			a = document.getElementsByTagName('a');
			Scroller.end(this);
			window.onscroll;
			for (i = 0; i < a.length; i++) {
				l = a[i];
				if (l.href && l.href.indexOf('#') != -1 && ((l.pathname == location.pathname) || ('/' + l.pathname == location.pathname))) {
					Scroller.add(l, 'click', Scroller.end)
					l.onclick = function() {
						Scroller.end(this);
						l = this.hash.substr(1);
						a = document.getElementsByTagName('a');
						for (i = 0; i < a.length; i++) {
							if (a[i].name == l) {
								clearInterval(Scroller.interval);
								Scroller.interval = setInterval('Scroller.scroll(' + Scroller.gy(a[i]) + ')', 10);
							}
						}
					}
				}
			}
		}
	}
	// invoke the initializer of the scroller
Scroller.init();
/*------------------------------------------------------------
 *						END OF CODE
/*-----------------------------------------------------------*/


// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
	if (document.getElementById("myBtn")) {
		// Get the button:
		let mybutton = document.getElementById("myBtn");
		if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
			mybutton.style.display = "block";
		} else {
			mybutton.style.display = "none";
		}
	}
}
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
	if (document.getElementById('ar_standard')) {
		ele = document.getElementById('ar_standard');
	}
	if (document.getElementById('content_div_1')) {
		ele = document.getElementById('content_div_1');
	}
	if (document.getElementById('intro_list')) {
		ele = document.getElementById('intro_list');
	}
	if (document.getElementById('birth_mon')) {
		ele = document.getElementById('birth_mon');
	}
	if (document.getElementById('clr_gems')) {
		ele = document.getElementById('clr_gems');
	}
	if (document.getElementById('top_list2')) {
		ele = document.getElementById('top_list2');
	}
	if (document.getElementById('toc_nav')) {
		ele = document.getElementById('toc_nav');
	}
	if (document.getElementById('top_jump')) {
		ele = document.getElementById('top_jump');
	}
	setTimeout(window.scrollTo(ele.offsetLeft,ele.offsetTop), 100);
}
function TOP2() {
	if (document.getElementById('list_s')) {
		var ele = document.getElementById('list_s');
	}
	setTimeout(window.scrollTo(ele.offsetLeft,ele.offsetTop), 0);
}

function GetHeight() {
	if (document.getElementsByClassName('txt_ct')) {
		var overlays = document.querySelectorAll('.txt_ct');
		lastHeight = 0;
		for (var i=0; i < overlays.length; i++) {
			if (lastHeight < overlays[i].clientHeight) {
				lastHeight = overlays[i].clientHeight;
			}
		}
		a = document.getElementsByClassName('txt_ct');
		for (z = 0; z < a.length; z++) {
			a[z].style.height = lastHeight + 'px';
		}
	}
}
function IncPrice(old_price,new_price,prodid) {
	showForm('timer', 'timer-inner');
	dataset = {old_price: old_price, new_price: new_price, prodid: prodid};
	URL = '/includes/inc/ajax_receiver.php?job=IncPrice';
	AjaxGeneral(URL, dataset);
}
function Restore_price(prodid) {
	confirmtxt = 'Are you sure you wish to restore the old price?';
	r = confirm(confirmtxt);
	if (r == true) {
		showForm('timer', 'timer-inner');
		dataset = {prodid: prodid};
		URL = '/includes/inc/ajax_receiver.php?job=Restore_price';
		AjaxGeneral(URL, dataset);
	} else {
		return;
	}
}
function SetNewPrice(price, prodid) {
	eid = 'cust_price_' + prodid;
	cust_price = document.getElementById(eid).value;
	if (cust_price == '') {
		alert('Please provide a price!');
		document.getElementById(eid).focus();
	} else {
		showForm('timer', 'timer-inner');
		cust_price = Number(cust_price).toFixed(2);
		if (cust_price > 0)	{
			dataset = {prodid: prodid, price: price, cust_price: cust_price};
			URL = '/includes/inc/ajax_receiver.php?job=SetNewPrice';
			AjaxGeneral(URL, dataset);
		} else {
			alert('Price Format is not OK');
		}
	}
}
function SelGType() {
	gtype_id = document.getElementById('sel_gemtype').value;
	url = '/tools/update-price-per-gemtype.php?gtype_id=' + gtype_id;
	RecURL(url,'SelGType');
	window.open(url, "_self");
}
function ShowCurr() {
	showForm('timer', 'timer-inner');
	lang = document.getElementById('lang_selected').value;
	dataset = {lang: lang};
	URL = '/includes/inc/ajax_responder.php?job=ShowCurr';
	AjaxGeneral(URL, dataset);
}
function LanguagePop() {
	showForm('timer', 'timer-inner');
	lang = document.getElementById('lang_selected').value;
	dataset = {lang: lang};
	URL = '/includes/inc/ajax_responder.php?job=LanguagePop';
	AjaxGeneral(URL, dataset);
}
function LanguagePop_3() {
	showForm('timer', 'timer-inner');
	lang = document.getElementById('lang_selected').value;
	dataset = {lang: lang};
	URL = '/includes/inc/ajax_responder.php?job=LanguagePop_3';
	AjaxGeneral(URL, dataset);
}
function updateLangPop(lang) {
	cur_lang = document.getElementById('lang_selected').value.toLowerCase();
	sess_id = document.getElementById('stick').value;
	do_id = 'domain_' + lang;
	domain_name = document.getElementById(do_id).value;
	uri = document.getElementById('uri_path_full_en').value;
	index = uri.indexOf("?");
	if (index > 1) {
		seperator = '&';
	} else {
		seperator = '?';
	}
	if (uri == '/') {
		uri = '/index.php';
	}
	if (lang != 'english') {
		//uri_lang = 'https://www.' + domain_name + '/' + lang + uri + seperator + 'sess_id=' + sess_id + '&ch=lang';
		uri_lang = 'https://www.' + domain_name + '/' + lang + uri;
	} else {
		//uri_lang = 'https://www.' + domain_name + uri + seperator + 'sess_id=' + sess_id + '&ch=lang';
		uri_lang = 'https://www.' + domain_name + uri;
	}
	RecURL(uri_lang,'updateLangPop');
	window.open(uri_lang, "_self");
}
function ShowSizeComp() {
	showForm('timer', 'timer-inner');
	lang = document.getElementById('lang_selected').value;
	mobile = document.getElementById('mobile_phone').value;
	dataset = {lang: lang, mobile: mobile};
	URL = '/includes/inc/ajax_responder.php?job=ShowSizeComp';
	AjaxGeneral(URL, dataset);
}
function WeightExplained() {
	showForm('timer', 'timer-inner');
	lang = document.getElementById('lang_selected').value;
	mobile = document.getElementById('mobile_phone').value;
	dataset = {lang: lang, mobile: mobile};
	URL = '/includes/inc/ajax_responder.php?job=WeightExplained';
	AjaxGeneral(URL, dataset);
}
function ClarityExplained() {
	showForm('timer', 'timer-inner');
	lang = document.getElementById('lang_selected').value;
	mobile = document.getElementById('mobile_phone').value;
	dataset = {lang: lang, mobile: mobile};
	URL = '/includes/inc/ajax_responder.php?job=ClarityExplained';
	AjaxGeneral(URL, dataset);
}
function TreatmentExplained() {
	showForm('timer', 'timer-inner');
	lang = document.getElementById('lang_selected').value;
	mobile = document.getElementById('mobile_phone').value;
	dataset = {lang: lang, mobile: mobile};
	URL = '/includes/inc/ajax_responder.php?job=TreatmentExplained';
	AjaxGeneral(URL, dataset);
}
function openSubSel(url) {
	RecURL(url,'openSubSel');
	window.open(url, "_self");
}
function openSubSelect(par) {

	let sortedList = par
  .split(",")             // Split the string into an array
  .map(Number)            // Convert each element to a number
  .sort((a, b) => a - b)  // Sort the array in ascending order
  .join(",");             // Join the sorted array back into a string

	uri = document.getElementById('uri_path_full').value;
	var parts = uri.split('?');

	if (sortedList == '84,346') {
		sortedList = '84';
	}
	new_url = parts[0] + '?g_type=' + sortedList;
	RecURL(new_url,'openSubSelect');
	window.open(new_url, "_self");
}
function updateLangMob(lang) {
	uri = document.getElementById('uri_path_full_en').value;
	if (uri == '/') {
		uri = '/index.php';
	}
	new_url = '/' + lang + uri;
	if (lang == 'english') {
		new_url = uri;
	}
	RecURL(new_url,'updateLangMob');
	window.open(new_url, "_self");
}
function GetNlang(lang) {
	var form = document.getElementById('change_' + lang);
	uri = document.getElementById('uri_path_full_en').value;
	if (uri == '/') {
		uri = '/index.php';
	}
	dom_change = document.getElementById('dom_' + lang).value;
	var action_src = 'https://www.' + dom_change + '/' + lang + uri;
	form.action = action_src;
}
function submitForm(fid) {
	document.getElementById(fid).submit();
	attachEvent();
}
function RA() {
	document.getElementById('detail-page-text').style.height = '100%';
	document.getElementById('detail-page-text').style.maxHeight  = '100%';
	document.getElementById('ra_txt').style.display = 'none';
}
GetContainerSize ();
function GetContainerSize () {
	var container = document.getElementById ("detail-page-text");
	if (container.scrollHeight > 1500) {
		document.getElementById('ra_txt').style.display = 'inline-block';
	}
}
function RA() {
	if (document.getElementById ("detail-page-text")) {
		document.getElementById('detail-page-text').style.height = '100%';
		document.getElementById('detail-page-text').style.maxHeight  = '100%';
		document.getElementById('ra_txt').style.display = 'none';
	}
	if (document.getElementById ("rall_cont")) {
		document.getElementById('rall_cont').style.height = '100%';
		document.getElementById('rall_cont').style.maxHeight  = '100%';
		document.getElementById('ra_txt').style.display = 'none';
	}
}
GetContainerSize ();
function GetContainerSize () {
	if (document.getElementById ("detail-page-text")) {
		var container = document.getElementById ("detail-page-text");
		if (container.scrollHeight > 1500) {
			document.getElementById('ra_txt').style.display = 'inline-block';
		}
	}
	// desktop
	if (document.getElementById ("rall_cont")) {
		var container = document.getElementById ("rall_cont");
		if (container.scrollHeight > 2500) {
			document.getElementById('ra_txt').style.display = 'inline-block';
		}
	} 
}
function Ob(cnt) {
	id1 = 'txt_' + cnt;
	id2 = 'l' + cnt;
	a = document.getElementsByClassName('ltx');
	for (var z = 0; z < a.length; z++) {
		a[z].style.color = '#3c4d6dc7';
	}
	const element = document.getElementById(id1);
	if (isElementVisible(element)) {
		Cla();
		document.getElementById(id1).style.display = 'none';
		document.getElementById(id2).style.color = '#3c4d6dc7';
	} else {
		Cla();
		document.getElementById(id1).style.display = 'block';
		document.getElementById(id2).style.color = 'red';
	}
}
function isElementVisible(element) {
	if (!element) return false;
	const style = window.getComputedStyle(element);
	return style.display !== 'none';
}
function Cla() {
	a = document.getElementsByClassName('txtb');
	for (var z = 0; z < a.length; z++) {
		a[z].style.display = 'none';
	}
}
function shdet(id) {
	$("#" + id).delay(150).fadeIn(200);
	a = document.getElementsByClassName('pr_qu');
	for (var z = 0; z < a.length; z++) {
		a[z].style.display = 'none';
	}
}
function hshdet(id) {
	document.getElementById(id).style.display = 'none';
}
function Mpd(eid, event) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}
	dpl = document.getElementById(eid).style.display;
	if (dpl == 'none') {
		$("#" + eid).delay(150).fadeIn(200);
		a = document.getElementsByClassName('md_tr');
		for (var z = 0; z < a.length; z++) {
			a[z].style.display = 'none';
		}
	} else {
		document.getElementById(eid).style.display = 'none';
	}
}
function toggleAccordion(element) {
	const content = element.nextElementSibling;
	if (content.style.maxHeight) {
		content.style.maxHeight = null;
	} else {
		closeAll(); // Close all open accordions
		content.style.maxHeight = content.scrollHeight + "px";
	}
}
function closeAll() {
	const allContents = document.querySelectorAll('.accordion-content');
	allContents.forEach(panel => {
		if (panel.style.maxHeight) {
			panel.style.maxHeight = null;
		}
	});
}
function hE(eid) {
	document.getElementById(eid).style.display = 'none';
	box = document.getElementById('help-cont').style.display;
	if (box == 'none') {
		setTimeout(function() {
			$("#"+eid).fadeIn("slow");
		}, 3500);
	}
}
function OpenP(type) {
	domain = document.getElementById('domain_name').value;
	ls = document.getElementById('lang_selected').value;
	language = ls.toLowerCase();
	uri_1 = 'https://'+domain+'/'+language;
	if (language == 'english') {
		uri_1 = 'https://'+domain;
	}
	if (type == 'clarity') {
		uri = uri_1+'/gem-info/clarity-scale.php';
	}
	if (type == 'treatment') {
		uri = uri_1+'/gem-info/intro-treatment.php';
	}
	if (type == 'weight') {
		uri = uri_1+'/gem-info/carat.php';
	}
	if (type == 'certs') {
		uri = uri_1+'/help/gemstone-certificate.php';
	}
	if (type == 'ship') {
		uri = uri_1+'/help/shipping.php';
	}
	if (type == 'pay') {
		uri = uri_1+'/help/checkout.php';
	}
	if (type == 'guarantee') {
		uri = uri_1+'/help/guarantee.php';
	}
	if (type == 'return') {
		uri = uri_1+'/help/returns.php';
	}
	window.open(uri, "_self");
}

function collapse_treat() {
	if (document.getElementById('treat')) {
		treat = document.getElementById('treat').value;
		if (treat != 'all') {
			document.getElementById('td-treat').style.backgroundColor = "rgb(230, 255, 230)";
			document.getElementById('td-treat').style.fontWeight = "bold";
		}
		if (treat == 'all') {
			document.getElementById('lbl_1').style.color = "green";
			document.getElementById(treat).checked = true;
			OpenSubF('treat_cont');
		}
		if (treat == 'none') {
			document.getElementById('lbl_2').style.color = "green";
			document.getElementById(treat).checked = true;
			OpenSubF('treat_cont');
		}
		if (treat == 'heated') {
			document.getElementById('lbl_3').style.color = "green";
			document.getElementById(treat).checked = true;
			OpenSubF('treat_cont');
		}
		if (treat == 'beheated') {
			document.getElementById('lbl_4').style.color = "green";
			document.getElementById(treat).checked = true;
			OpenSubF('treat_cont');
		}
		if (treat == 'fracture') {
			document.getElementById('lbl_5').style.color = "green";
			document.getElementById(treat).checked = true;
			OpenSubF('treat_cont');
		}
	}
}

function collapse_treat_mobile() {
	if (document.getElementById('treat')) {
		treat = document.getElementById('treat').value;
		if (treat == 'all') {
			document.getElementById('tre_1').style.backgroundColor = "green";
			document.getElementById(treat).checked = true;
			document.getElementById('lbl_1').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('treat_cont');
		}
		if (treat == 'none') {
			document.getElementById('tre_2').style.backgroundColor = "green";
			document.getElementById(treat).checked = true;
			document.getElementById('lbl_2').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('treat_cont');
		}
		if (treat == 'heated') {
			document.getElementById('tre_3').style.backgroundColor = "green";
			document.getElementById(treat).checked = true;
			document.getElementById('lbl_3').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('treat_cont');
		}
		if (treat == 'beheated') {
			document.getElementById('tre_4').style.backgroundColor = "green";
			document.getElementById(treat).checked = true;
			document.getElementById('lbl_4').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('treat_cont');
		}
		if (treat == 'fracture') {
			document.getElementById('tre_5').style.backgroundColor = "green";
			document.getElementById(treat).checked = true;
			document.getElementById('lbl_5').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('treat_cont');
		}
	}
}

function collapseMobilemenu_range(type) {
	if (document.getElementById('weight_min')) {
		if (type == 'weight') {
			weight_min = document.getElementById('weight_min').value;
			weight_max = document.getElementById('weight_max').value;
		}
		if (weight_min == 0 && weight_max == 1) {
			document.getElementById('wr_0').style.backgroundColor = "green";
			document.getElementById('wr_0').style.color = "white";
			document.getElementById('wr_0').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('weight_cont');
		}
		if (weight_min == 1 && weight_max == 1.5) {
			document.getElementById('wr_1').style.backgroundColor = "green";
			document.getElementById('wr_1').style.color = "white";
			document.getElementById('wr_1').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('weight_cont');
		}
		if (weight_min == 1.5 && weight_max == 2) {
			document.getElementById('wr_2').style.backgroundColor = "green";
			document.getElementById('wr_2').style.color = "white";
			document.getElementById('wr_2').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('weight_cont');
		}
		if (weight_min == 2 && weight_max == 3) {
			const element = document.getElementById('wr_4');
			element.style.backgroundColor = "green";
			element.style.color = "white";
			element.style.backgroundImage = "url(/graphics/m_x.png)";
			OpenSubF('weight_cont');
		}
		if (weight_min == 3 && weight_max == 5) {
			document.getElementById('wr_4').style.backgroundColor = "green";
			document.getElementById('wr_4').style.color = "white";
			document.getElementById('wr_4').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('weight_cont');
		}
		if (weight_min == 5 && weight_max == 8) {
			document.getElementById('wr_5').style.backgroundColor = "green";
			document.getElementById('wr_5').style.color = "white";
			document.getElementById('wr_5').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('weight_cont');
		}
		if (weight_min == 8 && weight_max == 12) {
			document.getElementById('wr_6').style.backgroundColor = "green";
			document.getElementById('wr_6').style.color = "white";
			document.getElementById('wr_6').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('weight_cont');
		}
		if (weight_min == 12 && weight_max == 18) {
			document.getElementById('wr_7').style.backgroundColor = "green";
			document.getElementById('wr_7').style.color = "white";
			document.getElementById('wr_7').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('weight_cont');
		}
		if (weight_min == 18 && weight_max == 300) {
			document.getElementById('wr_8').style.backgroundColor = "green";
			document.getElementById('wr_8').style.color = "white";
			document.getElementById('wr_8').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('weight_cont');
		}
	}
}

function collapseSubGemstones() {
	if (document.getElementById('sub_gemstones')) {
		val = document.getElementById('sub_gemstones').value;
		menu_new = 0;
		if (document.getElementById('nmm_26')) {
			menu_new = 1;
		}
		if (val != 0) {
			const myArray = val.split(",");
			sub = myArray[0];
			main = myArray[1];
			eid = sub + '_a';
			mid = main + '_a';
			if (document.getElementById(eid)) {
				if (menu_new == 0) {
					document.getElementById(eid).style.backgroundColor = "green";
					document.getElementById(eid).style.color = "white";
				}
				if (menu_new == 1) {
					document.getElementById(eid).style.color = "green";
					document.getElementById(eid).style.fontWeight = 'bold';
				}
			}
			if (document.getElementById(mid)) {
				if (menu_new == 0) {
					document.getElementById(mid).style.backgroundColor = "green";
					document.getElementById(mid).style.color = "white";
				}
				if (menu_new == 1) {
					document.getElementById(mid).style.color = "green";
					document.getElementById(mid).style.fontWeight = 'bold';
				}
			}
		}
	}
}

function collapseMobilemenu_clarity() {
	if (document.getElementById('clarity')) {
		clarity = document.getElementById('clarity').value;
		if (clarity == 'if_only') {
			document.getElementById('cr_1').style.backgroundColor = "green";
			document.getElementById('cr_1').style.color = "white";
			document.getElementById('cr_1').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('clarity_cont');
		}
		if (clarity == 'vvs_up') {
			document.getElementById('cr_2').style.backgroundColor = "green";
			document.getElementById('cr_2').style.color = "white";
			document.getElementById('cr_2').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('clarity_cont');
		}
		if (clarity == 'vs_up') {
			document.getElementById('cr_3').style.backgroundColor = "green";
			document.getElementById('cr_3').style.color = "white";
			document.getElementById('cr_3').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('clarity_cont');
		}
		if (clarity == 'si_up') {
			document.getElementById('cr_4').style.backgroundColor = "green";
			document.getElementById('cr_4').style.color = "white";
			document.getElementById('cr_4').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('clarity_cont');
		}
		if (clarity == 'i1_up') {
			document.getElementById('cr_5').style.backgroundColor = "green";
			document.getElementById('cr_5').style.color = "white";
			document.getElementById('cr_5').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('clarity_cont');
		}
		if (clarity == 'transl_up') {
			document.getElementById('cr_6').style.backgroundColor = "green";
			document.getElementById('cr_6').style.color = "white";
			document.getElementById('cr_6').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('clarity_cont');
		}
		if (clarity == 'all') {
			document.getElementById('cr_7').style.backgroundColor = "green";
			document.getElementById('cr_7').style.color = "white";
			document.getElementById('cr_7').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('clarity_cont');
		}
	}
}

function collapseMobilemenu_price() {
	if (document.getElementById('p_min')) {
		type = 'price';
		// p_min=10&p_max
		if (type == 'price') {
			price_min = document.getElementById('p_min').value;
			price_max = document.getElementById('p_max').value;
		}
		if (price_min == 0 && price_max == 10) {
			document.getElementById('pr_1').style.backgroundColor = "green";
			document.getElementById('pr_1').style.color = "white";
			document.getElementById('pr_1').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('price_cont');
		}
		if (price_min == 10 && price_max == 25) {
			document.getElementById('pr_2').style.backgroundColor = "green";
			document.getElementById('pr_2').style.color = "white";
			document.getElementById('pr_2').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('price_cont');
		}
		if (price_min == 25 && price_max == 50) {
			document.getElementById('pr_3').style.backgroundColor = "green";
			document.getElementById('pr_3').style.color = "white";
			document.getElementById('pr_3').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('price_cont');
		}
		if (price_min == 50 && price_max == 75) {
			document.getElementById('pr_4').style.backgroundColor = "green";
			document.getElementById('pr_4').style.color = "white";
			document.getElementById('pr_4').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('price_cont');
		}
		if (price_min == 75 && price_max == 100) {
			document.getElementById('pr_5').style.backgroundColor = "green";
			document.getElementById('pr_5').style.color = "white";
			document.getElementById('pr_5').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('price_cont');
		}
		if (price_min == 100 && price_max == 150) {
			document.getElementById('pr_6').style.backgroundColor = "green";
			document.getElementById('pr_6').style.color = "white";
			document.getElementById('pr_6').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('price_cont');
		}
		if (price_min == 150 && price_max == 200) {
			document.getElementById('pr_7').style.backgroundColor = "green";
			document.getElementById('pr_7').style.color = "white";
			document.getElementById('pr_7').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('price_cont');
		}
		if (price_min == 200 && price_max == 300) {
			document.getElementById('pr_8').style.backgroundColor = "green";
			document.getElementById('pr_8').style.color = "white";
			document.getElementById('pr_8').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('price_cont');
		}
		if (price_min == 300 && price_max == 500) {
			document.getElementById('pr_9').style.backgroundColor = "green";
			document.getElementById('pr_9').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('price_cont');
		}
		if (price_min == 500 && price_max == 1000) {
			document.getElementById('pr_10').style.backgroundColor = "green";
			document.getElementById('pr_10').style.color = "white";
			document.getElementById('pr_10').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('price_cont');
		}
		if (price_min == 1000 && price_max == 100000) {
			document.getElementById('pr_11').style.backgroundColor = "green";
			document.getElementById('pr_11').style.color = "white";
			document.getElementById('pr_11').style.backgroundImage="url(/graphics/m_x.png)";
			OpenSubF('price_cont');
		}
	}
}

function collapseMobilemenu(type) {
	clName = '';
	if (type == 'shape') {
		clName = 'shape_sel';
	}
	if (clName != '') {
		a = document.getElementsByClassName(clName);
		for (var z = 0; z < a.length; z++) {
			OpenSubF('m_shape_cont');
			return;
		}
	}
}

function SetClarity(clarity,status) {
	c_uri = document.getElementById('uri_path_full').value;
	if (status == 'on') {
		c_uri = removeURLParameter(c_uri, 'clarity');
		showForm('timer', 'timer-inner');
		RecURL(c_uri,'SetClarity');
		window.open(c_uri, '_self');
	} 
	if (status == 'off') {
		if (clarity == 'if_only') {
			w_para = 'clarity=if_only';
		}
		if (clarity == 'vvs_up') {
			w_para = 'clarity=vvs_up';
		}
		if (clarity == 'vs_up') {
			w_para = 'clarity=vs_up';
		}
		if (clarity == 'si_up') {
			w_para = 'clarity=si_up';
		}
		if (clarity == 'i1_up') {
			w_para = 'clarity=i1_up';
		}
		if (clarity == 'transl_up') {
			w_para = 'clarity=transl_up';
		}
		if (clarity == 'all') {
			w_para = 'clarity=all';
		}

		last_char = c_uri.substr(-1);
		if (last_char == '?') {
			c_uri = c_uri.substring(0, c_uri.length - 1);
		}
		uri_p = document.getElementById('uri_path').value;
		new_str = '';
		uri_para = '';
		c_uri = removeURLParameter(c_uri, 'clarity');
		found = 0;
		if (c_uri.indexOf("?") !== -1) {
			uripara = c_uri.split("?");
			uri_para = uripara[1];
		}
		if (uri_para != '') {
			new_str = uri_para+'&'+w_para;
		} else {
			new_str = w_para;
		}
		new_uri = '/' + uri_p + '?' + new_str;
		showForm('timer', 'timer-inner');
		RecURL(new_uri,'SetClarity');
		window.open(new_uri, '_self');
	}
}

function setPrice_mobile(range,status) {
	type = 'price';
	c_uri = document.getElementById('uri_path_full').value;
	if (status == 'on') {
		// p_min=10&p_max=25
		c_uri = removeURLParameter(c_uri, 'p_min');
		c_uri = removeURLParameter(c_uri, 'p_max');
		showForm('timer', 'timer-inner');
		RecURL(c_uri,'setPrice_mobile');
		window.open(c_uri, '_self');
	} 
	if (status == 'off') {
		if (range == '0-10') {
			w_para = 'p_min=0&p_max=10';
		}
		if (range == '10-25') {
			w_para = 'p_min=10&p_max=25';
		}
		if (range == '25-50') {
			w_para = 'p_min=25&p_max=50';
		}
		if (range == '50-75') {
			w_para = 'p_min=50&p_max=75';
		}
		if (range == '75-100') {
			w_para = 'p_min=75&p_max=100';
		}
		if (range == '100-150') {
			w_para = 'p_min=100&p_max=150';
		}
		if (range == '150-200') {
			w_para = 'p_min=150&p_max=200';
		}
		if (range == '200-300') {
			w_para = 'p_min=200&p_max=300';
		}
		if (range == '300-500') {
			w_para = 'p_min=300&p_max=500';
		}
		if (range == '500-1000') {
			w_para = 'p_min=500&p_max=1000';
		}
		if (range == '1000-100000') {
			w_para = 'p_min=1000&p_max=100000';
		}

		last_char = c_uri.substr(-1);
		if (last_char == '?') {
			c_uri = c_uri.substring(0, c_uri.length - 1);
		}
		uri_p = document.getElementById('uri_path').value;
		new_str = '';
		uri_para = '';
		if (type == 'price') {
			c_uri = removeURLParameter(c_uri, 'p_min');
			c_uri = removeURLParameter(c_uri, 'p_max');
		}
		found = 0;
		if (c_uri.indexOf("?") !== -1) {
			uripara = c_uri.split("?");
			uri_para = uripara[1];
		}
		if (uri_para != '') {
			new_str = uri_para+'&'+w_para;
		} else {
			new_str = w_para;
		}
		new_uri = '/' + uri_p + '?' + new_str;
		showForm('timer', 'timer-inner');
		RecURL(new_uri,'setPrice_mobile');
		window.open(new_uri, '_self');
	}
}

function AddRanges(range,type,status) {
	c_uri = document.getElementById('uri_path_full').value;
	if (status == 'on') {
		c_uri = removeURLParameter(c_uri, 'weight_min');
		c_uri = removeURLParameter(c_uri, 'weight_max');
		showForm('timer', 'timer-inner');
		RecURL(c_uri,'AddRanges');
		window.open(c_uri, '_self');
	} 
	if (status == 'off') {
		if (range == '0-1') {
			w_para = 'weight_min=0&weight_max=1';
		}
		if (range == '1-1_5') {
			w_para = 'weight_min=1&weight_max=1.5';
		}
		if (range == '1_5-2') {
			w_para = 'weight_min=1.5&weight_max=2';
		}
		if (range == '2-3') {
			w_para = 'weight_min=2&weight_max=3';
		}
		if (range == '3-5') {
			w_para = 'weight_min=3&weight_max=5';
		}
		if (range == '5-8') {
			w_para = 'weight_min=5&weight_max=8';
		}
		if (range == '8-12') {
			w_para = 'weight_min=8&weight_max=12';
		}
		if (range == '12-18') {
			w_para = 'weight_min=12&weight_max=18';
		}
		if (range == '18-300') {
			w_para = 'weight_min=18&weight_max=300';
		}

		last_char = c_uri.substr(-1);
		if (last_char == '?') {
			c_uri = c_uri.substring(0, c_uri.length - 1);
		}
		uri_p = document.getElementById('uri_path').value;
		new_str = '';
		uri_para = '';
		if (type == 'weight') {
			c_uri = removeURLParameter(c_uri, 'weight_min');
			c_uri = removeURLParameter(c_uri, 'weight_max');
		}
		found = 0;
		if (c_uri.indexOf("?") !== -1) {
			uripara = c_uri.split("?");
			uri_para = uripara[1];
		}
		if (uri_para != '') {
			new_str = uri_para+'&'+w_para;
		} else {
			new_str = w_para;
		}
		new_uri = '/' + uri_p + '?' + new_str;
		showForm('timer', 'timer-inner');
		RecURL(new_uri,'AddRanges');
		window.open(new_uri, '_self');
	}
}

function GetSizeRange_Desk() {
	if (document.getElementById('size_length')) {	
		length_input = document.getElementById('size_length').value;
		if (result = validateInput(length_input) == false) {
			JSmessage('Invalid format, Allowed formats are: numbers 1-100, or dot-separated 1.05...');
			document.getElementById('size_length').style.backgroundColor = "yellow";
			return;
		}
		width_input = document.getElementById('size_width').value;

		//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		// length_input
		var parts = length_input.split('-');
		min_length = parts[0].trim();
		max_length = '';
		if (parts[1]) {
			max_length = parts[1].trim();
		}
		if (max_length == '') {
			min = (min_length * 0.96).toFixed(2);
			max = (min_length * 1.04).toFixed(2);
		} else {
			min = min_length;
			max = max_length;
		}
		if (Number(min) > Number(max)) {
			max_l = min;
			min_l = max;
		} else {
			max_l = max;
			min_l = min;
		}
		//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

		//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		// width_input
		if (width_input != '') {
			var parts = width_input.split('-');
			min_width = parts[0].trim();
			max_width = '';
			if (parts[1]) {
				max_width = parts[1].trim();
			}
			if (max_width == '') {
				min2 = (min_width * 0.96).toFixed(2);
				max2 = (min_width * 1.04).toFixed(2);
			} else {
				min2 = min_width;
				max2 = max_width;
			}
			if (Number(min2) > Number(max2)) {
				max_w = min2;
				min_w = max2;
			} else {
				max_w = max2;
				min_w = min2;
			}
			size_str = 'min_l='+min_l+'&max_l='+max_l+'&min_w='+min_w+'&max_w='+max_w;
			//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		} else {
			size_str = 'min_l='+min_l+'&max_l='+max_l;
		}
		c_uri = document.getElementById('uri_path_full').value;
		last_char = c_uri.substr(-1);
		if (last_char == '?') {
			c_uri = c_uri.substring(0, c_uri.length - 1);
		}
		uri_p = document.getElementById('uri_path').value;
		new_str = '';
		uri_para = '';
		c_uri = removeURLParameter(c_uri,'min_l');
		c_uri = removeURLParameter(c_uri,'max_l');
		c_uri = removeURLParameter(c_uri,'min_w');
		c_uri = removeURLParameter(c_uri,'max_w');
		c_uri = removeURLParameter(c_uri, 'size_set');
		c_uri = removeURLParameter(c_uri, 'odd_sizes');
		found = 0;
		if (c_uri.indexOf("?") !== -1) {
			uripara = c_uri.split("?");
			uri_para = uripara[1];
		}
		if (uri_para != '') {
			new_str = uri_para+'&'+size_str;
		} else {
			new_str = size_str;
		}
		new_uri = '/' + uri_p + '?' + new_str;
		showForm('timer', 'timer-inner');
		RecURL(new_uri,'GetSizeRange_Desk');
		window.open(new_uri, '_self');
	}
}

function ClearSizeRange() {
	c_uri = document.getElementById('uri_path_full').value;
	uri_p = document.getElementById('uri_path').value;
	new_str = '';
	uri_para = '';
	c_uri = removeURLParameter(c_uri, 'min_l');
	c_uri = removeURLParameter(c_uri, 'max_l');
	c_uri = removeURLParameter(c_uri, 'min_w');
	c_uri = removeURLParameter(c_uri, 'max_w');
	if (c_uri.indexOf("?") !== -1) {
		uripara = c_uri.split("?");
		new_uri = '/' + uri_p + '?' + uripara[1];
	} else {
		new_uri = '/' + uri_p;
	}
	showForm('timer', 'timer-inner');
	window.open(new_uri, '_self');
}

function validateInput(input) {
	// Regular expression for integers from 1 to 100
	const intRegex = /^(?:100|[1-9][0-9]?)$/;
	// Regular expression for dot-separated values with one or two decimal places (e.g., 5.9, 5.95, 2.02)
	const dotSeparatedValueRegex = /^(?:\d{1,2}|\d{1,2}\.\d{1,2}|100(?:\.0{1,2})?)$/;
	// Regular expression for ranges with one or two decimal places (e.g., 1.5-2.5, 2.00-2.68)
	const rangeRegex = /^((?:\d{1,2}|\d{1,2}\.\d{1,2}|100(?:\.0{1,2})?))\s*-\s*((?:\d{1,2}|\d{1,2}\.\d{1,2}|100(?:\.0{1,2})?))$/;
	// Check if the input matches any of the regex patterns
	if (intRegex.test(input) || dotSeparatedValueRegex.test(input) || rangeRegex.test(input)) {
		// Further validate the range to ensure both numbers are <= 100
		if (rangeRegex.test(input)) {
			const [start, end] = input.split('-').map(val => parseFloat(val.trim()));
			if (start > 100 || end > 100) {
				return false;
			}
		}
		return true;
	} else {
		return false;
	}
}

function GetSizeRange() {
	if (document.getElementById('length_from')) {
		c_uri = document.getElementById('uri_path_full').value;
		length = document.getElementById('length_from').value;
		width = document.getElementById('length_to').value;
		s_para = 'size_set='+length+'x'+width;
		last_char = c_uri.substr(-1);
		if (last_char == '?') {
			c_uri = c_uri.substring(0, c_uri.length - 1);
		}
		uri_p = document.getElementById('uri_path').value;
		new_str = '';
		uri_para = '';
		c_uri = removeURLParameter(c_uri, 'size_set');
		found = 0;
		if (c_uri.indexOf("?") !== -1) {
			uripara = c_uri.split("?");
			uri_para = uripara[1];
		}
		if (uri_para != '') {
			new_str = uri_para+'&'+s_para;
		} else {
			new_str = s_para;
		}
		new_uri = '/' + uri_p + '?' + new_str;
		showForm('timer', 'timer-inner');
		RecURL(new_uri,'GetSizeRange');
		window.open(new_uri, '_self');
	}
}
function GetSizeSet(set) {
	c_uri = document.getElementById('uri_path_full').value;
	s_para = 'size_set='+set;
	last_char = c_uri.substr(-1);
	if (last_char == '?') {
		c_uri = c_uri.substring(0, c_uri.length - 1);
	}
	uri_p = document.getElementById('uri_path').value;
	new_str = '';
	uri_para = '';
	c_uri = removeURLParameter(c_uri, 'size_set');
	c_uri = removeURLParameter(c_uri, 'odd_sizes');
	c_uri = removeURLParameter(c_uri, 'min_l');
	c_uri = removeURLParameter(c_uri, 'max_l');
	c_uri = removeURLParameter(c_uri, 'min_w');
	c_uri = removeURLParameter(c_uri, 'max_w');
	found = 0;
	if (c_uri.indexOf("?") !== -1) {
		uripara = c_uri.split("?");
		uri_para = uripara[1];
	}
	if (uri_para != '') {
		new_str = uri_para+'&'+s_para;
	} else {
		new_str = s_para;
	}
	new_uri = '/' + uri_p + '?' + new_str;
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'GetSizeSet');
	window.open(new_uri, '_self');
}
function collapseSizeSet() {
	if (document.getElementById('size_cont_m')) {
		size_set = document.getElementById('size_set').value;
		if (size_set != '') {
			OpenSubF('size_cont_m');
		}
	}
	if (document.getElementById('odd_sizes')) {
		odd_sizes = document.getElementById('odd_sizes').value;
		if (odd_sizes == 1) {
			OpenSubF('size_cont_m');
		}
	}
}
function collapseSize_Desk() {
	if (document.getElementById('td-size')) {
		if (document.getElementById('min_l')) {
			min_l = document.getElementById('min_l').value;
			if (min_l > 0) {
				document.getElementById('td-size').style.backgroundColor = "#E6FFE6";
				document.getElementById('td-size').style.fontWeight = "bold";
			}
		}
	}
}
function ClearSizeSet2(s_set) {
	if (document.getElementById('size_set')) {
		size_set = document.getElementById('size_set').value;
		if (size_set != '') {
			c_uri = document.getElementById('uri_path_full').value;
			uri_p = document.getElementById('uri_path').value;
			uri_para = '';
			c_uri = removeURLParameter(c_uri, 'size_set');
			c_uri = removeURLParameter(c_uri, 'odd_sizes');
			found = 0;
			if (c_uri.indexOf("?") !== -1) {
				uripara = c_uri.split("?");
				uri_para = uripara[1];
			}
			if (uri_para != '') {
				new_uri = '/' + uri_p + '?' + uri_para;
			} else {
				new_uri = '/' + uri_p;
			}
			showForm('timer', 'timer-inner');
			RecURL(new_uri,'ClearSizeSet2');
			window.open(new_uri, '_self');
		}
	}
}
function ClearOddSizes() {
	c_uri = document.getElementById('uri_path_full').value;
	uri_p = document.getElementById('uri_path').value;
	uri_para = '';
	c_uri = removeURLParameter(c_uri,'odd_sizes');
	found = 0;
	if (c_uri.indexOf("?") !== -1) {
		uripara = c_uri.split("?");
		uri_para = uripara[1];
	}
	if (uri_para != '') {
		new_uri = '/' + uri_p + '?' + uri_para;
	} else {
		new_uri = '/' + uri_p;
	}
	showForm('timer', 'timer-inner');
	RecURL(new_uri,'ClearOddSizes');
	window.open(new_uri, '_self');
}
function ClearSizeSet() {
	if (document.getElementById('size_set')) {
		size_set = document.getElementById('size_set').value;
		if (size_set != '') {
			c_uri = document.getElementById('uri_path_full').value;
			uri_p = document.getElementById('uri_path').value;
			uri_para = '';
			c_uri = removeURLParameter(c_uri, 'size_set');
			found = 0;
			if (c_uri.indexOf("?") !== -1) {
				uripara = c_uri.split("?");
				uri_para = uripara[1];
			}
			if (uri_para != '') {
				new_uri = '/' + uri_p + '?' + uri_para;
			} else {
				new_uri = '/' + uri_p;
			}
			showForm('timer', 'timer-inner');
			RecURL(new_uri,'ClearSizeSet');
			window.open(new_uri, '_self');
		}
	}
}
function ResetFilters(type) {
	if (type == 'all') {
		c_uri = document.getElementById('uri_path_full').value;
		let filters = ["odd_sizes","buy","min_w","max_w","min_l","max_l","a","base_color","clgroup","facet","cab","g_type","spl","base_shape","weight_min","weight_max","size_set","clarity","p_min","p_max","treat"];
		for (let element of filters) {
			c_uri = removeURLParameter(c_uri,element);
		}
		RecURL(c_uri,'ResetFilters');
		window.open(c_uri,'_self');
	}
}
function ClearSelGem() {
	if (document.getElementsByClassName('bg_gt_sel')) {
		c_uri = document.getElementById('uri_path_full').value;
		uri_p = document.getElementById('uri_path').value;
		uri_para = '';
		c_uri = removeURLParameter(c_uri,'g_type');
		if (c_uri.indexOf("?") !== -1) {
			uripara = c_uri.split("?");
			uri_para = uripara[1];
		}
		if (uri_para != '') {
			new_uri = '/' + uri_p + '?' + uri_para;
		} else {
			new_uri = '/' + uri_p;
		}
		showForm('timer', 'timer-inner');
		RecURL(new_uri,'ClearSelGem');
		window.open(new_uri, '_self');
	}
}
function toggle_UL(containerId, elementId) {
	var container = document.getElementById(containerId);
	var ul = container.querySelector('#' + elementId);
	var arrow = container.querySelector('.arrow-down, .arrow-up');
	if (ul.style.display === "none" || ul.style.display === "") {
		ul.style.display = "block";
		if (arrow) {
			arrow.classList.remove('arrow-down');
			arrow.classList.add('arrow-up');
		}
	} else {
		ul.style.display = "none";
		if (arrow) {
			arrow.classList.remove('arrow-up');
			arrow.classList.add('arrow-down');
		}
	}
}
function ToggTopM(elementId) {
	var cont = $("#" + elementId);
	if (cont.css("display") === "none" || cont.css("display") === "") {
		cont.slideDown("slow");
		if (document.getElementById('togg')) {
			$("#togg").removeClass("togg").addClass("togg_up");
		}
	} else {
		cont.slideUp("slow");
		if (document.getElementById('togg')) {
			$("#togg").removeClass("togg_up").addClass("togg");
		}
	}
	if (document.getElementById('r_linkswrap')) {
		var cont2 = $("#r_linkswrap");
		if (cont2.css("display") === "none" || cont2.css("display") === "") {
			cont2.slideDown("slow");
			if (document.getElementById('togg2')) {
				$("#togg2").removeClass("togg2").addClass("togg_up2");
			}
		} else {
			cont2.slideUp("slow");
			if (document.getElementById('togg2')) {
				$("#togg2").removeClass("togg_up2").addClass("togg2");
			}
		}
	}
}
function ToggTopM2(elementId) {
	var cont = $("#" + elementId);
	if (cont.css("display") === "none" || cont.css("display") === "") {
		cont.slideDown("slow");
		if (document.getElementById('togg2')) {
			$("#togg2").removeClass("togg2").addClass("togg_up2");
		}
	} else {
		cont.slideUp("slow");
		if (document.getElementById('togg2')) {
			$("#togg2").removeClass("togg_up2").addClass("togg2");
		}
	}
}
function show2(element_show,element_highlight,cnt) {
	var cont = $("#" + element_show);
	if (cont.css("display") === "none" || cont.css("display") === "") {
		// hide all open container div's at first
		var n = document.getElementsByClassName("hide_div");
		for (var i = 0; i < n.length; i++) {
			n[i].style.display = 'none';
		}
		//var k = document.getElementsByClassName("no_color");
		//for (i = 0; i < k.length; i++) {
			//k[i].style.backgroundColor = '';
			//k[i].style.fontWeight = 'normal';
		//}
		// cheange all arrows to down
		// $("#togg"+cnt).removeClass("togg_up"+cnt).addClass("togg"+cnt);
		let arrows = ["3","4","5","6","7"];
		for (let elmt of arrows) {
			$("#togg"+elmt).removeClass("togg_up"+elmt).addClass("togg"+elmt);
		}

		div_ele = 'div_'+cnt;
		cont.slideDown("slow");
		$("#togg"+cnt).removeClass("togg"+cnt).addClass("togg_up"+cnt);
		document.getElementById(element_highlight).style.backgroundColor = "#E6FFE6";
	} else {
		cont.slideUp("slow");
		$("#togg"+cnt).removeClass("togg_up"+cnt).addClass("togg"+cnt);
		document.getElementById(element_highlight).style.backgroundColor = "white";
	}
}

function SetDefaultSort(eid) {
	if (document.getElementById(eid)) {
		c_uri = document.getElementById('uri_path_full').value;
		let filters = ["price_desc","price_asc","size_desc","size_asc","weight_desc","weight_asc"];
		for (let element of filters) {
			c_uri = removeURLParameter(c_uri,element);
		}
		RecURL(c_uri,'SetDefaultSort');
		window.open(c_uri,'_self');
	}
}
function SetDefaultGT(eid) {
	if (document.getElementById(eid)) {
		c_uri = document.getElementById('uri_path_full').value;
		c_uri = removeURLParameter(c_uri,'g_type');
		RecURL(c_uri,'SetDefaultGT');
		window.open(c_uri,'_self');
	}
}
function AddParms(parms) {
	c_uri = document.getElementById('uri_path_full').value;
	uri_p = document.getElementById('uri_path').value;
	para_string = document.getElementById('para_string').value;
	const items = para_string.split(',');
	items.forEach(item => {
		key1 = item.trim();  // Trim any extra whitespace and log the item
		c_uri = removeURLParameter(c_uri,key1);
	});
	const keys = extractKeys(parms);
	//console.log(keys);
	keys.forEach(key => {
		c_uri = removeURLParameter(c_uri,key);
	});
	if (parms == 'odd_sizes=1') {
		c_uri = removeURLParameter(c_uri,'size_set');
		c_uri = removeURLParameter(c_uri,'min_w');
		c_uri = removeURLParameter(c_uri,'max_w');
		c_uri = removeURLParameter(c_uri,'min_l');
		c_uri = removeURLParameter(c_uri,'max_l');
	}
	uripara = '';
	uri_para = '';
	if (c_uri.indexOf("?") !== -1) {
		uripara = c_uri.split("?");
		uri_para = uripara[1];
	}
	parms = parms.replace(/,/g, '%2C');
	if (uri_para != '') {
		new_uri = '/' + uri_p + '?' + uri_para + '&' + parms;
	} else {
		new_uri = '/' + uri_p + '?' + parms;
	}
	RecURL(new_uri,'AddParms');
	window.open(new_uri,'_self');
}

function extractKeys(queryString) {
	if (queryString.charAt(0) === '?') {
		queryString = queryString.substring(1);
	}
	const params = new URLSearchParams(queryString);
	const keys = [];
	for (const key of params.keys()) {
		keys.push(key);
	}
	return keys;
}
function OpenCatParms() {
	if (document.getElementById('gt_cats')) {
		parms = document.getElementById('gt_cats').value;
		c_uri = document.getElementById('uri_path_full').value;
		uri_p = document.getElementById('uri_path').value;
		para_string = document.getElementById('para_string').value;
		const items = para_string.split(',');
		items.forEach(item => {
			key1 = item.trim();  // Trim any extra whitespace and log the item
			c_uri = removeURLParameter(c_uri,key1);
		});
		const keys = extractKeys(parms);
		keys.forEach(key => {
			c_uri = removeURLParameter(c_uri,key);
		});
		uripara = '';
		uri_para = '';
		if (c_uri.indexOf("?") !== -1) {
			uripara = c_uri.split("?");
			uri_para = uripara[1];
		}
		parms = parms.replace(/,/g, '%2C');
		if (uri_para != '') {
			new_uri = '/' + uri_p + '?' + uri_para + '&' + parms;
		} else {
			new_uri = '/' + uri_p + '?' + parms;
		}
		RecURL(new_uri,'OpenCatParms');
		window.open(new_uri,'_self');
	}
}
function SetDefaultCAT(eid) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}
	if (document.getElementById(eid)) {
		c_uri = document.getElementById('uri_path_full').value;
		uri_p = document.getElementById('uri_path').value;
		parms = document.getElementById(eid).value;
		keys = extractKeys(parms);
		keys.forEach(key => {
			c_uri = removeURLParameter(c_uri,key);
		});
		uripara = '';
		uri_para = '';
		if (c_uri.indexOf("?") !== -1) {
			uripara = c_uri.split("?");
			uri_para = uripara[1];
		}
		if (uri_para != '') {
			new_uri = '/' + uri_p + '?' + uri_para;
		} else {
			new_uri = '/' + uri_p;
		}
		RecURL(new_uri,'SetDefaultCAT');
		window.open(new_uri,'_self');
	}
}
function SetDefaultCAT_M(parms) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}
	c_uri = document.getElementById('uri_path_full').value;
	uri_p = document.getElementById('uri_path').value;
	keys = extractKeys(parms);
	keys.forEach(key => {
		c_uri = removeURLParameter(c_uri,key);
	});
	uripara2 = '';
	uri_para2 = '';
	if (c_uri.indexOf("?") !== -1) {
		uripara2 = c_uri.split("?");
		uri_para2 = uripara2[1];
	}
	if (uri_para2 != '') {
		new_uri2 = '/' + uri_p + '?' + uri_para2;
	} else {
		new_uri2 = '/' + uri_p;
	}
	RecURL(new_uri2,'SetDefaultCAT_M');
	window.open(new_uri2,'_self');
}
/* cat carousel */
let currentIndex = 0;
function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });
}

function slide(direction) {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const slideWidth = slides[0].getBoundingClientRect().width;
    const maxIndex = slides.length - 1;
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = 0;
    } else if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }
    const amountToMove = -currentIndex * slideWidth;
    track.style.transform = `translateX(${amountToMove}px)`;
    updateIndicators();
}
function jumpTo(index) {
    currentIndex = index;
    slide(0); // refresh the view
}
document.addEventListener('DOMContentLoaded', updateIndicators);
/* END cat carousel */
function NLsignupM() {
	if (document.getElementById('menu-div_nl')) {
		document.getElementById('menu-div_nl').style.display = 'block';
	}
	if (document.getElementById('nl_cross')) {
		document.getElementById('nl_cross').style.display = 'inline-block';
	}
	$("#nl_wrap2").removeClass("nl_wrap2").addClass("nl_wrap_center");
}
function LangM() {
	const isDesktop = window.innerWidth >= 800;
	if (isDesktop) {
		LanguagePop_3();
	} else {
		if (document.getElementById('menu-div_lang')) {
			document.getElementById('menu-div_lang').style.display = 'block';
		}
		if (document.getElementById('la_cross')) {
			document.getElementById('la_cross').style.display = 'inline-block';
		}
		$("#lang_m_wrap").removeClass("lang_m_wrap").addClass("lang_m_wrap_ab");
	}
}
function hideFormLa(bgdiv) {
	if (document.getElementById(bgdiv)) {
		oDiv = document.getElementById(bgdiv);
		oDiv.style.display = 'none';
	}
	if (document.getElementById('la_cross')) {
		document.getElementById('la_cross').style.display = 'none';
	}
	$("#lang_m_wrap").removeClass("lang_m_wrap_ab").addClass("lang_m_wrap");
	hideMForm();
	return false;
}
function hideFormNL(bgdiv) {
	if (document.getElementById(bgdiv)) {
		oDiv = document.getElementById(bgdiv);
		oDiv.style.display = 'none';
	}
	if (document.getElementById('nl_cross')) {
		document.getElementById('nl_cross').style.display = 'none';
	}
	$("#nl_wrap2").removeClass("nl_wrap_center").addClass("nl_wrap2");
	hideMForm();
	return false;
}
$(document).ready(function(){
	$(".menu li").hover(
		function() {
			var id = $(this).attr('id');
			if (id == 'hd_gems' || id == 'hd_help') {
				$(this).find(".dropdown").stop(true, true).slideDown(200);
				$(this).find(".arrow").removeClass("down").addClass("up");
				$(".drop_m_cover").slideDown(100);
			}
		}, function() {
			var id2 = $(this).attr('id');
			if (id2 == 'hd_gems' || id2 == 'hd_help') {
				$(this).find(".dropdown").stop(true, true).slideUp(0);
				$(this).find(".arrow").removeClass("up").addClass("down");
				$(".drop_m_cover").hide();
			}
		}
	);
});
function hideBG() {
	$(".drop_m_cover").hide();
}
function RemoveStyle() {
	var elements = document.querySelectorAll('.flickity-slider');
	elements.forEach(function(element) {
		element.style.transform = '';
	});
}

function ChangeCount(val,prodid) {
	eid = 'cnt_' + prodid;
	if (document.getElementById(eid)) {
		m_id = 'max_' + prodid;
		max_val = (document.getElementById(m_id).innerHTML * 1);
		curr_val = (document.getElementById(eid).value * 1);
		if (val == 'inc') {
			//alert('max_val = ' + max_val);
			//alert('curr_val = ' + curr_val);
			if ((curr_val) < max_val) {
			//alert('inc - ' + curr_val);
			document.getElementById(eid).value = curr_val + 1;
			}
		}
		if (val == 'deg') {
			//alert('deg - ' + curr_val);
			if (curr_val > 1) {
				document.getElementById(eid).value = curr_val - 1;
			}
		}
	}
}
function GetCartCount(sess_id) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/cart_count.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'success') {
					if (document.getElementById('cart-count')) {
						document.getElementById('cart-count').style.display = 'block';
						document.getElementById('cart-count').innerHTML = response.cart_count;
					}
				}
			} else {
				console.error("Error: " + xhr.status);
			}
		}
	};
	var type = 'mobile_cart_count';
	var data = "sess_id=" + encodeURIComponent(sess_id) +
						 "&type=" + encodeURIComponent(type);
	xhr.send(data);
}
function Phones() {
	if ($('#phone-cont').is(':visible')) {
		document.getElementById('phone-div').style.display = 'none';
		document.getElementById('phone-cont').style.display = 'none';
	} else {
		document.getElementById('phone-div').style.display = 'block';
		document.getElementById('phone-cont').style.display = 'block';
	}
}
function UPL(lang) {
	// dom_italian
	dom = 'dom_' + lang;
	domain_name = document.getElementById(dom).value;
	uri_path_full_en = document.getElementById('uri_path_full_en').value;
	uri_path_full_en == '/';
	url = 'https://www.' + domain_name + uri_path_full_en;
	sess_id = document.getElementById('stick').value;
	lang = document.getElementById('lang_selected').value;
	const data = {
    sess_change: sess_id,
    stick_lang: lang
	};
	const form = document.createElement('form');
	form.method = 'POST';
	form.action = url;
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			const input = document.createElement('input');
			input.type = 'hidden';
			input.name = key;
			input.value = data[key];
			form.appendChild(input);
		}
	}
	document.body.appendChild(form);
	form.submit();
}

function SelTreat_desk(event, sel) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}
	
	c_uri = document.getElementById('uri_path_full').value;
	uri_p = document.getElementById('uri_path').value;
	new_str = '';
	uri_para = '';
	found = 0;
	if (c_uri.indexOf("?") !== -1) {
		uripara = c_uri.split("?");
		uri_para = uripara[1];
	}
	if (uri_para != '') {
		a = uri_para.split("&");
		for (i = 0; i < a.length; i++) {
			str = a[i];
			if (str.indexOf("treat=") !== -1) {
				str = 'treat=' + sel;
				found = 1;
			}
			new_str += str + '&';
		}
		new_str = new_str.slice(0, -1);
		if (found == 0) {
			new_str = new_str + '&treat=' + sel;
		} else {
			new_str = new_str;
		}
	}
	if (new_str == '') {
		new_uri = c_uri + '?treat=' + sel;
	} else {
		new_uri = '/' + uri_p + '?' + new_str;
	}
	showForm('timer', 'timer-inner');
	window.open(new_uri, '_self');
}
function SelTreat(event, sel, status) {
	if (event.preventDefault) {
		event.preventDefault();
	}
	if (event.stopPropagation) {
		event.stopPropagation();
	} else if (window.event) {
		window.event.cancelBubble = true;
	}	
	c_uri = document.getElementById('uri_path_full').value;
	uri_p = document.getElementById('uri_path').value;
	new_str = '';
	uri_para = '';
	found = 0;
	if (status == 'on') {
		c_uri = removeURLParameter(c_uri, 'treat');
		showForm('timer', 'timer-inner');
		window.open(c_uri, '_self');
	} 
	if (status == 'off') {
		if (c_uri.indexOf("?") !== -1) {
			uripara = c_uri.split("?");
			uri_para = uripara[1];
		}
		if (uri_para != '') {
			a = uri_para.split("&");
			for (i = 0; i < a.length; i++) {
				str = a[i];
				if (str.indexOf("treat=") !== -1) {
					str = 'treat=' + sel;
					found = 1;
				}
				new_str += str + '&';
			}
			new_str = new_str.slice(0, -1);
			if (found == 0) {
				new_str = new_str + '&treat=' + sel;
			} else {
				new_str = new_str;
			}
		}
		if (new_str == '') {
			new_uri = c_uri + '?treat=' + sel;
		} else {
			new_uri = '/' + uri_p + '?' + new_str;
		}
		if (sel == 'all') {

		}
		showForm('timer', 'timer-inner');
		window.open(new_uri, '_self');
	}
}

function m_menu(e) {

	let menuType = 'gemstones_men';

	// desktop click with event
	if (e && e.currentTarget && e.currentTarget.id) {
		menuType = e.currentTarget.id;
	}

	const isDesktop = window.innerWidth >= 800;

	if (isDesktop) {

		const menu = document.querySelector('.mobile-menu');
		const menu_help = document.querySelector('.help-menu');
		const overlay = document.querySelector('.mobile-menu-overlay');

		overlay.classList.add('active');

		if (menuType === 'help_men') {

			menu.classList.remove('open');
			menu.classList.add('help-mode');
			// open help menu
			//document.getElementById('help__menu').style.display = 'block';
			menu_help.classList.add('open');

		} else {

			menu.classList.remove('help-mode');
			menu.classList.add('open');
			//document.getElementById('help__menu').style.display = 'none';
		}
	} else {

		AdjustMobileMenuHeight();

		document.querySelector('.mobile-menu').style.left = '0';

		document.querySelector('.mobile-menu-overlay')
			.style.display = 'block';

		document.body.style.overflow = 'hidden';

		if (menuType === 'help_men') {

			document.getElementById('nmm_help')
				.style.display = 'block';

			document.getElementById('nmm_26')
				.style.display = 'none';

		} else {

			document.getElementById('nmm_26')
				.style.display = 'block';

			const helpMenu = document.getElementById('nmm_help');

			if (helpMenu) {
				helpMenu.style.display = 'none';
			}

			requestAnimationFrame(function () {
				openSelectedSubmenu();
			});
		}
	}

	document.body.style.overflow = 'hidden';
}

function m_menu_close() {
	const isDesktop = window.innerWidth >= 800;
	if (isDesktop) {
		/* DESKTOP MEGA MENU */
		document.querySelector('.mobile-menu')
			.classList.remove('open');
		document.querySelector('.mobile-menu-overlay')
			.classList.remove('active');
		document.querySelector('.help-menu')
			.classList.remove('open');

		// help-menu

	} else {
		/* MOBILE DRAWER */
		document.querySelector('.mobile-menu').style.left = '-100%';
		document.querySelector('.mobile-menu-overlay').style.display = 'none';
		document.getElementById('nmm_26').style.display = 'none';
	}
	document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function () {
	document.querySelectorAll('.desktop-menu-trigger').forEach(function (trigger) {
		trigger.addEventListener('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			m_menu(e);
		});
	});
});

let lastMenuMode = window.innerWidth >= 800 ? 'desktop' : 'mobile';

window.addEventListener('resize', function () {
	const newMode = window.innerWidth >= 800 ? 'desktop' : 'mobile';

	if (newMode === lastMenuMode) return;

	lastMenuMode = newMode;

	const menu = document.getElementById('nmm_26');
	const overlay = document.querySelector('.mobile-menu-overlay');
	const helpMenu = document.getElementById('help__menu');

	if (menu) {
		menu.classList.remove('open', 'desktop-open', 'help-mode');
		menu.style.left = '';
	}

	if (overlay) {
		overlay.classList.remove('active');
		overlay.style.display = '';
	}

	if (helpMenu) {
		helpMenu.classList.remove('open');
	}

	document.body.style.overflow = '';
});

function openSelectedSubmenu() {
	const submenuLinks = document.querySelectorAll('.submenu a');

	for (const link of submenuLinks) {

		if (
			link.style.color === 'green' ||
			getComputedStyle(link).color === 'rgb(0, 128, 0)'
		) {

			const parentLi = link.closest('.has-submenu');
			if (!parentLi) return;

			parentLi.classList.add('submenu-open', 'open');

			link.style.color = 'green';
			link.style.fontWeight = 'bold';

			return;
		}
	}
}

if (document.getElementById('search_desktop')) {
	const searchInput = document.getElementById('search_desktop');
	searchInput.addEventListener('input', function() {
		if (this.value.trim() === '') {
			document.getElementById('sugg_result').style.display = 'none';
		} else {
			document.getElementById('sugg_result').style.display = 'block';
		}
	});
}

function openHeaderSearch() {
	const form = document.querySelector('.gs-search-form');
	form.classList.add('search-mobile-active');
	const input = document.getElementById('search_desktop');
	setTimeout(function() {
		input.focus();
	}, 100);
}

function closeHeaderSearch() {
	const form = document.querySelector('.gs-search-form');
	if (form) {
		form.classList.remove('search-mobile-active');
	}
}

document.addEventListener('click', function(e) {
	const form = document.querySelector('.gs-search-form');
	if (!form) {
		return;
	}
	if (!form.classList.contains('search-mobile-active')) {
		return;
	}
	if (
		!form.contains(e.target) &&
		!e.target.closest('.gs-search-icon-btn')
	) {
		closeHeaderSearch();
	}
});

if (document.getElementById('m_vc')) {
	show = document.getElementById('m_vc').style.display;
	if (show == 'block') {
		document.body.classList.add('has-sticky-checkout');
	}
}
function AdjustMobileMenuHeight() {
	const sticky = document.querySelector('.mobile-checkout-sticky');
	const menu = document.querySelector('.mobile-menu');
	if (!menu) return;
	const viewportHeight = window.innerHeight;
	if (sticky && getComputedStyle(sticky).display !== 'none') {
		const stickyHeight = sticky.offsetHeight || 0;
		document.body.classList.add('has-sticky-checkout');
		menu.style.height = (viewportHeight - stickyHeight) + 'px';
	} else {
		document.body.classList.remove('has-sticky-checkout');
		menu.style.height = viewportHeight + 'px';
	}
}

window.addEventListener('resize', AdjustMobileMenuHeight);
window.addEventListener('orientationchange', function () {
	setTimeout(AdjustMobileMenuHeight, 300);
});

function ToggleSubmenu(el) {
	const parent = el.closest('.has-submenu');
	parent.classList.toggle('open');
}

function RecURL(url,func) {
}