/**
 * 2013.11.07 eylee *
 * 
 */

// Wait for Cordova to load
//

//btn_sendGps
// Cordova is ready
//
var autoGeolocation;
var i=0;

$('.btn_sendGps').click(function() {
var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {		
		WL.Logger.debug(" if..btn_goWishlistPage username null check , and before loadDummy() " + wlid);
		loadDummy();

	} else {
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("btn_goWishlistPage inside :: "+conid+name+loginid);
		
		//mqttConnection call
//		mqttConnection(conid);

		WL.Logger.error("btn_sendGps click ");
		$.mobile.changePage('#gpsSendPage', {
			transition : "pop"
		});
	
	}

	
	
});
$('#sendMygps').click(function() {
	WL.Logger.error("sendMygps click ");
//  autoGeolocation  = setInterval(getGeolocation, 30000);   
	 autoGeolocation  = setInterval(getGeolocation, 10000);
});

$('#sendInputgps').click(function() {
	WL.Logger.error("sendInputgps click ");
	var inputLatitude;
	inputLatitude = $('input[name="inputLatitude"]').val();

	var inputLongitude;
	inputLongitude = $('input[name="inputLongitude"]').val();

	WL.Logger.error("#sendInputgps click.....inputLatitude: "+ inputLatitude	+ "    inputLongitude: "  + inputLongitude);
	isConnectionMqttforSend(inputLatitude, inputLongitude);
	
});

$('.btn_clearGeolocation').click(function( ) {
	clearInterval(autoGeolocation);
	WL.Logger.error("btn_clearGeolocation click  ::   clearInterval  ");
	
});





function getGeolocation(){
	WL.Logger.debug("getGeolocation entry point");
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
	WL.Logger.debug("navigator.geolocation.getCurrentPosition after .........");		
	WL.Logger.debug("getGeolocation client" + client);
	
}
// onSuccess Geolocation
//
function onSuccess(position) {	
	WL.Logger.debug("nonSuccessCallback after .........");		

	
	WL.Logger.error("onSuccess entry point......Latitude: "+ position.coords.latitude	+ "    Longitude: "  + position.coords.longitude);
	WL.Logger.debug("onSuccess inside i count (i++) : "+ i++);
	isConnectionMqttforSend(position.coords.latitude, position.coords.longitude );
//	sendMqtt(position.coords.latitude, position.coords.longitude );
			
}

function isConnectionMqttforSend(latitude, longitude){
	var sendlatitude = latitude;
	var sendlongitude = longitude;
	if(mqttResult){  // when mqtt connection true 
		
		sendMqtt(sendlatitude,sendlongitude );
		WL.Logger.debug("isConnectionMqttforSend mqttResult true...sendMqtt . latitude :: "+sendlatitude+ "       longitude :: "+ sendlongitude);
		
	}else{
		WL.Logger.debug("isConnectionMqttforSend mqttResult false.... latitude :: "+sendlatitude+ "       longitude :: "+ sendlongitude);
	}
}
// onError Callback receives a PositionError object
//
function onError(error) {
	WL.Logger.debug("onErrorCallback after .........");		
	WL.Logger.debug('onError code: ' + error.code + '\n' + 'message: ' + error.message + '\n');

	
}

function sendMqtt(latitude, longitude) {
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	WL.Logger.debug("sendMqtt(latitude, longitude) entry point ...................  " + wlid);		
	var conid = userRealmht["conid"];
	WL.Logger.debug("sendMqtt(latitude, longitude) entry point  conid ...................  " + conid );		
	var name = userRealmht["name"];
	var loginid = userRealmht["loginid"];	
	WL.Logger.debug("btn_loginformPag :: "+conid+name+loginid);

	var sendlatitude = latitude;
	var sendlongitude = longitude;
	/////////////////////////////////////////////////////////////////////////
//	make json data
	var t = new Date();
	var _Year = 1900 + t.getYear() ;
	var _Month = 1 + t.getMonth();
 	
 	var locTStamp = "" + _Year + _Month + t.getDate() + t.getHours() + t.getMinutes()+ t.getSeconds();
 	
	var sendJson = '{"mobConLocation": {"userId": "'+conid+'","curCoord": {"lat":'+sendlatitude+', "long":'+sendlongitude+'},"locTStamp":"'+locTStamp+'"}}';
	WL.Logger.debug("sendMqtt json format  sendJson :: "+sendJson);
    WL.Logger.debug("geoLocationTopicName   hellllllllllllllllllllllo   ::");
	 var geoLocationTopicName = "dirMarketing/tracking/coord/"+conid;
     WL.Logger.debug("geoLocationTopicName      ::"+geoLocationTopicName);


    try {
       
         message = new Messaging.Message(sendJson);
         message.destinationName = geoLocationTopicName;       
         client.send(message);   
         WL.Logger.debug("sendMqtt send suc!!!!!!!!!!!!!!!!!!:: ");
        
         
    	} catch (error) {
    		WL.Logger.debug("send mqtt failed ..."+error.message);
    	} 
	
	
}

