// GemSelect Cart 
// July-27-2024

function ChgCartItems(prodid, event) {
	showForm('timer', 'timer-inner');
	if (event) {
		event.stopPropagation();
	}
	AddProdToCart(prodid,event);
}

//***************************************************************************************************
function AddProdToCart(prodid,event) {
	if (event) {
		event.stopPropagation();
	}
	p_type = '';
	if (document.getElementById('p_type')) {
		p_type = document.getElementById('p_type').value;
	}
	mobile = document.getElementById('mobile_phone').value;
	
	if (p_type == 'category_page') {
		flyToCheckout_cat(prodid);
		aCartDetailPage(prodid, p_type, mobile);
	}

	if (p_type == 'wishlist') {
		if (mobile == 0) {
			flyToCheckout_cat(prodid);
			aCartDetailPage(prodid, p_type, mobile);
		}
		if (mobile == 1) {
			//flyToCheckout_cat(prodid);
			aCartDetailPage(prodid, p_type, mobile);
		}
	}

	if (p_type == 'cart_page') {
		ChangeCartPCS(prodid, p_type, mobile);
	}

	if (p_type == 'prod_detail_page') {
		flyToCheckoutDesk(prodid);
		aCartDetailPage(prodid, p_type, mobile);
	}
}
//***************************************************************************************************

function ChangeCartPCS(prodid, p_type, mobile) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/change-pcs-in-cart.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'success') {
					//console.log("Success: " + response.message);
					location.reload();
				} else {
					console.error("Error: " + response.message);
				}
			} else {
				console.error("Error: " + xhr.status);
			}
		}
	};

	sess_id = document.getElementById('stick').value;
	addons = '';
	if (document.getElementById('addon_selected')) {
		addons = document.getElementById('addon_selected').value;
	}
	pid = 'pcs_sel_' + prodid;
	if (document.getElementById(pid)) {
		pieces = document.getElementById(pid).value;
	} else {
		pieces = 1;
	}
	botcl = '';
	if (document.getElementById('botcl')) {
		botcl = document.getElementById('botcl').value;
	}
	type = p_type;
	data = "prodid=" + encodeURIComponent(prodid) +
						 "&sess_id=" + encodeURIComponent(sess_id) +
						 "&addons=" + encodeURIComponent(addons) +
						 "&pieces=" + encodeURIComponent(pieces) +
		         "&botcl=" + encodeURIComponent(botcl) +
						 "&type=" + encodeURIComponent(type);
	//console.log(data);
	xhr.send(data);
}

function DelProdFromCart(prodid,event) {
	if (event) {
		event.stopPropagation();
	}
	p_type = '';
	if (document.getElementById('p_type')) {
		p_type = document.getElementById('p_type').value;
	}
	if (document.getElementById('incrt_' + prodid)) {
		document.getElementById('incrt_' + prodid).style.display = 'none';
	}
	mobile = document.getElementById('mobile_phone').value;
	delProd(prodid, p_type, mobile);
}

function CRTshipping(value) {
	showForm('timer', 'timer-inner');
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/change-shipping-type.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				hideForm('timer', 'timer-inner');
				location.reload();
				if (response.status === 'success') {
					var crt_gr_elements = $('.crt_gr');
					var crt_bl_elements = $('.crt_bl');
					crt_gr_elements.removeClass('crt_gr').addClass('crt_bl');
					crt_bl_elements.removeClass('crt_bl').addClass('crt_gr');
					var sub = document.getElementById('crt_sub').value;
					var sta_pr = document.getElementById('crt_' + value).value;
					num = parseFloat(sub) + parseFloat(sta_pr);
					document.getElementById('crt_total').innerHTML = num.toFixed(2);
				} else {
					// Optionally, display an error message to the user
				}
			} else {
				console.error("Error: " + xhr.status);
			}
		}
	};
	var type = 'shipping';
	var sess_id = document.getElementById('stick').value;
	var data = "sess_id=" + encodeURIComponent(sess_id) +
						 "&value=" + encodeURIComponent(value) +
						 "&type=" + encodeURIComponent(type);
	//console.log(data);
	xhr.send(data);
}

function aCartDetailPage(prodid, p_type, mobile) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/add-to-cart.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'success') {
					if (mobile == 1) {
						if (response.cart_total_usd > 0) {
							UpdateUSD_Total(response.cart_total_usd);
						}
					}
					//console.log("Success: " + response.message);
					// response.prodid
					if (p_type == 'category_page' && mobile == 0) {
						//console.log(response.count):
						if (response.item_type != 'sbp_item') {
							UpdateCartButton_C(prodid);
							updateCartCount(response.count);
							UpdateTXT(response.pieces, prodid);
							disableDropDowns(prodid);
						}
					}
					if (p_type == 'wishlist') {
						location.reload();
					}
					//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
					if (p_type == 'category_page' && mobile == 1) {
						if (response.item_type != 'sbp_item') {
							if (document.getElementById('mobile_site')) {
								flyToCart_Mobile(prodid);
							}
							UpdateCartButton_C(prodid);
							updateCartCount(response.count);
							UpdateTXT(response.pieces, prodid);
							disableDropDowns(prodid);
						}
					}

					if (p_type == 'category_page' && mobile == 0) {
						//console.log(response.count):
						if (response.item_type == 'sbp_item') {
							UpdateCartButton_C(prodid);
							updateCartCount(response.count);
							UpdateTXT(response.pieces, prodid);
							disableDropDowns(prodid);
						}
					}
					if (p_type == 'category_page' && mobile == 1) {
						if (response.item_type == 'sbp_item') {
							if (document.getElementById('mobile_site')) {
								flyToCart_Mobile(prodid);
							}
							UpdateCartButton_ByPiece(prodid);
							updateCartCount(response.count);
							UpdateTXT(response.pieces, prodid);
							disableDropDowns(prodid);
						}
					}

					if (p_type == 'prod_detail_page' && mobile == 1) {
						if (document.getElementById('mobile_site')) {
							flyToCart_Mobile(prodid);
						}
						UpdateCartButton_ByPiece(prodid);
						updateCartCount(response.count);
						ShowInCartTXT(response.pieces);
						disableDropDowns(prodid);
					}

					if (p_type == 'prod_detail_page' && mobile == 0) {
						flyToCartDesk(prodid); // new fly to cart function
						updateCartCount(response.count);
						if (response.item_type == 'single_item' || response.item_type == 'group_item') {
							ChangeButtonAdd(prodid);
						}
						if (response.item_type == 'group_item') {
							ShowInCartTXT(response.pieces);
						}
						if (response.item_type == 'sbp_item') {
							AdjustView(prodid);
							ChangeButtonAdd(prodid);
							ShowInCartTXT(response.pieces);
						}
						disableDropDowns(prodid);
					}
				} else {
					console.error("Error: " + response.message);
					// Optionally, display an error message to the user
				}
			} else {
				console.error("Error: " + xhr.status);
			}
		}
	};
	sess_id = document.getElementById('stick').value;
	addons = '';
	if (document.getElementById('addon_selected')) {
		addons = document.getElementById('addon_selected').value;
	}
	pieces = 1;
	pid = 'cnt_' + prodid;
	if (document.getElementById(pid)) {
		pieces = document.getElementById(pid).value;
	}
	sbp_id = 'pcs_sel_' + prodid;
	if (document.getElementById(sbp_id)) {
		pieces = document.getElementById(sbp_id).value;
	}
	sbp_id2 = 'multi_pcs_' + prodid;
	if (document.getElementById(sbp_id2)) {
		pieces = document.getElementById(sbp_id2).value;
	}
	custid = document.getElementById('custid').value;
	botcl = '';
	if (document.getElementById('botcl')) {
		botcl = document.getElementById('botcl').value;
	}
	type = p_type;
	data = "prodid=" + encodeURIComponent(prodid) +
						 "&sess_id=" + encodeURIComponent(sess_id) +
						 "&addons=" + encodeURIComponent(addons) +
						 "&pieces=" + encodeURIComponent(pieces) +
		         "&custid=" + encodeURIComponent(custid) +
						 "&botcl=" + encodeURIComponent(botcl) +
		         "&mobile=" + encodeURIComponent(mobile) +
						 "&type=" + encodeURIComponent(type);
	//console.log(data);
	xhr.send(data);
}

function flyToCartDesk(prodid) {
	const $from = $('#add_to_cart_' + prodid);
	const $to = $('#cart_bl');
	if ($from.length && $to.length) {
		$from.effect('transfer', {
			to: $to,
			className: 'fly1'
		}, 800);
	}
}

function enableDropDowns(prodid) {
	if (document.getElementById("multi_pcs_" + prodid)) {
		document.getElementById("multi_pcs_" + prodid).disabled = false;
	}
	if (document.getElementById("cnt_" + prodid)) {
		document.getElementById("cnt_" + prodid).disabled = false;
	}
}

function UpdateUSD_Total(cart_total_usd) {
	// usd_total
	if (document.getElementById('usd_total')) {
		document.getElementById('usd_total').innerHTML = cart_total_usd;
	}
}

function disableDropDowns(prodid) {
	if (document.getElementById("multi_pcs_" + prodid)) {
		document.getElementById("multi_pcs_" + prodid).disabled = true;
	}
	if (document.getElementById("cnt_" + prodid)) {
		document.getElementById("cnt_" + prodid).disabled = true;
	}
}

function ShowInCartTXT(pieces) {
	if (document.getElementById('incart')) {
		document.getElementById('incart').style.display = 'block';
	}
	if (document.getElementById('pcs_incart')) {
		document.getElementById('pcs_incart').innerHTML = pieces;
	}
}

function UpdateDropDownSBP(pieces, prodid) {
	if (document.getElementById("pcs_sel_" + prodid)) {
		var dropdown = document.getElementById("pcs_sel_" + prodid);
		dropdown.selectedIndex = 0;
	}
}

function UpdateCartButton_ByPiece(prodid) {
	bid = 'add_to_cart_' + prodid;
	if (document.getElementById(bid)) {
		document.getElementById(bid).style.display = 'none';
	}
	bird = 'remove_from_cart_' + prodid;
	if (document.getElementById(bird)) {
		document.getElementById(bird).style.display = 'inline-block';
	}
}

function flyToCart_Mobile(prodid) {
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
			$('#mcart').delay(700).effect('shake', {
				direction: 'down',
				times: 1,
				distance: 4
			}, 800);
		});
	}
}

function updateCartCount(count) {
	document.querySelectorAll('.cart-count').forEach(function(el) {
		if (count && count > 0) {
			el.innerHTML = count;
			el.style.display = '';
			el.classList.add('cc_loaded');
		} else {
			el.innerHTML = '';
			el.style.display = 'none';
			el.classList.remove('cc_loaded');
		}
	});
}

function UpdateTXT(pieces, prodid) {
	txt_id = 'icrt_' + prodid;
	if (document.getElementById(txt_id)) {
		document.getElementById(txt_id).style.display = 'inline-block';
		document.getElementById(txt_id).innerHTML = pieces + ' in Cart';
	}
}

function flyToCheckout_cat(prodid) {
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

function UpdateCartButton_C(prodid) {
	bid = 'add_to_cart_' + prodid;
	if (document.getElementById(bid)) {
		document.getElementById(bid).style.display = 'none';
	}
	bird = 'remove_from_cart_' + prodid;
	if (document.getElementById(bird)) {
		document.getElementById(bird).style.display = 'inline-block';
	}
}


function AdjustView(prodid) {
	pid = 'cnt_' + prodid;
	pieces = 1;
	if (document.getElementById(pid)) {
		pieces = document.getElementById(pid).value;
	}
	if (document.getElementById('incrt_' + prodid)) {
		document.getElementById('incrt_' + prodid).style.display = 'inline-block';
		if (document.getElementById('pcs_incart')) {
			document.getElementById('pcs_incart').innerHTML = pieces;
		}
	}
}

function ChangeButtonAdd(prodid) {
	document.getElementById('add_to_cart_' + prodid).style.display = 'none';
	document.getElementById('remove_from_cart_' + prodid).style.display = 'block';
}

function UpdateCart_Desktop(count) {
	if (document.getElementById('cart-count-desktop')) {
		document.getElementById('cart-count-desktop').style.display = 'block';
		document.getElementById('cart-count-desktop').innerHTML = count;
		$('#cart-count').addClass('cc_loaded');
		if (document.getElementById('cart_bl')) {
			document.getElementById('cart-count-desktop').style.color = 'white';
		} else {
			document.getElementById('cart-count-desktop').style.color = 'green';
		}
	}
	if (document.getElementById('cart-tr')) {
		$("#cart-tr").removeClass("car").addClass("car_2");
	}
	if (document.getElementById('c_txt')) {
		document.getElementById('c_txt').style.color = 'white';
		document.getElementById('c_txt').style.backgroundColor = 'green';
	}
	if (document.getElementById('c_txt_2')) {
		document.getElementById('c_txt_2').style.color = 'white';
		document.getElementById('c_txt_2').style.backgroundColor = 'green';
	}
}

function delProd(prodid, p_type, mobile) {
	showForm('timer', 'timer-inner');
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/delete-from-cart.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'success') {
					if (mobile == 1) {
						if (response.cart_total_usd > 0) {
							UpdateUSD_Total(response.cart_total_usd);
						}
					}
					//console.log("Success: " + response.message);
					if (p_type == 'cart_page' && mobile == 0 || p_type == 'cart_page' && mobile == 1) {
						if (mobile == 1) {
							sessionStorage.setItem('scrollToTop', '1');
						}
						location.reload();
					}
					if (p_type == 'category_page' && mobile == 1) {
						if (response.item_type == 'single_item' || response.item_type == 'group_item' || response.item_type == 'sbp_item') {
							hideForm('timer', 'timer-inner');
							UpdateCartButtons_mobile(response.count, prodid);
							ResetDropDowmAndTXT(prodid);
							enableDropDowns(prodid);
						}
					}
					if (p_type == 'category_page' && mobile == 0) {
						if (response.item_type == 'single_item' || response.item_type == 'group_item' || response.item_type == 'sbp_item') {
							hideForm('timer', 'timer-inner');
							UpdateOnPageStyles_single(response.count, prodid);
							enableDropDowns(prodid);
						}
					}
					if (p_type == 'prod_detail_page' && mobile == 1) {
						hideForm('timer', 'timer-inner');
						UpdateCartButtons_mobile(response.count, prodid);
						ResetDropDowmAndTXT(prodid);
						HideInCartTXT();
						ResetDropDowmAndTXT(prodid);
						enableDropDowns(prodid);
					}
					if (p_type == 'prod_detail_page' && mobile == 0) {
						ChangeButtonDel(prodid);
						hideForm('timer', 'timer-inner');
						var gid = 'cnt_' + prodid;
						if (document.getElementById(gid)) {
							document.getElementById(gid).value = 1;
						}
						updateCartCount(response.count);
						ResetDropDowmAndTXT(prodid);
						HideInCartTXT();
						enableDropDowns(prodid);
					}
				} else {
					console.error("Error: " + response.message);
				}
			} else {
				// Optionally, display an error message to the user
			}
		}
	};
	var sess_id = document.getElementById('stick').value;
	var type = "cart_page_delete";
	var data = "prodid=" + encodeURIComponent(prodid) +
						 "&sess_id=" + encodeURIComponent(sess_id) +
						 "&type=" + encodeURIComponent(type);
	xhr.send(data);
}

function HideInCartTXT() {
	if (document.getElementById('incart')) {
		document.getElementById('incart').style.display = 'none';
	}
}

function ResetDropDowmAndTXT(prodid) {
	if (document.getElementById('icrt_' + prodid)) {
		if (document.getElementById('icrt_' + prodid)) {
			document.getElementById('icrt_' + prodid).style.display = 'none';
		}
	}
	if (document.getElementById("multi_pcs_" + prodid)) {
		dropdown = document.getElementById("multi_pcs_" + prodid);
		dropdown.selectedIndex = 0;
	}
	if (document.getElementById("pcs_sel_" + prodid)) {
		dropdown = document.getElementById("pcs_sel_" + prodid);
		dropdown.selectedIndex = 0;
	}
	if (document.getElementById("cnt_" + prodid)) {
		dropdown = document.getElementById("cnt_" + prodid);
		dropdown.selectedIndex = 0;
	}
}

function UpdateCartButtons_mobile(count, prodid) {
	if (count == 0) {
		if (document.getElementById('cimgm')) {
			$("#cimgm").removeClass("m_ca_img_in").addClass("m_ca_img");
		}
		if (document.getElementById('cart_td')) {
			document.getElementById('cart_td').style.color = 'white';
		}
		document.getElementById('cart-count-mobile').innerHTML = '';
		document.getElementById('cart-count-mobile').style.display = 'none';
		document.getElementById('remove_from_cart_' + prodid).style.display = 'none';
		document.getElementById('add_to_cart_' + prodid).style.display = 'block';
	}
	if (count > 0) {
		if (document.getElementById('cart_td')) {
			document.getElementById('cart_td').style.color = '#99FF00';
		}
		document.getElementById('cart-count-mobile').innerHTML = count;
		$('#cart-count').addClass('cc_loaded');
		document.getElementById('remove_from_cart_' + prodid).style.display = 'none';
		document.getElementById('add_to_cart_' + prodid).style.display = 'block';
	}
}

function SelDrop(event) {
	if (event) {
		event.stopPropagation();
	}
}

function UpdateOnPageStyles_single(count, prodid) {
	if (count == 0) {
		// reset to original state
		$("#cart-tr").removeClass("car_2").addClass("car");
		if (document.getElementById('c_txt')) {
			document.getElementById('c_txt').style.color = '#555555';
			document.getElementById('c_txt').style.backgroundColor = 'white';
		}
		if (document.getElementById('c_txt_2')) {
			document.getElementById('c_txt_2').style.color = '#555555';
			document.getElementById('c_txt_2').style.backgroundColor = 'white';
		}
		if (document.getElementById('cart-count-desktop')) {
			document.getElementById('cart-count-desktop').innerHTML = '';
			document.getElementById('cart-count-desktop').style.display = 'none';
		}
		if (document.getElementById('cart-count-mobile')) {
			document.getElementById('cart-count-mobile').innerHTML = '';
			document.getElementById('cart-count-mobile').style.display = 'none';
		}
		
		document.getElementById('remove_from_cart_' + prodid).style.display = 'none';
		document.getElementById('add_to_cart_' + prodid).style.display = 'block';
		if (document.getElementById('icrt_' + prodid)) {
			document.getElementById('icrt_' + prodid).style.display = 'none';
			var dropdown = document.getElementById("multi_pcs_" + prodid);
			dropdown.selectedIndex = 0;
		}
	}
	if (count > 0) {
		if (document.getElementById('cart-count-desktop')) {
			document.getElementById('cart-count-desktop').innerHTML = count;
		}
		if (document.getElementById('cart-count-mobile')) {
			document.getElementById('cart-count-mobile').innerHTML = count;
		}
		$('#cart-count-desktop').addClass('cc_loaded');
		$('#cart-count-mobile').addClass('cc_loaded');
		document.getElementById('remove_from_cart_' + prodid).style.display = 'none';
		document.getElementById('add_to_cart_' + prodid).style.display = 'block';
	}
}

function UpdateOnPageStyles(count, prodid) {
	if (count == 0) {
		// reset to original state
		$("#cart-tr").removeClass("car").addClass("car");
		if (document.getElementById('c_txt')) {
			document.getElementById('c_txt').style.color = '#555555';
			document.getElementById('c_txt').style.backgroundColor = 'white';
		}
		if (document.getElementById('cart-count-desktop')) {
			document.getElementById('cart-count-desktop').innerHTML = '';
			document.getElementById('cart-count-desktop').style.display = 'none';
		}
		if (document.getElementById('cart-count-mobile')) {
			document.getElementById('cart-count-mobile').innerHTML = '';
			document.getElementById('cart-count-mobile').style.display = 'none';
		}
		document.getElementById('remove_from_cart_' + prodid).style.display = 'none';
		document.getElementById('add_to_cart_' + prodid).style.display = 'block';
		if (document.getElementById('icrt_' + prodid)) {
			document.getElementById('icrt_' + prodid).style.display = 'none';
			var dropdown = document.getElementById("multi_pcs_" + prodid);
			dropdown.selectedIndex = 0;
		}
	}
	if (count > 0) {
		$("#cart-tr").removeClass("car").addClass("car_2");
		if (document.getElementById('c_txt')) {
			document.getElementById('c_txt').style.color = 'white';
			document.getElementById('c_txt').style.backgroundColor = 'green';
		}
		if (document.getElementById('icrt_' + prodid)) {
			document.getElementById('icrt_' + prodid).style.display = 'inline-block';
			if (document.getElementById('cart-count-desktop')) {
				document.getElementById('cart-count-desktop').style.display = 'block';
				document.getElementById('cart-count-desktop').innerHTML = count;
			}
			if (document.getElementById('cart-count-mobile')) {
				document.getElementById('cart-count-mobile').style.display = 'block';
				document.getElementById('cart-count-mobile').innerHTML = count;
			}
			$('#cart-count-desktop').addClass('cc_loaded');
			$('#cart-count-mobile').addClass('cc_loaded');
		}
	}
}

function ChangeButtonDel(prodid) {
	document.getElementById('add_to_cart_' + prodid).style.display = 'block';
	document.getElementById('remove_from_cart_' + prodid).style.display = 'none';
}

function ChangeCountCart(val,prodid) {
	eid = 'cnt_' + prodid;
	if (document.getElementById(eid)) {
		m_id = 'max_' + prodid;
		max_val = (document.getElementById(m_id).innerHTML * 1);
		curr_val = (document.getElementById(eid).value * 1);
		if (val == 'inc') {
			if ((curr_val) < max_val) {
				showForm('timer', 'timer-inner');
				pieces = curr_val + 1;
				document.getElementById(eid).value = pieces;
				AddRemoveGroup(prodid, 'cart_add', pieces);
			}
		}
		if (val == 'deg') {
			if (curr_val > 1) {
				showForm('timer', 'timer-inner');
				pieces = curr_val - 1;
				document.getElementById(eid).value = pieces;
				RemoveGroup(prodid, 'cart_remove', pieces);
			}
		}
	}
}

function RemoveGroup(prodid, type, pieces) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/delete-from-cart.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'success') {
					//console.log("Success: " + response.message);
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
	var addons = '';
	if (document.getElementById('addon_selected')) {
		addons = document.getElementById('addon_selected').value;
	}
	var pid = 'cnt_' + prodid;
	var data = "prodid=" + encodeURIComponent(prodid) +
						 "&sess_id=" + encodeURIComponent(sess_id) +
						 "&addons=" + encodeURIComponent(addons) +
						 "&pieces=" + encodeURIComponent(pieces) +
						 "&type=" + encodeURIComponent(type);
	//console.log(data);
	xhr.send(data);
}

function AddRemoveGroup(prodid, type, pieces) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/add-to-cart.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'success') {
					//console.log("Success: " + response.message);
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
	var addons = '';
	if (document.getElementById('addon_selected')) {
		addons = document.getElementById('addon_selected').value;
	}
	var mobile = document.getElementById('mobile_phone').value;
	var pid = 'cnt_' + prodid;
	var data = "prodid=" + encodeURIComponent(prodid) +
						 "&sess_id=" + encodeURIComponent(sess_id) +
						 "&addons=" + encodeURIComponent(addons) +
						 "&pieces=" + encodeURIComponent(pieces) +
		         "&mobile=" + encodeURIComponent(mobile) +
						 "&type=" + encodeURIComponent(type);
	//console.log(data);
	xhr.send(data);
}

function flyToCheckoutDesk(prodid) {
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

/* checkout page */
function CA_Check(eid) {
	if (document.getElementById(eid)) {
		var value = document.getElementById(eid).value;
		if (value == '') {
			value = ' ';
		}
	}
	if (value != '') {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/cart/inc/validate-input.php", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var response = JSON.parse(xhr.responseText);
					if (response.status === 'success') {
						//console.log("Success 1: " + response.message);
						UnSelectErr(eid);
						if (eid != 'country' && eid != 'custtype') {
							eid_lbl = 'lbl_' + eid;
							$('#' + eid_lbl).removeClass("lbl_nor").addClass("lbl_sel2");
							document.getElementById(eid_lbl).style.color = "green";
						}
						handleFocus(eid);
					} else {
						if (type != 'address2' && type != 'country' && type != 'custtype') {
							console.log("Error: " + response.message);
							SelectErr(eid, response.message);
						}
					}
				} else {
					console.log("Error: " + response.message);
				}
			}
		};
		var type = eid;
		var sess_id = document.getElementById('stick').value;
		var language = document.getElementById('lang_selected').value;
		var data = "sess_id=" + encodeURIComponent(sess_id) +
							 "&input=" + encodeURIComponent(value) + 
							 "&type=" + encodeURIComponent(type) +
							 "&language=" + encodeURIComponent(language);
		//console.log(data);
		xhr.send(data);
	} else {
		SelectErr(eid, response.message);
	}
}

function handleFocus(eid) {
	document.getElementById(eid).style.borderColor = '#00796b'; // Darker border color on focus
}

function SelectErr(eid, message) {
	err = eid + '_err';
	if (document.getElementById(err)) {
		document.getElementById(err).style.display = 'block';
		if (message != '') {
			document.getElementById(err).innerHTML = message;
		}
	}
	document.getElementById(eid).style.borderColor = "#CC0000";
	label_id = 'lbl_' + eid;
	document.getElementById(label_id).style.color = "#CC0000";
}
function UnSelectErr(eid) {
	err = eid + '_err';
	if (document.getElementById(err)) {
		document.getElementById(err).style.display = 'none';
	}
	document.getElementById(eid).style.borderColor = "#008009";
}

// Function to be triggered on blur
function handleBlur(event) {
	//console.log("Input field lost focus: " + event.target.id);
	if (!document.querySelector('.checkout-mobile')) {
		CA_Check(this.id);
	}
}

function handleClickOrFocus(event) {
	//console.log("Input field clicked or focused: " + event.target.id);
	eid = 'lbl_' + event.target.id;
	$('#' + eid).removeClass("lbl_nor").addClass("lbl_sel2");
}

window.onload = function() {
	if (document.getElementById('firstname')) {
		val = document.getElementById('firstname').value;
		//console.log(val);
		if (val != '') {
			SetLabelsGreen();
		}
	}

	const inputFields = document.querySelectorAll('.ca_inputs');
	inputFields.forEach(function(inputField) {
		inputField.addEventListener('blur', handleBlur);
		inputField.addEventListener('click', handleClickOrFocus);
		inputField.addEventListener('input', function(event) {
			const inputValue = event.target.value;
			// Check if the input has exactly 3 characters
			//console.log(event.target.id);
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
};

$(document).ready(function() {
	$('input').each(function() {
		const input = this;
		const observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
					$(input).trigger('autofill');
				}
			});
		});
		observer.observe(input, {
			attributes: true,
			attributeFilter: ['value']
		});
	});
});

$('input').on('autofill', function() {
   //console.log('Autofill detected in:', this);
});

function SelPayOpt(id,event) {
	var chtxt = document.getElementsByClassName("chrtxt");
	for (var i = 0; i < chtxt.length; i++) {
		chtxt[i].style.display = 'none';
	}
	const isChecked = document.getElementById('check_' + id).checked;
	// reset selected class, set class on selected item
	var n = document.getElementsByClassName("payopt_sel");
	for (var z = 0; z < n.length; z++) {
		n[z].classList.replace("payopt_sel", "payopt");
	}
	bgc = document.getElementsByClassName("pbox");
	for (var x = 0; x < bgc.length; x++) {
		bgc[x].style.backgroundColor = "";
	}
	op_id = 'opt_'+id;
	document.getElementById(op_id).style.backgroundColor = "#e6f7ff";
	if (isChecked) {
		// if Alipay or WeChat, show text and THB charge Amount
		if (id == 11 || id == 12) {
			if (document.getElementById('charge_txt_'+id)) {
				document.getElementById('charge_txt_'+id).style.display = 'block';
			}
		}
		$("#opt_" + id).removeClass("payopt").addClass("payopt_sel");
	} else {
		document.getElementById('check_' + id).checked = true;
		$("#opt_" + id).removeClass("payopt").addClass("payopt_sel");
		// if Alipay or WeChat, show text and THB charge Amount
		if (id == 11 || id == 12) {
			if (document.getElementById('charge_txt_'+id)) {
				document.getElementById('charge_txt_'+id).style.display = 'block';
			}
		}
	}
}

// Attach the onChange event directly with an anonymous function
if (document.getElementById('custtype')) {
	document.getElementById('custtype').onchange = function(event) {
		var selectedValue = event.target.value;
		if (selectedValue != 0) {
			eid_lbl = 'lbl_custtype';
			$('#' + eid_lbl).removeClass("lbl_nor").addClass("lbl_sel2");
			document.getElementById('lbl_custtype').style.color = 'green';
			document.getElementById('custtype').style.borderColor = "rgb(0, 121, 107)";
			document.getElementById('custtype_err').style.display = 'none';
		}
		if (selectedValue == 0) {
			$('#' + eid_lbl).removeClass("lbl_nor").addClass("lbl_sel3");
		}
	};
}

if (document.querySelector('.checkout-mobile')) {
	const country = document.getElementById('checkout_country');
	const state   = document.getElementById('checkout_state');
	if (country) {
		function updateStateDropdown() {
			const selectedValue = country.value;
			if (selectedValue != 0) {
				GetDropDownNew(selectedValue);
			}
		}
		// User changes country: always update state dropdown
		country.addEventListener('change', updateStateDropdown);
		// Page load: only update if checkout_state is empty
		if (!state || state.value.trim() === '' || state.value === '0') {
			updateStateDropdown();
		}
	}
}

function GetDropDownNew(selectedValue) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/get-state-drop-down.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				//console.log(xhr.responseText);
				var response;
				try {
					response = JSON.parse(xhr.responseText);
				} catch (e) {
					console.error("Invalid JSON returned:", xhr.responseText);
					alert("Invalid JSON returned:\n" + xhr.responseText);
					return;
				}

				if (response.status === 'success') {
					if (document.getElementById('checkout_state_inp')) {
						document.getElementById('checkout_state_inp').innerHTML = response.html;
					}
				}
			}
		}
	};
	var sess_id = document.getElementById('stick').value;
	var type = 'state_dropdown';
	var data = "selectedValue=" + encodeURIComponent(selectedValue) +
						 "&sess_id=" + encodeURIComponent(sess_id) +
						 "&type=" + encodeURIComponent(type);
	xhr.send(data);
}

function GetDropDown(selectedValue) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/get-state-dropdown.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'success') {
					if (document.getElementById('state_inp')) {
						document.getElementById('state_inp').innerHTML = response.html;
					}
				} else {
					console.error("Error: " + response.message);
				}
			} else {
				console.error("Error: " + xhr.status);
			}
		}
	};
	var sess_id = document.getElementById('stick').value;
	var type = 'state_dropdown';
	var data = "selectedValue=" + encodeURIComponent(selectedValue) +
						 "&sess_id=" + encodeURIComponent(sess_id) +
						 "&type=" + encodeURIComponent(type);
	xhr.send(data);
}

if (document.getElementById('checkout-form')) {
	var form_ca = document.getElementById('checkout-form');
	form_ca.addEventListener('submit', function(event) {
		// Prevent the default form submission
		event.preventDefault();

		// validate state-dropdown only
		if (document.getElementById('state')) {
			sval = document.getElementById('state').value;
			if (sval == '0') {
				JSmessage('Please select a state/province');
				document.getElementById('state').focus();
				return;
			}
		}
		showForm('timer', 'timer-inner');
		// Create a new FormData object to collect all the form's data
		var formData = new FormData(form_ca);
		// Add more form data (additional key-value pairs)
		sess_id = document.getElementById('stick').value;
		formData.append('sess_id', sess_id);
		formData.append('job', 'ca_page');
		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/cart/pay-gateway_v3.php', true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
        if (xhr.status === 200) {
					var response = JSON.parse(xhr.responseText);
					if (response.status === 'success') {
						if (response.validation === 0) {
							hideForm('timer', 'timer-inner');
							JSmessage(response.message);
							return;
						}
						// PayPal OK
						if (response.ValidateAndCheckout == 4) {
							//window.open(response.url, '_self');
							window.location.href = response.url;
						}
						// PayPal failure code: 5
						if (response.ValidateAndCheckout == 5) {
							hideForm('timer', 'timer-inner');
							JSmessage('The PayPal checkout did not complete! Please choose another option or try again later.');
						}
						// PayPal failure code: 9
						if (response.ValidateAndCheckout == 9) {
							hideForm('timer', 'timer-inner');
							JSmessage('CITY, ZIP-CODE or STATE is not correct, Please verify!');
						}
						// PayPal failure code: 10
						if (response.ValidateAndCheckout == 10) {
							hideForm('timer', 'timer-inner');
							JSmessage('POSTAL CODE IS INVALID, Please verify');
						}
						// PayPal failure code: 11
						if (response.ValidateAndCheckout == 11) {
							hideForm('timer', 'timer-inner');
							JSmessage('STATE IS INVALID, Please verify');
						}
						// PayPal failure code: 12
						if (response.ValidateAndCheckout == 12) {
							hideForm('timer', 'timer-inner');
							JSmessage('The instrument presented was either declined by the processor or bank, or it cannot be used for this payment.');
						}
						// PayPal failure code: 13
						if (response.ValidateAndCheckout == 13) {
							hideForm('timer', 'timer-inner');
							JSmessage("Phone number must be in this format: optional leading '+' followed by [0-9], spaces, hyphens, periods, and matching parentheses (not nested)");
						}
						// PayPal failure code: 14
						if (response.ValidateAndCheckout == 14) {
							hideForm('timer', 'timer-inner');
							JSmessage("Payment Amount cannot be zero, please check the cart and try again.");
						}
						// Alipay Ok
						if (response.alipay == 1) {
							const url = response.redirect_url;
							window.location.href = url;
							return;
						}
						// Wechat Ok
						if (response.wechat == 1) {
							hideForm('timer', 'timer-inner');
							const id_wechat = response.id_wechat;
							const amount = response.amount;
							const amount_thb = response.charge_amount;
							const qrImageBase64 = response.image_with_base64;
							const orderid = response.orderid;

							// Display the QR code image
							document.getElementById('weqr-div').style.display = 'block';
							document.getElementById('weqr-cont').style.display = 'block';
							const qrContainer = document.getElementById('qrCodeContainer');
							qrContainer.innerHTML = `<img src="data:image/png;base64,${qrImageBase64}" alt="QR Code for Payment">`;
							// Display the amount
							document.getElementById('amountDisplay').textContent = `${amount}`;
							document.getElementById('charge_amount').textContent = `${amount_thb}`;
							// start checking for "Authorized" flag in DB
							if (CheckAuthorized(orderid)) {
								//alert(orderid);
							}
						}

						// WesternUnion
						if (response.ValidateAndCheckout == 6) {
							//window.open(response.url, '_self');
							window.location.href = response.url;
						}
						// Kpayment Ok
						if (response.k_payment == 1) {
							hideForm('timer', 'timer-inner');
							document.querySelector(".pay-button").click();
						}
					}

				} else if (xhr.readyState === 4) {
					console.error('Form submission failed:', xhr.statusText);
				}
			}
		};
		//console.log('SEND clicked – timestamp:', performance.now());
		const clientClickTimeSeconds = Date.now() / 1000;
		formData.append('client_click_timestamp', clientClickTimeSeconds);
		xhr.send(formData);
	});
}

// new mobile checkout on cust-address page
function SubmitPayment(method) {
	showForm('timer', 'timer-inner');
	var form_ca = document.getElementById('addressForm');
	var formData = new FormData(form_ca);
	formData.append('sess_id', document.getElementById('stick').value);
	formData.append('job', 'ca_page_mob');
	formData.append('payment_method', method);
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/cart/pay-gateway_v3.php', true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);
			if (response.status === 'success') {
				if (response.alipay == 1) {
					window.location.href = response.redirect_url;
					return;
				}
				if (response.wechat == 1) {
					hideForm('timer', 'timer-inner');
					const qrImageBase64 = response.image_with_base64;
					const amount = response.amount;
					const amount_thb = response.charge_amount;
					const orderid = response.orderid;
					document.getElementById('weqr-div').style.display = 'block';
					document.getElementById('weqr-cont').style.display = 'block';
					document.getElementById('qrCodeContainer').innerHTML =
							`<img src="data:image/png;base64,${qrImageBase64}" alt="">`;
					document.getElementById('amountDisplay').textContent = amount;
					document.getElementById('charge_amount').textContent = amount_thb;
					CheckAuthorized(orderid);
					return;
				}
				if (response.ValidateAndCheckout == 6) {
					window.location.href = response.url;
					return;
				}
				// Kpayment Ok
				if (response.k_payment == 1) {
					hideForm('timer', 'timer-inner');
					setTimeout(function () {
						const payButton = document.querySelector('#k_pay_form .pay-button');
						if (payButton) {
							payButton.click();
						}
					}, 100);
				}
			}
		} else if (xhr.readyState === 4) {
			hideForm('timer', 'timer-inner');
			console.error(xhr.statusText);
		}
	};
	formData.append('client_click_timestamp', Date.now() / 1000);
	xhr.send(formData);
}
// end new mobile checkout on cust-address page

function CheckAuthorized(orderid) {
	console.log(orderid);
	const orderId = orderid;
    const checkInterval = 2000; // Poll every 2 seconds
    const maxAttempts = 30; // Stop after ~60 seconds
    let attempts = 0;

		checkPaymentStatus();

    function checkPaymentStatus() {
        fetch('/cart/check-payment-status.php?orderid=' + encodeURIComponent(orderId), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
					console.log(data.status);
            if (data.status === 'Authorized') {
                // Redirect to confirmation page
                //window.location.href = 'https://www.gemselect.com/cart/payment-complete_new.php?orderid=' + encodeURIComponent(orderId);
								// Create a hidden form for POST request
								const form = document.createElement('form');
								form.method = 'POST';
								form.action = 'https://www.gemselect.com/cart/payment-complete_new.php';
								form.style.display = 'none'; // Hide the form

								// Add orderid as a hidden input
								const input = document.createElement('input');
								input.type = 'hidden';
								input.name = 'orderid';
								input.value = orderId;
								form.appendChild(input);

								// Append form to document and submit
								document.body.appendChild(form);
								form.submit();
            } else if (data.status === 'failed' || data.status === 'voided') {
                // Handle failure
								// show message
								//alert('FAILED');
                //window.location.href = 'https://www.gemselect.com/cart/payment-failed.php';
            } else if (attempts < maxAttempts) {
                // Continue polling
                attempts++;
                setTimeout(checkPaymentStatus, checkInterval);
            } else {
                // Timeout
								//alert('Timed Out');
                //window.location.href = 'https://www.gemselect.com/cart/payment-failed.php?timeout=true';
            }
        })
        .catch(error => {
            console.error('Error checking payment status:', error);
            if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkPaymentStatus, checkInterval);
            } else {
                window.location.href = 'https://www.gemselect.com/cart/payment-failed.php?timeout=true';
            }
        });
    }
}

// POST to /checkout.php and reload (no iframe)
function postBackToCheckout(payload) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/cart/cust-address.php';        // adjust path if needed
  form.style.display = 'none';

  // Optional: include your CSRF token if you use one
  // addHidden(form, 'csrf', window.CSRF_TOKEN);

  Object.entries(payload).forEach(([k, v]) => addHidden(form, k, String(v)));
  document.body.appendChild(form);
  form.submit();
}

function addHidden(form, name, value) {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  input.value = value;
  form.appendChild(input);
}

function loadPaymentIframe(id_wechat, amount) {
  const iframeUrl = '/cart/inc/wechat-pay.php?data_order_id=' + id_wechat + '&amount=' + amount;
  if (!iframeUrl) return;
  // Same-origin guard
  const u = new URL(iframeUrl, location.origin);
  if (u.origin !== location.origin) {
    console.error('Blocked cross-origin iframe:', u.toString());
    return;
  }
  const host = document.getElementById('pay_host');
  let frame = document.getElementById('kpay_iframe');
  if (!frame) {
    frame = document.createElement('iframe');
    frame.id = 'kpay_iframe';
    frame.name = 'kpay_iframe';
    frame.style.cssText = 'border:0;width:100%;height:520px;display:block;';
    frame.setAttribute('loading', 'eager');
    frame.setAttribute('referrerpolicy', 'origin');
    host.appendChild(frame);
  }
  // Force a fresh run even if URL is identical
  u.searchParams.set('v', Date.now());
  // Clean reload to rerun scripts
  frame.src = 'about:blank';
  frame.src = u.toString();
	document.getElementById("pay_host").style.display = "block";
  frame.onload = () => {
		hideForm('timer', 'timer-inner');
    // When the iframe document is ready, watch for the SDK button becoming available/ready
    tryAutoClickKPay(frame);

  };
	frame.onerror = () => {
    console.error('Failed to load payment iframe.');
  };
}

// --- Helper: wait for the KBank pay button then click it ---
function tryAutoClickKPay(frame) {
  try {
    const doc = frame.contentDocument || frame.contentWindow?.document;
    if (!doc) return;
    const selector = 'button[_kpayment], button.pay-button';
    const clickIfReady = (btn) => {
      if (!btn) return false;
      // Skip while SDK still “processing” or button disabled
      const isProcessing = btn.classList.contains('processing');
      if (!isProcessing && !btn.disabled) {
        btn.click();
        return true;
      }
      return false;
    };
    // Immediate attempt (in case it’s already there & ready)
    if (clickIfReady(doc.querySelector(selector))) return;
    // Observe DOM for the button appearing or becoming ready
    const observer = new MutationObserver(() => {
      const btn = doc.querySelector(selector);
      if (clickIfReady(btn)) observer.disconnect();
    });
    observer.observe(doc, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'disabled']
    });
    // Safety stop after 15s to avoid leaking observers
    setTimeout(() => observer.disconnect(), 15000);
  } catch (err) {
    // Will fail if the iframe navigates cross-origin after load
    console.error('Auto-click failed:', err);
  }
}

function monitorElementVisibility() {
	let wasVisible = false; // Flag to track if element was ever visible
	const interval = setInterval(() => {
		try {
			// Get the iframe document
			const iframe = document.querySelector('iframe');
			if (!iframe) {
				//console.log('Iframe not found');
				return;
			}
			const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
			const element = iframeDoc.getElementById('kpaymentframe');
			// Check if element exists and its visibility
			if (element) {
				const isVisible = element.offsetParent !== null;
				if (isVisible && !wasVisible) {
					wasVisible = true; // Set flag when first visible
					//console.log('kpaymentframe first appeared');
				} else if (isVisible) {
					//console.log('kpaymentframe is visible');
				}
			} else if (wasVisible) {
				// Element not found but was visible before
				//console.log('kpaymentframe disappeared - triggering action');
				triggerAction();
				wasVisible = false; // Reset flag for fresh restart
			} else {
				//console.log('kpaymentframe not found in iframe');
			}
		} catch (e) {
			console.error('Error accessing iframe content:', e);
		}
	}, 700);
	// Function to handle disappearance action
	function triggerAction() {
		// Add your custom action here
		//console.log('Performing action: kpaymentframe is gone');
		document.getElementById("pay_host").style.width = "1px";
		document.getElementById("pay_host").style.height = "ipx";
	}
	// Return function to stop monitoring
  return () => clearInterval(interval);
}
// Start monitoring
//const stopMonitoring = monitorElementVisibility();
// To stop monitoring later, call:
// stopMonitoring();

function SetLabelsGreen() {
	document.querySelectorAll('.lbl_nor').forEach(function(element) {
    element.classList.remove('lbl_nor');
    element.classList.add('lbl_sel');
	});
}

function AddCertCRT(prodid) {
	showForm('timer', 'timer-inner');
	eid = 'certs_' + prodid;
	if (document.getElementById(eid)) {
		cert = document.getElementById(eid).value;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/cart/inc/add-remove-certificates.php", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var response = JSON.parse(xhr.responseText);
					if (response.status === 'success') {
						//console.log("Success: " + response.message);
						location.reload();
					} else {
						hideForm('timer', 'timer-inner');
						console.error("Error: " + response.message);
					}
				} else {
					console.error("Error: " + xhr.status);
					hideForm('timer', 'timer-inner');
				}
			}
		};
		var sess_id = document.getElementById('stick').value;
		var type = 'certificate';
		var data = "prodid=" + encodeURIComponent(prodid) +
							 "&sess_id=" + encodeURIComponent(sess_id) +
							 "&cert=" + encodeURIComponent(cert) +
							 "&type=" + encodeURIComponent(type);
		//console.log(data);
		xhr.send(data);
	}
}

function chekoutNow() {
	furl = 'https://www.gemselect.com/cart/cust-address.php';
	window.open(furl, '_self');
}

// Select all input and select elements with the class "ca_inputs"
const elements = document.querySelectorAll('.ca_inputs');

// Iterate over each element and attach event listeners
elements.forEach(element => {
	element.addEventListener('focus', () => {
		//console.log(`${element.placeholder || element.name} is focused`);

		// Trigger a click on the currently focused element
		element.dispatchEvent(new MouseEvent('click', {
			view: window,
			bubbles: true,
			cancelable: true
		}));
	});

	// Example click event listener for the element
	element.addEventListener('click', () => {
			//console.log(`${element.placeholder || element.name} was clicked!`);
	});
});


function Add_Certificates(prodid, certkey) {
	//console.log(prodid +' == ' + certkey);
	id = 'add_to_cart_' + prodid;
	val = document.getElementById(id).style.display;
	if (val == 'none') {
		hideForm('cert-div', 'cert-cont');
		AddCertCRT_2(prodid, certkey);
	} else {
		hideForm('cert-div', 'cert-cont');
		AddCertCRT_2(prodid, certkey);
		AddProdToCart(prodid, event);
	}
}

function AddCertCRT_2(prodid, certkey) {
	cert = certkey;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/add-remove-certificates.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'success') {
					//console.log("Success: " + response.message);
					//location.reload();
				} else {
					console.error("Error: " + response.message);
				}
			} else {
				console.error("Error: " + xhr.status);
			}
		}
	};

	var sess_id = document.getElementById('stick').value;
	var type = 'certificate';
	var data = "prodid=" + encodeURIComponent(prodid) +
						 "&sess_id=" + encodeURIComponent(sess_id) +
						 "&cert=" + encodeURIComponent(cert) +
						 "&type=" + encodeURIComponent(type);
	//console.log(data);
	xhr.send(data);
}

function selectCertM(prodid, certkey, e) {
	if (e.target == '[object HTMLInputElement]' || e.srcElement == '[object HTMLInputElement]') {
		// do nothing
	} else {
		document.getElementById(certkey).checked = true;
	}
	document.getElementById('addon_selected').value = certkey;
	AddCertCRT_2(prodid, certkey);
}

function Remove_Certificates(prodid, certkey) {
	//console.log(prodid +' == ' + certkey);

	AddCertCRT_2(prodid, 0);
	hideForm('cert-div', 'cert-cont');

}

function CRTcountMob() {
	var stick = document.getElementById('stick');
	if (!stick) {
		console.error("Element #stick not found");
		return;
	}
	var sess_id = stick.value;
	var type = 'crt_count';
	var data = "sess_id=" + encodeURIComponent(sess_id) +
			   "&type=" + encodeURIComponent(type);
	//console.log("POST data:", data);

	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/crt_count.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			//console.log("HTTP status:", xhr.status);
			//console.log("Raw response:", xhr.responseText);
			if (xhr.status === 200) {
				try {
					var response = JSON.parse(xhr.responseText);
					if (response.status === 'success') {
						UpdateView(response.count, response.cart_total);
					} else {
						console.error("PHP error:", response.message);
					}
				} catch (e) {
					console.error("Invalid JSON response:", xhr.responseText);
				}
			} else {
				console.error("Request failed:", xhr.status);
			}
		}
	};
	xhr.send(data);
}
/*
function CRTcountMob() {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/crt_count.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'success') {
					//console.log("Success: " + response.message);
					//console.log("Count: " + response.count);
					console.log("cart_total: " + response.cart_total);
					console.log("cart_count: " + response.cart_count);
					UpdateView(response.count);
				} else {
					console.error("Error: " + response.message);
				}
			} else {
				console.error("Error: " + xhr.status);
			}
		}
	};
	var sess_id = document.getElementById('stick').value;
	var type = 'crt_count';
	var data = "&sess_id=" + encodeURIComponent(sess_id) +
						 "&type=" + encodeURIComponent(type);
	console.log(data);
	xhr.send(data);
}
*/

function UpdateView(count, cart_total) {
	if (count > 0) {
		$('#cimgm').removeClass("m_ca_img").addClass("m_ca_img_in");
		if (document.getElementById('cart_td')) {
			document.getElementById('cart_td').style.color = '#99FF00';
		}
		if (document.getElementById('cart-count')) {
			document.getElementById('cart-count').innerHTML = count;
			$('#cart-count').addClass('cc_loaded');
		}
		// show mobile sticky checkout button
		// exclude certain pages
		let current_url  = window.location.href;
		if (current_url.includes('/cart/')) {
			// do nothing
		} else {
			if (document.getElementById('usd_total')) {
				document.getElementById('usd_total').innerHTML = cart_total;
			}
			if (document.querySelector('.mobile-checkout-sticky')) {
				document.querySelector('.mobile-checkout-sticky').style.display = 'block';
			}
		}
	} else {
		if (document.getElementById('cart-count')) {
			document.getElementById('cart-count').innerHTML = '';
		}
		// hide mobile sticky checkout button
		if (document.querySelector('.mobile-checkout-sticky')) {
			document.querySelector('.mobile-checkout-sticky').style.display = 'none';
		}
	}
}

function CheckoutNow() {
	sess_id = document.getElementById('stick').value;
	lang = document.getElementById('lang_selected').value;
	lang_lower = lang.toLowerCase();
	domain_name = document.getElementById('domain_name').value;
	const data = {
    sess_change: sess_id,
    stick_lang: lang
	};
	const form = document.createElement('form');
	form.method = 'POST';
	if (domain_name == 'www.gemselect.com') {
		form.action = 'https://www.gemselect.com/cart/cust-address.php';
	} else {
		form.action = 'https://'+domain_name+'/'+lang_lower+'/cart/cust-address.php';
	}

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

function Checkout_CP() {
	try {
		if (document.getElementById('state')) {
			const sval = document.getElementById('state').value;
			if (sval === '0') {
				JSmessage('Please select a state/province');
				document.getElementById('state').focus();
				return;
			}
		}
		const selectedOption = document.querySelector('input[name="pay_option"]:checked');
		if (!selectedOption) {
			JSmessage('Please select a payment option');
			return;
		}
		showForm('timer', 'timer-inner');
		const data = {
			sess_id: document.getElementById('stick').value,
			firstname: document.getElementById('firstname').value,
			lastname: document.getElementById('lastname').value,
			email2: document.getElementById('email2').value,
			phone: document.getElementById('phone').value,
			address1: document.getElementById('address1').value,
			address2: document.getElementById('address2').value,
			city: document.getElementById('city').value,
			zip: document.getElementById('zip').value,
			country: document.getElementById('country').value,
			state: document.getElementById('state').value,
			pay_option: selectedOption.value,
			job: 'ca_page',
			func: 'Checkout_CP'
		};
		const formData = new URLSearchParams();
		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				formData.append(key, data[key]);
			}
		}
		const url = 'https://www.gemselect.com/cart/pay-gateway_v3.php';
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: formData.toString()
		})
		.then(response => {
			if (response.ok) {
				return response.text(); // Handle response as text
			} else {
				throw new Error('Network response was not ok');
			}
		})
		.then(responseText => {
			//console.log('Raw response text:', responseText);
			try {
				const jsonResponse = JSON.parse(responseText);
				if (jsonResponse.ValidateAndCheckout == 6) {
					window.location.href = jsonResponse.url;
				} else {
					console.log('No redirect URL provided in the response');
				}
			} catch (e) {
				console.error('Error parsing JSON:', e);
				JSmessage('Unexpected response from server.');
			}
		})
		.catch(error => {
			console.error('Fetch error:', error);
			JSmessage('An error occurred while processing your request.');
		});
	} catch (error) {
		console.error('Unexpected error:', error);
		JSmessage('An unexpected error occurred. Please try again.');
	}
}
/* checkout page */

/* create account */
function CreateGSacc() {
	newsletter = 0;
	if (document.getElementById('nlsignup').checked == true) {
		newsletter = 1;
	}
	firstname = document.getElementById('firstname').value;
	if (firstname == '') {
		NoData('firstname');
		JSmessage('Please fill in your first name');
		return;
	}
	lastname = document.getElementById('lastname').value;
	if (lastname == '') {
		NoData('lastname');
		JSmessage('Please fill in your last name');
		return;
	}
	email2 = document.getElementById('email2').value;
	if (email2 == '') {
		NoData('email2');
		JSmessage('Please fill in your email');
		return;
	} else {
		if (!validate_Email(email2)) {
			JSmessage('Please enter a valid email, the format seems not correct');
			return;
		}
	}
	phone = document.getElementById('phone').value;
	if (phone == '') {
		NoData('phone');
		JSmessage('Please fill in your phone number');
		return;
	}
	address1 = document.getElementById('address1').value;
	if (address1 == '') {
		NoData('address1');
		JSmessage('Please fill in your address');
		return;
	}
	address2 = document.getElementById('address2').value;
	city = document.getElementById('city').value;
	if (city == '') {
		NoData('city');
		JSmessage('Please fill in city');
		return;
	}
	zip = document.getElementById('zip').value;
	if (zip == '') {
		NoData('zip');
		JSmessage('Please fill in postal/zip code');
		return;
	}
	country = document.getElementById('country').value;
	if (country == '') {
		NoData('country');
		JSmessage('Please select a country');
		return;
	}
	state = document.getElementById('state').value;
	if (state == '') {
		NoData('state');
		JSmessage('Please fill in state');
		return;
	}
	custtype = document.getElementById('custtype').value;
	if (custtype == '') {
		NoData('custtype');
		JSmessage('Please select a customer type');
		return;
	}
	pwd = document.getElementById('pwd').value;
	password = '';
	if (pwd == '') {
		NoData('pwd');
		JSmessage('Please enter a password');
		return;
	} else {
		// check count
		if (pwd.length > 7) {
			password = pwd;
		} else {
			JSmessage('Password is too short, minimum 8 characters');
			NoData('pwd');
			return;
		}
	}
	if (document.getElementById('policyacc').checked == false) {
		JSmessage('Please agree to our privacy policy');
		document.getElementById('policyacc').focus();
		return;
	}
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/account/account-signup.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'success') {
					if (response.email_exist == 1) {
						document.getElementById('email2').style.border = '2px solid red';
						JSmessage('This email is already in use');
					}
					if (response.refresh == 1) {
						JSmessage('Your account has been created, logging you in now...');
						setTimeout(function() {
							window.open(response.redirect, '_self');
						}, 2500);
					}
				} else {
					console.error("Error: " + response.message);
					SelectErr(response.type, response.message);
				}
			} else {
				console.error("Error: " + xhr.status);
			}
		}
	};
	var sess_id = document.getElementById('stick').value;
	var data = "&sess_id=" + encodeURIComponent(sess_id) +
		"&newsletter=" + encodeURIComponent(newsletter) +
		"&firstname=" + encodeURIComponent(firstname) +
		"&lastname=" + encodeURIComponent(lastname) +
		"&email2=" + encodeURIComponent(email2) +
		"&phone=" + encodeURIComponent(phone) +
		"&address1=" + encodeURIComponent(address1) +
		"&address2=" + encodeURIComponent(address2) +
		"&city=" + encodeURIComponent(city) +
		"&zip=" + encodeURIComponent(zip) +
		"&country=" + encodeURIComponent(country) +
		"&state=" + encodeURIComponent(state) +
		"&pwd=" + encodeURIComponent(password) +
		"&custtype=" + encodeURIComponent(custtype);
	xhr.send(data);
}

function validate_Email(email) {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function NoData(eid) {
	el_id = 'lbl_' + eid;
	$('#' + el_id).removeClass("lbl_nor").addClass("lbl_sel2");
	err_id = eid + '_err';
	document.getElementById('lbl_' + eid).style.color = 'rgb(204, 0, 0)';
	document.getElementById(eid).style.borderColor = 'rgb(204, 0, 0)';
	document.getElementById(err_id).style.display = 'block';
}

function GetCHK(eid) {
	if (document.getElementById(eid).checked == true) {
		document.getElementById(eid).checked = false;
	} else {
		document.getElementById(eid).checked = true;
	}
}
/* END create account */
function CompItem(prodid, event) {
	event.stopPropagation();
	custid = document.getElementById('custid').value;
	mobile = document.getElementById('mobile_phone').value;
	if (custid == 0) {
		openLoginBox();
		return;
	}
	add_wishlist = 0;
	eid = 'comp_' + prodid;
	p_type = document.getElementById('p_type').value;
	if (document.getElementById(eid)) {
		var li = document.getElementById(eid);
		if (li.className == 'comp_heart' || li.className == 'prright') {
			if (p_type == 'prod_detail_page' || p_type == 'category_page') {
				$('#' + eid).removeClass("comp_heart").addClass("comp_heart_sel");
			}
			if (p_type == 'category_page' && mobile == 1) {
				$('#' + eid).removeClass("prright").addClass("prright_sel");
				document.getElementById('wishlist_a').style.backgroundImage="url(/graphics/comp-heart_mg.png)";
			}
			if (mobile == 0) {
				flyToWishList(prodid);
			}
			if (mobile ==1) {
				flyToWishList_M(prodid);
			}
			if (document.getElementById('wish_list')) {
				$('#wish_list').removeClass("wish_list").addClass("wish_list_sel");
			}
			add_wishlist = 1;
		} else {
			if (p_type == 'prod_detail_page') {
				$('#' + eid).removeClass("comp_heart_sel").addClass("comp_heart");
			}
			if (p_type == 'category_page' && mobile == 1) {
				$('#' + eid).removeClass("prright_sel").addClass("prright");
			}
			add_wishlist = 0;
		}
	}
	if (add_wishlist == 1 || add_wishlist == 0) {
		sess_id = document.getElementById('stick').value;
		lang = document.getElementById('lang_selected').value;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/cart/inc/add-to-wishlist.php", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var response = JSON.parse(xhr.responseText);
					if (response.status === 'success') {
						if (response.w_count == 0) {
							if (document.getElementById('wish_list')) {
								$('#wish_list').removeClass("wish_list_sel").addClass("wish_list");
							}
							if (p_type == 'category_page' && mobile == 1) {
								$('#' + eid).removeClass("prright_sel").addClass("prright");
								document.getElementById('wishlist_a').style.backgroundImage="url(/graphics/comp-heart_mw.png)";
							}
						}
					} else {
						console.error("Error: " + response.message);
					}
				} else {
					console.error("Error: " + xhr.status);
				}
			}
		};
		var sess_id = document.getElementById('stick').value;
		var type = 'wishlist';
		var data = "&sess_id=" + encodeURIComponent(sess_id) +
							"&prodid=" + encodeURIComponent(prodid) +
							"&custid=" + encodeURIComponent(custid) +
							"&type=" + encodeURIComponent(type);
		xhr.send(data);
	}
}
function flyToWishList_M(prodid) {
	if (document.getElementById('mobile_site')) {
		if (document.getElementById('wish_ico')) {
			$(document).ready(function() {
				$('#comp_' + prodid).effect('transfer', {
					to: $('#wish_ico'),
					className: 'fly1'
				}, 800);
			});
			$('#wish_ico').addClass("wish_ico_in");
		}
	}
}
function flyToWishList(prodid) {
	if (document.getElementById('wish_ico')) {
		$(document).ready(function() {
			$('#comp_' + prodid).effect('transfer', {
				to: $('#wish_ico'),
				className: 'fly1'
			}, 800);
		});
		$('#wish_ico').addClass("wish_ico_in");
	}
}
function WishList() {
	custid = document.getElementById('custid').value;
	domain = document.getElementById('domain_name').value;
	lang = document.getElementById('lang_selected').value.toLowerCase();
	if (lang != 'english') {
		uri = 'https://' + domain + '/' + lang;
	} else {
		uri = 'https://' + domain;
	}
	if (custid > 0) {
		showForm('timer', 'timer-inner');
		window.open(uri + '/cart/wishlist.php', '_self');
		return;
	} else {
		document.getElementById('wish_page').value = 1;
		ALogin();
		return;
	}
}
function SortWish(event) {
	if (document.getElementById('wish_sel')) {
		sort_by = document.getElementById('wish_sel').value;
		c_uri = window.location.search;
		c_uri = removeURLParameter(c_uri, 'wsort');
		uri_p = document.getElementById('uri_path').value;
		new_uri = '/' + uri_p + '?wsort=' + sort_by;
		if (sort_by == 'default') {
			new_uri = '/' + uri_p;
		}
		showForm('timer', 'timer-inner');
		window.open(new_uri, '_self');
	}
}
function DelFromWhichlist(prodid, event) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/delete-from-wishlist.php", true);
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
	var custid = document.getElementById('custid').value;
	var type = 'del_wishlist';
	var data = "&prodid=" + encodeURIComponent(prodid) +
						 "&custid=" + encodeURIComponent(custid) +
						 "&type=" + encodeURIComponent(type);
	xhr.send(data);
}

function TransferAll() {
	showForm('timer', 'timer-inner');
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/transfer-all.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'success') {
					domain = document.getElementById('domain_name').value;
					lang = document.getElementById('lang_selected').value.toLowerCase();
					uri = 'https://' + domain + '/' + lang;
					window.open(uri + '/cart/cart.php', '_self');
					return;
				} else {
					console.error("Error: " + response.message);
				}
			} else {
				console.error("Error: " + xhr.status);
			}
		}
	};
	var prod_list = document.getElementById('prodlist').value;
	var sess_id = document.getElementById('stick').value;
	var custid = document.getElementById('custid').value;
	var type = 'transfer_all';
	var data = "&prod_list=" + encodeURIComponent(prod_list) +
						 "&custid=" + encodeURIComponent(custid) +
		         "&sess_id=" + encodeURIComponent(sess_id) +
						 "&type=" + encodeURIComponent(type);
	xhr.send(data);
}

function AddProdToCart_WL(prodid,event) {
	showForm('timer', 'timer-inner');
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/avail-check.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'success') {
					if (response.available == 1) {
						hideForm('timer', 'timer-inner');
						AddProdToCart(prodid,event);
					} else {
						hideForm('timer', 'timer-inner');
						JSmessage('This Item is not available anymore');
						return;
					}
				} else {
					console.error("Error: " + response.message);
				}
			} else {
				console.error("Error: " + xhr.status);
			}
		}
	};
	var sess_id = document.getElementById('stick').value;
	var type = 'avail_check';
	var data = "&prodid=" + encodeURIComponent(prodid) +
		         "&sess_id=" + encodeURIComponent(sess_id) +
						 "&type=" + encodeURIComponent(type);
	xhr.send(data);
}

function ALogin_m() {
	//console.log('ALogin started');

	['pwd2_inp','login_div3','login_div1','login_div2'].forEach(function(id) {
		var el = document.getElementById(id);
		//console.log(id, el);
		if (el) el.style.display = 'block';
	});

	var login_div4 = document.getElementById('login_div4');
	//console.log('login_div4', login_div4);
	if (login_div4) login_div4.style.display = 'none';

	var mobilePhoneEl = document.getElementById('mobile_phone');
	var custidEl = document.getElementById('custid');

	//console.log('mobile_phone element:', mobilePhoneEl);
	//console.log('custid element:', custidEl);

	var mobile_phone = mobilePhoneEl ? mobilePhoneEl.value : 0;
	var custid = custidEl ? custidEl.value : 0;

	//console.log('mobile_phone:', mobile_phone);
	//console.log('custid:', custid);

	if (mobile_phone == 1 && typeof hideMForm === 'function') {
		hideMForm();
	}

	if (custid == 0) {
		if (typeof showForm === 'function') {
			showForm('login-div','login-cont');
		} else {
			//console.error('showForm() is missing');
		}
	} else {
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
	}
}

function ALogin() {
	if (document.getElementById('pwd2_inp')) {
		document.getElementById('pwd2_inp').style.display = 'block';
	}
	if (document.getElementById('login_div3')) {
		document.getElementById('login_div3').style.display = 'block';
	}
	if (document.getElementById('login_div1')) {
		document.getElementById('login_div1').style.display = 'block';
	}
	if (document.getElementById('login_div2')) {
		document.getElementById('login_div2').style.display = 'block';
	}
	if (document.getElementById('login_div4')) {
		document.getElementById('login_div4').style.display = 'none';
	}
	mobile_phone = document.getElementById('mobile_phone').value;
	custid = document.getElementById('custid').value;
	if (mobile_phone == 1) {
		hideMForm();
	}
	if (custid == 0) {
		showForm('login-div','login-cont');
	} else {
		showForm('timer', 'timer-inner');
		domain = document.getElementById('domain_name').value;
		lang = document.getElementById('lang_selected').value.toLowerCase();
		if (lang != 'english') {
			uri = 'https://' + domain + '/' + lang;
		} else {
			uri = 'https://' + domain;
		}
		window.open(uri + '/account/acc_main.php', '_self');
	}
}
function LoginNow() {
	sess_id = document.getElementById('stick').value;
	if (document.getElementById('email3')) {
		email = document.getElementById('email3').value;
		if (email == '') {
			JSmessage('Please enter your account email');
			return;
		} else {
			if (!validate_Email(email)) {
				JSmessage('Please enter a valid email, the format seems not correct');
				return;
			}
		}
	}
	if (document.getElementById('pwd2')) {
		pwd = document.getElementById('pwd2').value;
		if (pwd == '') {
			JSmessage('Please enter your account password');
			return;
		}
	}
	showForm('timer', 'timer-inner');
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/account/account-login.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'success') {
					if (response.login == 1) {
						wish_page = 0;
						if (document.getElementById('wish_page')) {
							wish_page = document.getElementById('wish_page').value;
						}
						if (wish_page == 1) {
							domain = document.getElementById('domain_name').value;
							lang = document.getElementById('lang_selected').value.toLowerCase();
							uri = 'https://' + domain + '/' + lang;
							window.open(uri + '/cart/wishlist.php', '_self');
						} else {
							location.reload();
						}
					} else {
						hideForm('timer', 'timer-inner');
						JSmessage(response.message);
						return;
					}
				} else {
					console.error("Error: " + response.message);
				}
			} else {
				console.error("Error: " + xhr.status);
			}
		}
	};
	var sess_id = document.getElementById('stick').value;
	var type = 'acc_login';
	var data = "&email=" + encodeURIComponent(email) +
		         "&pwd=" + encodeURIComponent(pwd) +
		         "&sess_id=" + encodeURIComponent(sess_id) +
						 "&type=" + encodeURIComponent(type);
	xhr.send(data);
}
function ForgotPwd() {
	// .forgotpwd_but
	document.getElementById('pwd2_inp').style.display = 'none';
	document.getElementById('login_div3').style.display = 'none';
	document.getElementById('login_div1').style.display = 'none';
	document.getElementById('login_div2').style.display = 'none';
	document.getElementById('login_div4').style.display = 'block';
}
function Forgot_PWD() {
	if (document.getElementById('email3')) {
		email = document.getElementById('email3').value;
		if (email == '') {
			JSmessage('Please enter your account email');
			return;
		}
		showForm('timer', 'timer-inner');
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "/account/forgot-pwd.php", true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var response = JSON.parse(xhr.responseText);
					hideForm('timer', 'timer-inner');					
					if (response.status === 'success') {
						if (response.sent == 1) {
							hideForm('login-div','login-cont');
							JSmessage('An email has been sent, it should arrive within 5 minutes');
						} else {
							JSmessage(response.message);
						}						
					} else {
						console.error("Error: " + response.message);
					}
				} else {
					var response = JSON.parse(xhr.responseText);
					hideForm('timer', 'timer-inner');
					console.error("Error: " + xhr.status);
					JSmessage(response.message);
				}
			}
		};
		var sess_id = document.getElementById('stick').value;
		var type = 'forgot_pwd';
		var data = "&email=" + encodeURIComponent(email) +
							 "&sess_id=" + encodeURIComponent(sess_id) +
							 "&type=" + encodeURIComponent(type);
		xhr.send(data);
	}
}

function updateCountry(country) {
	document.getElementById('shipCountry').textContent = country;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/cart/inc/update-country.php", true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var response = JSON.parse(xhr.responseText);
				if (response.status === 'success') {
					//console.log("Success: " + response.message);
					location.reload();
				} else {
					console.error("Error: " + response.message);
				}
			} else {
				console.error("Error: " + xhr.status);
			}
		}
	};
	var type = 'update_country';
	var sess_id = document.getElementById('stick').value;
	var data = "country=" + encodeURIComponent(country) +
						 "&sess_id=" + encodeURIComponent(sess_id) +
						 "&type=" + encodeURIComponent(type);
	//console.log(data);
	xhr.send(data);
}