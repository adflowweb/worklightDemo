/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
//Create SQL query
var getAccounts = WL.Server
		.createSQLStatement("SELECT * FROM CONTACT WHERE email = ? and pwd=MD5(?) ;");

function onAuthRequired(headers, errorMessage) {
	errorMessage = errorMessage ? errorMessage : null;

	return {
		authRequired : true,
		errorMessage : errorMessage
	};
}

function submitAuthentication(username, password) {

	// WL.Logger.info("test::::::::::::::::" + WL.Server.invokeSQLStatement({
	// preparedStatement : getAccounts
	// }));
	// var email = username + '@adflow.co.kr';
	// WL.Logger.info('email::' + email + '::');

	var val = WL.Server.invokeSQLStatement({
		preparedStatement : getAccounts,
		parameters : [ username, password ]
	});

	WL.Logger.info(val);

	if (val.resultSet.length == 1) {

		var userIdentity = {
			userId : username,
			displayName : username,
			attributes : {
				foo : "bar"
			}
		};

		WL.Server.setActiveUser("LoginRealm", userIdentity);

		// {
		// "isSuccessful": true,
		// "resultSet": [
		// {
		// "birthdate": null,
		// "dept": "웹통합서비스팀",
		// "email": "bskim@adflow.co.kr",
		// "grp": "0",
		// "hiredate": "1997-03-01T00:00:00.000Z",
		// "nameen": "bskim",
		// "nameko": "김병상",
		// "no": "11100",
		// "phone": null,
		// "photo": null,
		// "pwd": "c4ca4238a0b923820dcc509a6f75849b",
		// "sex": "0",
		// "title": "부장"
		// }
		// ]
		// }
		return {
			authRequired : false,
			email : val.resultSet[0].email,
			grp : val.resultSet[0].grp,
			no : val.resultSet[0].no,
			nameen : val.resultSet[0].nameen,
			nameko : val.resultSet[0].nameko,
			title : val.resultSet[0].title
		};
	}

	return onAuthRequired(null, "Invalid login credentials");
}

function getDummy() {
	return {
		dummyData : "this is dummy"
	};
}

function onLogout() {
	WL.Server.setActiveUser("LoginRealm", null);
	WL.Logger.info("Logged out");
}
