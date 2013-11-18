/**
 * 2013.11.07 eylee *
 * 
 */

// Wait for Cordova to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
//
var autoGeolocation;


function onDeviceReady() {

//    autoGeolocation  = setInterval(getGeolocation, 30000);   
    autoGeolocation  = setInterval(getGeolocation, 10000);
}

//var autoGeolocation  = setInterval(getGeolocation, 30000);
var i=0;

$('.btn_clearGeolocation').click(function( ) {
	clearInterval(autoGeolocation);
	
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

