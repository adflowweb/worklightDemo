////////////////////
// author: nadir93
// date: 2013.12.18
////////////////////
window.isAnimation = false;
window.addEventListener('load', function() {
	new FastClick(document.body);
}, false);

function wlCommonInit() {

	/*
	 * Application is started in offline mode as defined by a connectOnStartup
	 * property in initOptions.js file. In order to begin communicating with
	 * Worklight Server you need to either:
	 * 
	 * 1. Change connectOnStartup property in initOptions.js to true. This will
	 * make Worklight framework automatically attempt to connect to Worklight
	 * Server as a part of application start-up. Keep in mind - this may
	 * increase application start-up time.
	 * 
	 * 2. Use WL.Client.connect() API once connectivity to a Worklight Server is
	 * required. This API needs to be called only once, before any other
	 * WL.Client methods that communicate with the Worklight Server. Don't
	 * forget to specify and implement onSuccess and onFailure callback
	 * functions for WL.Client.connect(), e.g:
	 * 
	 * WL.Client.connect({ onSuccess: onConnectSuccess, onFailure:
	 * onConnectFailure });
	 * 
	 */
	// Common initialization code goes here
	$('#loginBtn').on('click', function() {

		// validation check
		var username = $("#user").val();
		var password = $("#password").val();

		if (!username || !password || username == '' || password == '') {
			window.busy.hide();
			WL.SimpleDialog.show("에러", '아이디 또는 패스워드를 확인해 주세요', [ {
				text : "확인",
				handler : function() {
					WL.Logger.debug("error button pressed");
				}
			} ]);
			return;
		}

		window.beforeload = new Date().getTime();
		window.busy.show();

		WL.Client.connect({
			onSuccess : function() {
				console.log('connection success ========================');
				loadDummy();
			},
			onFailure : function() {
				console.log('connection fail ========================');
				window.busy.hide();
			}
		});

	});

	window.busy = new WL.BusyIndicator();
}

// ///////////////////////////////////////////////////////////////////////////////
// dummy start
function loadDummy() {
	console.log("...getDummy");
	var invocationData = {
		adapter : 'LoginAdapter', // adapter name
		procedure : 'getDummy',
		parameters : []
	};

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : function(result) {
			console.log("result" + result);
			console.log("result" + JSON.stringify(result));

			// if (result.invocationResult.isSuccessful) {
			// console.log("...result.invocationResult.isSuccessful...........try.
			// to...something like that");
			// } else {
			// }
			if (!ADF.view.dashBoard) {
				ADF.view.dashBoard = new ADF.view.DashBoard;
			}
			navigation.pushView(ADF.view.dashBoard, 'typeA');
		},
		onFailure : function(result) {
			console.log("onFailure loadDummyFailure");
		}
	});
}
// dummy end
