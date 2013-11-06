/**
 * 
 */

var WLShoppersChallengeHandler = WL.Client
		.createChallengeHandler("WLShoppersRealm");
var cookiename;
WLShoppersChallengeHandler.isCustomResponse = function(response) {
//	alert("before popup hello handleChallenge");
	if (!response || !response.responseText) {
		return false;
	}

	if (response.responseText.indexOf("j_security_check") >= 0) {
	
		return true;
	}

	return false;
};

WLShoppersChallengeHandler.handleChallenge = function(response) {
	
	
	///////////////////////////////////////////////////////////
	
	var pageId = $.mobile.activePage.attr("id");
//	alert("$.mobile.activePage.attr('id')"+pageId);
	var page = $('#'+pageId);	
//	var popup = $('<div data-role="popup" id="frm_LoginPopup" data-overlay-theme="a" data-theme="c" style="max-width: 400px;" class="ui-corner-all"><div data-role="header" data-theme="a" class="ui-corner-top"><h1>Login</h1></div><div data-role="content" data-theme="d"class="ui-corner-bottom ui-content"><h3 class="ui-title">Login required</h3><p><input id="WL_username" placeholder="Enter your username"	type="text"> <input id="WL_password" placeholder="Enter your password" type="password"></p><a href="#" data-role="button" data-inline="true" data-rel="back" 	data-theme="a">취소</a> <a href="#" id="frm_LoginPopupBtn"	data-role="button" data-inline="true" data-rel="ok"	data-transition="flow" data-theme="b">보내기</a></div>').appendTo(page).trigger('refresh');
//	var popup = $('<div data-role="popup" id="frm_LoginPopup" data-overlay-theme="a" data-theme="c" style="max-width: 400px;" class="ui-corner-all"><div data-role="header" data-theme="a" class="ui-corner-top"><h1>Login</h1></div><div data-role="content" data-theme="d"class="ui-corner-bottom ui-content"><h3 class="ui-title">Login required</h3><p><input id="WL_username" placeholder="Enter your username"	type="text"> <input id="WL_password" placeholder="Enter your password" type="password"></p><a href="#" data-role="button" data-inline="true" data-rel="back" 	data-theme="a">취소</a> <a href="javascript:authenticationLogin();"  id="frm_LoginPopupBtn"	data-role="button" data-inline="true" data-rel="ok"	data-transition="flow" data-theme="b">보내기</a></div>').appendTo(page).trigger('refresh');
	var popup = $('<div data-role="popup" id="frm_LoginPopup" data-overlay-theme="a" data-theme="c" style="max-width: 400px;" class="ui-corner-all"><div data-role="header" data-theme="a" class="ui-corner-top"><h1>Login</h1></div><div data-role="content" data-theme="d"class="ui-corner-bottom ui-content"><h3 class="ui-title">Login required</h3><p><input id="WL_username" placeholder="Enter your username"	type="text"> <input id="WL_password" placeholder="Enter your password" type="password"></p><a href="#" data-role="button" data-inline="true" data-rel="back" 	data-theme="a">취소</a> <a onclick="javascript:authenticationLogin();"  id="frm_LoginPopupBtn"	data-role="button" data-inline="true" data-rel="ok"	data-transition="flow" data-theme="b">보내기</a></div>').appendTo(page).trigger('refresh');
	popup.popup();
	$('#frm_LoginPopup').popup('open');
//	alert("$.mobile.activePage.attr('id')"+pageId);
	// ///////////////////////////////////////////////////////////////////////////
	$('#frm_LoginPopup').popup();
//	alert("after popup hello handleChallenge");
	$('#frm_LoginPopup').trigger('create');
	$('#frm_LoginPopup').popup('open', {
		x : 10,
		y : 10,
		positionTo : "window"
	});
	$('#WL_password').val('');

};

//$('#frm_LoginPopupBtn').bind('click',function() {
function authenticationLogin(){

			cookiename = $('#WL_username').val(),
			// ////////////////////////////////////////////////////////////////////////////
		
			setCookie("username", cookiename, 365);
			var username = getCookie("username");
			// /////////////////////////////////////////////////////////////////////
			var reqURL = '/j_security_check';
			var option = {};

			option.parameters = {
				j_username : $('#WL_username').val(),
				j_password : $('#WL_password').val()
			};
			option.headers = {};
			// option.headers = {"eyleername":username};
			WLShoppersChallengeHandler.submitLoginForm(reqURL, option,
					WLShoppersChallengeHandler.submitLoginFormCallback);
}
//});

$('#btn_Cancel').bind('click', function() {

	$('#frm_LoginPopup').popup('close');

	WLShoppersChallengeHandler.submitFailure();

});

WLShoppersChallengeHandler.submitLoginFormCallback = function(response) {

	var res = WLShoppersChallengeHandler.isCustomResponse(response);

	if (res) {
		WLShoppersChallengeHandler.handleChallenge(response);
	} else {
		$('#frm_LoginPopup').popup('close');
		WLShoppersChallengeHandler.submitSuccess();

	}

};

// //////////////////////////////////////////////////////////////////
// logout
$('.btn_logout').bind('click', function() {
	WL.Logger.debug("logout inside.............");
	WL.Client.logout('WLShoppersRealm', {
		onSuccess : WL.Client.reloadApp
	});
	var username = getCookie("username");
	eraseCookie(username);
	
	WL.Logger.debug("after btn_logout').bind('click', function() :: " +username);
		
	$.mobile.changePage('#pg_home', {
		transition : "pop"
	});

	WL.Logger.debug("logout after.............");
});