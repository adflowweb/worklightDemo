/**
 * 2013.11.07 eylee *
 * 
 */

// Wait for Cordova to load
//
//document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
//
//var autoGeolocation;

    // Cordova is ready
    //

//function onDeviceReady() {
//    navigator.geolocation.getCurrentPosition(onSuccess, onError);
//    autoGeolocation  = setInterval(getGeolocation, 30000);   
//    autoGeolocation  = setInterval(getGeolocation, 10000);
//}

//var autoGeolocation  = setInterval(getGeolocation, 30000);
var i=0;

//$('.btn_getGeolocation').click(function( ) {  
//	autoGeolocation  = setInterval(getGeolocation, 500);
//	WL.Logger.error("btn_getGeolocation");
//	
//});
$('.btn_clearGeolocation').click(function( ) {
	clearInterval(autoGeolocation);
	
});

//function getGeolocation(client){
function getGeolocation(){
	WL.Logger.debug("getGeolocation entry point");
//	$("#destination_i").append(i++);
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
	WL.Logger.debug("navigator.geolocation.getCurrentPosition after .........");		
	WL.Logger.debug("getGeolocation client" + client);
	
}
// onSuccess Geolocation
//
function onSuccess(position) {	
	WL.Logger.debug("nonSuccessCallback after .........");		

	
//	$("#geolocation").append('Latitude: ' + position.coords.latitude + '<br />'
//			+ 'Longitude: ' + position.coords.longitude + '<br />');
	WL.Logger.error("onSuccess entry point......Latitude: "+ position.coords.latitude	+ "    Longitude: "  + position.coords.longitude);
	WL.Logger.debug("onSuccess inside i count (i++) : "+ i++);
	sendMqtt(position.coords.latitude, position.coords.longitude );
			
}

// onError Callback receives a PositionError object
//
function onError(error) {
	WL.Logger.debug("onErrorCallback after .........");		
	WL.Logger.debug('onError code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
//	$("#geolocation").append('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
	
}

function sendMqtt(latitude, longitude) {
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	WL.Logger.error("sendMqtt(latitude, longitude) entry point ...................  " + wlid);		
	var conid = userRealmht["conid"];
	WL.Logger.error("sendMqtt(latitude, longitude) entry point  conid ...................  " + conid );		
	var name = userRealmht["name"];
	var loginid = userRealmht["loginid"];	
	WL.Logger.error("btn_loginformPag :: "+conid+name+loginid);

	var sendlatitude = latitude;
	var sendlongitude = longitude;
	/////////////////////////////////////////////////////////////////////////
//	make json data
	var t = new Date();
	var _Year = 1900 + t.getYear() ;
	var _Month = 1 + t.getMonth();
 	
 	var locTStamp = "" + _Year + _Month + t.getDate() + t.getHours() + t.getMinutes()+ t.getSeconds();
 	
	var sendJson = '{"mobConLocation": {"userId": "'+conid+'","curCoord": {"lat":'+sendlatitude+', "long":'+sendlongitude+'},"locTStamp":"'+locTStamp+'"}}';
	WL.Logger.error("sendMqtt json format  sendJson :: "+sendJson);
    WL.Logger.error("geoLocationTopicName   hellllllllllllllllllllllo   ::");
    WL.Logger.error("hahahahahahah   hellllllllllllllllllllllo   ::");
	 var geoLocationTopicName = "dirMarketing/tracking/coord/"+conid;
     WL.Logger.error("geoLocationTopicName      ::"+geoLocationTopicName);
     WL.Logger.error("geoLocationTopicName   hellllllllllllllllllllllo   ::");

    try {
       
         message = new Messaging.Message(sendJson);
         message.destinationName = geoLocationTopicName;       
         client.send(message);   
         WL.Logger.error("sendMqtt send suc!!!!!!!!!!!!!!!!!!:: ");
        
         
    	} catch (error) {
    		WL.Logger.error("send mqtt failed ..."+error.message);
    	} 
	
	
}

