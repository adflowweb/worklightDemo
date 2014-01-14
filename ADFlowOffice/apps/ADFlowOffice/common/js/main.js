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

		window.beforeload = new Date().getTime();

		window.busy.show();

		WL.Client.connect({
			onSuccess : function() {
				console.log('success ========================');
//				loadDummy();
			},
			onFailure : function() {
				console.log('fail ========================');
				window.busy.hide();
			}
		});

		
		if (!ADF.view.dashBoard) {
			ADF.view.dashBoard = new ADF.view.DashBoard;
		}

		navigation.pushView(ADF.view.dashBoard, 'typeA');
		
	});

	window.busy = new WL.BusyIndicator();
}



/////////////////////////////////////////////////////////////////////////////////
//dummy start
function loadDummy() {
	  console.log("...getDummy...........try. to...something like that");
     var invocationData = {
             adapter : 'CastIronAdapter', // adapter name
             procedure : 'getDummy',
             parameters : []
     };
     console.log("...getDummy...........try. to...something like that");

     WL.Client.invokeProcedure(
                                     invocationData,
                                     {
                                             onSuccess : function loadDummySuccess(result) {
                                            	 console.log("...hiso............try. to...something like that"
                                                         + result);
                                            	  console.log("...loadDummySuccess...........try. to...something like that"
                                                                     + JSON.stringify(result));

//                                                     if (result.invocationResult.isSuccessful) {
//                                                    	 console.log("...result.invocationResult.isSuccessful...........try. to...something like that");
//                                                     } else {
//                                                     }
                                             },
                                             onFailure : function loadDummyFailure(result) {
                                            	 console.log("onFailure loadDummyFailure");
                                             }
                                     });
     
}
//dummy end