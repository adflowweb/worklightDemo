
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
    
//    WL.Logger.error("response22 ::"+ response.responseText);
    
    if (idx >= 0){ 
    	return true;
    }
    return false;

};

LDAPRealmChallengeHandler.handleChallenge = function(response){
        	$("#loginPopup").popup();
    		$("#loginPopup").popup("open");
    		$("#passwordInputField").val("");
		
};

$('#loginButton').bind('click', function () {
//function loginBtnClick(){
	
	WL.Logger.error("loginButton");
	ClientId = $('#usernameInputField').val();
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