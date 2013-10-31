
// Initialize Login Form.
//$("#frm_Login").popup();





var WLShoppersChallengeHandler = WL.Client.createChallengeHandler("WLShoppersRealm");

WLShoppersChallengeHandler.isCustomResponse = function(response) {

	if (!response || !response.responseText) {
		return false;
	}

	if (response.responseText.indexOf("j_security_check") >= 0) {
		return true;
	}
	
	return false;
};



WLShoppersChallengeHandler.handleChallenge = function(response) {

	//$('#frm_Login').popup('open');
	$('#frm_Login').show();
	$('#frm_Login').appendTo(".ui-page").trigger('create');
	$('#WL_password').val('');
			
};



$('#btn_Submit').bind('click', function() {

	var reqURL = '/j_security_check';
	var option = {};
	
	option.parameters = {
			j_username : $('#WL_username').val(),
			j_password : $('#WL_password').val()
	};
	
	option.headers = {};
	
	WLShoppersChallengeHandler.submitLoginForm(reqURL, option, WLShoppersChallengeHandler.submitLoginFormCallback);
	
});



$('#btn_Cancel').bind('click', function() {

	//$('#frm_Login').popup('close');
	$('#frm_Login').hide();
	WLShoppersChallengeHandler.submitFailure();
	
});



WLShoppersChallengeHandler.submitLoginFormCallback = function(response) {

	var res = WLShoppersChallengeHandler.isCustomResponse(response);
	
	if (res) {
		WLShoppersChallengeHandler.handleChallenge(response);
	} else {
		//$('#frm_Login').popup('close');
		$('#frm_login').hide();
		WLShoppersChallengeHandler.submitSuccess();
	}

};






