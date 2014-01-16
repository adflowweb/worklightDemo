/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

var LoginRealmChallengeHandler = WL.Client.createChallengeHandler("LoginRealm");

LoginRealmChallengeHandler.isCustomResponse = function(response) {
	// WL.Logger.info('response::' + JSON.stringify(response));
	if (!response || !response.responseJSON || response.responseText === null) {
		return false;
	}
	if (typeof (response.responseJSON.authRequired) !== 'undefined') {
		return true;
	} else {
		return false;
	}
};

LoginRealmChallengeHandler.handleChallenge = function(response) {
	// WL.Logger.info('response::' + JSON.stringify(response));
	var authRequired = response.responseJSON.authRequired;
	// console.log('handleChallenge::' + authRequired);

	if (authRequired == true) {
		if (response.responseJSON.errorMessage
				&& response.responseJSON.errorMessage == 'Invalid login credentials') {
			// console.log(response.responseJSON.errorMessage);
			window.busy.hide();
			WL.SimpleDialog.show("에러", '아이디 또는 패스워드를 확인해 주세요', [ {
				text : "확인",
				handler : function() {
					WL.Logger.debug("error button pressed");
					LoginRealmChallengeHandler.submitFailure();
				}
			} ]);
		} else {

			var username = $("#user").val() + '@adflow.co.kr';
			var password = $("#password").val();

			var invocationData = {
				adapter : "LoginAdapter",
				procedure : "submitAuthentication",
				parameters : [ username, password ]
			};

			LoginRealmChallengeHandler.submitAdapterAuthentication(
					invocationData, {
						onSuccess : function(result) {
							// console.log("successResult" + result);
							// console.log("result" +
							// JSON.stringify(result));
						},
						onFailure : function(result) {
							// console.log("failResult" + result);
							// console.log("result" +
							// JSON.stringify(result));

							window.busy.hide();
							WL.SimpleDialog.show("에러", '아이디 또는 패스워드를 확인해 주세요',
									[ {
										text : "확인",
										handler : function() {
											LoginRealmChallengeHandler
													.submitFailure();
										}
									} ]);
						}
					});
		}
	} else if (authRequired == false) {

		// email : val.resultSet[0].email,
		// group : val.resultSet[0].grp,
		// no : val.resultSet[0].no,
		// nameen : val.resultSet[0].nameen,
		// nameko : val.resultSet[0].nameko,
		// title : val.resultSet[0].title

		ADF.user = {
			no : response.responseJSON.no,
			grp : response.responseJSON.grp,
			nameen : response.responseJSON.nameen,
			nameko : response.responseJSON.nameko,
			title : response.responseJSON.title,
			email : response.responseJSON.email
		};

		console.log('ADF.user::' + JSON.stringify(ADF.user));
		console.log('ADF.user.nameen::' + ADF.user.nameen);
		console.log('ADF.user.no::' + ADF.user.no);
		LoginRealmChallengeHandler.submitSuccess();
	}
};

// $("#AuthCancelButton").bind('click', function() {
// $("#AppDiv").show();
// $("#AuthDiv").hide();
// LoginRealmChallengeHandler.submitFailure();
// });
