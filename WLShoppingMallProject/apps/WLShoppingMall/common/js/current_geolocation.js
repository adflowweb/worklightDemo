/**
 * 2013.11.07 eylee *
 * 
 */

// Wait for Cordova to load
//
//document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
//
//var autoGeolocation  = setInterval(getGeolocation, 1000);
var i=0;

//$('.btn_getGeolocation').click(function( ) {  
//	autoGeolocation  = setInterval(getGeolocation, 500);
//	WL.Logger.error("btn_getGeolocation");
//	
//});
$('.btn_clearGeolocation').click(function( ) {
	clearInterval(autoGeolocation);
	
});

function getGeolocation(client){
	WL.Logger.error("getGeolocation");
	$("#destination_i").append(i++);
			
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
// onSuccess Geolocation
//
function onSuccess(position) {
	
	var element = document.getElementById('geolocation');
	element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />'
			+ 'Longitude: ' + position.coords.longitude + '<br />';
	WL.Logger.error("onSuccess ");
	sendMqtt(position.coords.latitude, position.coords.longitude );
			
}

// onError Callback receives a PositionError object
//
function onError(error) {
	WL.Logger.error('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}


function sendMqtt(latitude, longitude) {
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);		
		loadDummy();	
		

	} else {
		console.log("else....username with go..before dummy " + wlid);		
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("btn_loginformPag :: "+conid+name+loginid);
	
	
	
	
	//	var username = getCookie("username");
		console.log("conid  :: "+conid);
		var latitude = latitude;
		var longitude = longitude;
		/////////////////////////////////////////////////////////////////////////
	//	make json data
		var t = new Date();
		var _Year = 1900 + t.getYear() ;
		var _Month = 1 + t.getMonth();
	 	
	 	var locTStamp = "" + _Year + _Month + t.getDate() + t.getHours() + t.getMinutes()+ t.getSeconds();
	 	
		var sendJson = '{"mobConLocation": {"userId": "'+loginid+'","curCoord": {"lat":'+latitude+', "long":'+longitude+'},"locTStamp":"'+locTStamp+'"}}';
	    WL.Logger.error("senJson :: "+sendJson);
		
	
	    try {
	        var geoLocationTopicName = "dirMarketing/tracking/coord/"+conid;
	        console.log("geoLocationTopicName::"+geoLocationTopicName);
	         message = new Messaging.Message(sendJson);
	         message.destinationName = geoLocationTopicName;
	         WL.Logger.error("sendMqtt send suc!!!!!!!!!!!!!!!!!!:: ");
	         client.send(message);     
	        
	         
	    	} catch (error) {
	    	alert(error.message);
	    	} 
	
	}   //////////////////// else end	
}

