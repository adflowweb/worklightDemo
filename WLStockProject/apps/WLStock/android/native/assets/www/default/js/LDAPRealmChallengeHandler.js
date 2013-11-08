
/* JavaScript content from js/LDAPRealmChallengeHandler.js in folder common */
       /*
        *  Licensed Materials - Property of IBM
        *  5725-G92 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
        *  US Government Users Restricted Rights - Use, duplication or
        *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
        */
var LDAPRealmChallengeHandler = WL.Client.createChallengeHandler("LDAPRealm");
var loginCheck = true;

LDAPRealmChallengeHandler.isCustomResponse = function(response) {
	
	  WL.Logger.error("isCustomResponse");
    if (!response || !response.responseText) {
        return false;
    }
    
    WL.Logger.error("response ::");
    
    var idx = response.responseText.indexOf("j_security_check");
    
    WL.Logger.error("response11 ::");
    
    WL.Logger.error("response22 ::"+ response.responseText);
    
    if (idx >= 0){ 
    	return true;
    }
    return false;

};

LDAPRealmChallengeHandler.handleChallenge = function(response){
	 WL.Logger.error("handleChallenge");
	//change the following part
		//$('#AppDiv').hide();
		//$('#AuthDiv').show();
		//$('#passwordInputField').val('');
	 WL.Logger.error("handleChallenge [Before] loginCheck ::" + loginCheck);
	 
        if (loginCheck) {
        	$("#loginPopup").popup();
    		$("#loginPopup").popup("open");
    		$("#passwordInputField").val("");
    		loginCheck = false;
    		WL.Logger.error("handleChallenge loginCheck ::" + loginCheck);
		}
        
        WL.Logger.error("handleChallenge [after] loginCheck ::" + loginCheck);
		
		
//		var pageId = $.mobile.activePage.attr("id");
//		WL.Logger.error("$.mobile.activePage.attr('id') three"+pageId);
//		var page = $('#'+pageId);
		
//		var popupPage = '<div data-role="popup" id="loginPopup" style="max-width:400px;" class="ui-corner-all">                                                  '
//									+ '	<div data-role="header" data-theme="a" class="ui-corner-top">                                                                          '
//									+ '		<h1>로그인</h1>                                                                                                                      '
//									+ '	</div>                                                                                                                                 '
//									+ '	<div  data-theme="d" class="ui-corner-bottom ui-content">                                                                              '
//									+ '		<label for="usernameInputField" class="ui-hidden-accessible">사용자 ID:</label>                                                      '
//									+ '        	<input type="text" name="usernameInputField" id="usernameInputField" value="" placeholder="" data-theme="a" />                 '
//									+ '                                                                                                                                        '
//									+ '        	<label for="passwordInputField" class="ui-hidden-accessible">패스워드:</label>                                                 '
//									+ '        	<input type="password" name="passwordInputField" id="passwordInputField" value="" placeholder="" data-theme="a" />             '
//									+ '		<p></p>                                                                                                                              '
//									+ '		<a onclick="javascript:loginBtnClick();" id="loginButton" data-role="button" data-inline="true" data-rel="ok" data-theme="a">로그인</a>                           '
//									+ '		<a href="#" id="cancelButton" data-role="button" data-inline="true" data-rel="ok" data-transition="flow" data-theme="b">취소</a>     '
//									+ '	</div>                                                                          ';
//		
////		var popup = $(popupPage).appendTo(page).trigger('refresh');
//		$('#home').append(popupPage).trigger('refresh');
////		popup.popup();
//		WL.Logger.error("WLShoppersChallengeHandler.handleChallenge four");
//		$('#loginPopup').popup();
//		$('#loginPopup').popup('open');
		
		
		
//		var popup = $('<div data-role="popup" id="frm_LoginPopup" data-overlay-theme="a" data-theme="c" style="max-width: 400px;" class="ui-corner-all"><div data-role="header" data-theme="a" class="ui-corner-top"><h1>Login</h1></div><div data-role="content" data-theme="d"class="ui-corner-bottom ui-content"><h3 class="ui-title">Login required</h3><p><input id="WL_username" placeholder="Enter your username" type="text"> <input id="WL_password" placeholder="Enter your password" type="password"></p><a href="#" data-role="button" data-inline="true" data-rel="back" data-theme="a">취소</a> <a onclick="javascript:authenticationLogin();" id="frm_LoginPopupBtn" data-role="button" data-inline="true" data-rel="ok" data-transition="flow" data-theme="b">보내기</a></div>').appendTo('#home').trigger('refresh');
//		popup.popup();
//		WL.Logger.error("WLShoppersChallengeHandler.handleChallenge four");
//		
//		$('#frm_LoginPopup').popup();
//		$('#frm_LoginPopup').popup('open');
		
		
		
};

$('#loginButton').bind('click', function () {
//function loginBtnClick(){
	
	WL.Logger.error("loginButton");
    var reqURL = '/j_security_check';
    var options = {};
    options.parameters = {
    		j_username : $('#usernameInputField').val(),
    		j_password : $('#passwordInputField').val()
    };
    options.headers = {};
    LDAPRealmChallengeHandler.submitLoginForm(reqURL, options, LDAPRealmChallengeHandler.submitLoginFormCallback);
});

$('#cancelButton').bind('click', function () {
	WL.Logger.error("cancelButton");
	//change the following part
	//$('#AppDiv').show();
	//$('#AuthDiv').hide();
	loginCheck = true;
	$("#loginPopup").popup("close");
	LDAPRealmChallengeHandler.submitFailure();
});

LDAPRealmChallengeHandler.submitLoginFormCallback = function(response) {
	WL.Logger.error("submitLoginFormCallback");
    var isLoginFormResponse = LDAPRealmChallengeHandler.isCustomResponse(response);
    if (isLoginFormResponse){
    	WL.Logger.error("Login fail");
    	loginCheck = true;
    	WL.Logger.error("submitLoginFormCallback loginCheck ::" + loginCheck);
    	LDAPRealmChallengeHandler.handleChallenge(response);
    } else {
    	//change the following part
    	//$('#AppDiv').show();
    	//$('#AuthDiv').hide();
    	
    	loginCheck = false;
    	WL.Logger.error("submitLoginFormCallback loginCheck ::" + loginCheck);
    	$("#loginPopup").popup("close");
    	LDAPRealmChallengeHandler.submitSuccess();
    	
    	//mqtt Connection
    	mqttConnect();
    }
};