/**
 * 
 */
var authenID;


var WLShoppersChallengeHandler = WL.Client
		.createChallengeHandler("WLShoppersRealm");
//var cookiename;
WLShoppersChallengeHandler.isCustomResponse = function(response) {
//	WL.Logger.error("before popup hello WLShoppersChallengeHandler.isCustomResponse one");
	if (!response || !response.responseText) {
//		WL.Logger.error("return false one");
		return false;
		
		
	}

	if (response.responseText.indexOf("j_security_check") >= 0) {
//		WL.Logger.error("return true one");
		return true;
		
	}
//	WL.Logger.error("return default one");
	return false;
};

WLShoppersChallengeHandler.handleChallenge = function(response) {
	
//	WL.Logger.error("WLShoppersChallengeHandler.handleChallenge two");
	///////////////////////////////////////////////////////////
	
	var pageId = $.mobile.activePage.attr("id");
//	WL.Logger.error("$.mobile.activePage.attr('id') three"+pageId);
	var page = $('#'+pageId);	
//	var popup = $('<div data-role="popup" id="frm_LoginPopup" data-overlay-theme="a" data-theme="c" style="max-width: 400px;" class="ui-corner-all"><div data-role="header" data-theme="a" class="ui-corner-top"><h1>Login</h1></div><div data-role="content" data-theme="d"class="ui-corner-bottom ui-content"><h3 class="ui-title">Login required</h3><p><input id="WL_username" placeholder="Enter your username"	type="text"> <input id="WL_password" placeholder="Enter your password" type="password"></p><a href="#" data-role="button" data-inline="true" data-rel="back" 	data-theme="a">취소</a> <a href="#" id="frm_LoginPopupBtn"	data-role="button" data-inline="true" data-rel="ok"	data-transition="flow" data-theme="b">보내기</a></div>').appendTo(page).trigger('refresh');
//	var popup = $('<div data-role="popup" id="frm_LoginPopup" data-overlay-theme="a" data-theme="c" style="max-width: 400px;" class="ui-corner-all"><div data-role="header" data-theme="a" class="ui-corner-top"><h1>Login</h1></div><div data-role="content" data-theme="d"class="ui-corner-bottom ui-content"><h3 class="ui-title">Login required</h3><p><input id="WL_username" placeholder="Enter your username"	type="text"> <input id="WL_password" placeholder="Enter your password" type="password"></p><a href="#" data-role="button" data-inline="true" data-rel="back" 	data-theme="a">취소</a> <a href="javascript:authenticationLogin();"  id="frm_LoginPopupBtn"	data-role="button" data-inline="true" data-rel="ok"	data-transition="flow" data-theme="b">보내기</a></div>').appendTo(page).trigger('refresh');
	var popup = $('<div data-role="popup" id="frm_LoginPopup" data-overlay-theme="a" data-theme="c" style="max-width: 400px;" class="ui-corner-all"><div data-role="header" data-theme="a" class="ui-corner-top"><h1>Login</h1></div><div data-role="content" data-theme="d"class="ui-corner-bottom ui-content"><h3 class="ui-title">Login required</h3><p><input id="WL_username" name="WL_username" placeholder="Enter your username"	type="text"> <input id="WL_password" name="WL_password" placeholder="Enter your password" type="password"></p><a href="#" data-role="button" data-inline="true" data-rel="back" 	data-theme="a">취소</a> <a onclick="javascript:authenticationLogin();"  id="frm_LoginPopupBtn"	data-role="button" data-inline="true" data-rel="ok"	data-transition="flow" data-theme="b">보내기</a></div>').appendTo(page).trigger('refresh');
	popup.popup();
//	WL.Logger.error("WLShoppersChallengeHandler.handleChallenge four");
	$('#frm_LoginPopup').popup('open');
//	WL.Logger.error("WLShoppersChallengeHandler.handleChallenge five");
//	alert("$.mobile.activePage.attr('id')"+pageId);
	// ///////////////////////////////////////////////////////////////////////////
//	WL.Logger.error("WLShoppersChallengeHandler.handleChallenge six");
	$('#frm_LoginPopup').popup();
//	WL.Logger.error("WLShoppersChallengeHandler.handleChallenge seven");
//	alert("after popup hello handleChallenge");
	$('#frm_LoginPopup').trigger('create');
//	WL.Logger.error("WLShoppersChallengeHandler.handleChallenge eight");
	$('#frm_LoginPopup').popup('open', {
		x : 10,
		y : 10,
		positionTo : "window"
	});
//	WL.Logger.error("WLShoppersChallengeHandler.handleChallenge nine");
	
//	WL.Logger.error("WLShoppersChallengeHandler.handleChallenge ten");
};

//$('#frm_LoginPopupBtn').bind('click',function() {
function authenticationLogin(){

		
			// ////////////////////////////////////////////////////////////////////////////
			authenID = $('input[name="WL_username"]').val();
			var WL_password = $('input[name="WL_password"]').val();
//			setCookie("username", cookiename, 365);
//			var username = getCookie("username");
			// /////////////////////////////////////////////////////////////////////
			var reqURL = '/j_security_check';
			var option = {};
			var WL_username = $('input[name="WL_username"]').val();
			option.parameters = {
				j_username : WL_username,
				j_password : WL_password
			};
			option.headers = {};
			// option.headers = {"eyleername":username};
			WLShoppersChallengeHandler.submitLoginForm(reqURL, option,
					WLShoppersChallengeHandler.submitLoginFormCallback);
			
}
//});

$('#btn_Cancel').bind('click', function() {

	$('#frm_LoginPopup').popup('close');
//	WL.Logger.error("WLShoppersChallengeHandler.handleChallenge close eleven");
	WLShoppersChallengeHandler.submitFailure(); // history back...

});

WLShoppersChallengeHandler.submitLoginFormCallback = function(response) {
//	WL.Logger.error("WLShoppersChallengeHandler.handleChallenge close tweleve");
	var res = WLShoppersChallengeHandler.isCustomResponse(response);
//	WL.Logger.error("WLShoppersChallengeHandler.handleChallenge close thirteen");
	if (res) {
		WLShoppersChallengeHandler.handleChallenge(response);
//		WL.Logger.error("WLShoppersChallengeHandler.handleChallenge close fourteen");
	} else {
		$('#frm_LoginPopup').popup('close');
//		WL.Logger.error("WLShoppersChallengeHandler.handleChallenge close sixteen");
		WLShoppersChallengeHandler.submitSuccess();

	}

};

// //////////////////////////////////////////////////////////////////
// logout
$('.btn_logout').bind('click', function() {
//	WL.Logger.debug("logout inside.............");
	WL.Client.logout('WLShoppersRealm', {
		onSuccess : WL.Client.reloadApp
	});
//	var username = getCookie("username");
//	eraseCookie(username);
	
	WL.Logger.debug("after btn_logout').bind('click', function() :: " +authenID);
		
	$.mobile.changePage('#pg_home', {
		transition : "pop"
	});

	WL.Logger.debug("logout after.............");
});