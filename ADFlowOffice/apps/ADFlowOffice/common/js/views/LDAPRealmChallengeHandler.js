       /*
        *  Licensed Materials - Property of IBM
        *  5725-G92 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
        *  US Government Users Restricted Rights - Use, duplication or
        *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
        */
var LDAPRealmChallengeHandler = WL.Client.createChallengeHandler("LDAPRealm");

LDAPRealmChallengeHandler.isCustomResponse = function(response) {
    if (!response || !response.responseText) {
        return false;
    }
    
    var idx = response.responseText.indexOf("j_security_check");
    
    if (idx >= 0){ 
    	return true;
    }
    return false;

};

LDAPRealmChallengeHandler.handleChallenge = function(response){
		$('#AppDiv').hide();
		$('#AuthDiv').show();
		$('#passwordInputField').val('');
};

$('#loginButton').bind('click', function () {
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
	$('#AppDiv').show();
	$('#AuthDiv').hide();
	LDAPRealmChallengeHandler.submitFailure();
});

LDAPRealmChallengeHandler.submitLoginFormCallback = function(response) {
    var isLoginFormResponse = LDAPRealmChallengeHandler.isCustomResponse(response);
    if (isLoginFormResponse){
    	LDAPRealmChallengeHandler.handleChallenge(response);
    } else {
    	$('#AppDiv').show();
    	$('#AuthDiv').hide();
    	LDAPRealmChallengeHandler.submitSuccess();
    }
};