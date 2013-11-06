/**
 * mqtt connection and push banner
 */

mqttId = null;
function mqttConnection(id) {
	//////////////////////////////////////////////////////////
	
	
	var mqttResult = false;
	// Make connection to the server.
	WL.Logger.info("mqttConnection      method...inside....................");
	WL.Logger.info("new client first");
	mqttId = id;
	WL.Logger.info("id   ::  " + id);
	client = new Messaging.Client("192.168.0.171", 1883, id);
//	WL.Logger.info("new client first");
//	mqttId = id;
//	WL.Logger.info("id   ::  " + id);
	// Set up a callBacks used when the connection is completed,
	// when a message arrives for this client and when the connection is lost.
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;
	 
	client.connect({
		onSuccess : onConnect
	});

}
function onConnect() {
	// Once a connection has been made, make a subscription and send a
	// message.
	mqttResult = true;
	console.log("onConnect");
	WL.Logger.info("onConnect method inside ...............");
	bannerSubscribe(mqttId);

}


function onConnectionLost(responseObject) {
	if (responseObject.errorCode !== 0)
		console.log("onConnectionLost:" + responseObject.errorMessage);
}





function bannerSubscribe(id) {
	var clientId = id;
	WL.Logger.info("clientId  banner.....inside subscribe:: " + clientId);
	

	// //////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var subscribeBannerTopic = "/dmarketing/consumers/" + clientId;
	WL.Logger.info("userid  subscribeBannerTopic.....inside subscribe:: "
			+ subscribeBannerTopic);
	subscribeBannerTopic.trim();
	var subscribeOptions = {
		qos : 0,
		onSuccess : onSuccess,
		onFailure : onFailure
	};
	client.subscribe(subscribeBannerTopic, subscribeOptions);
	

}

function onFailure(responseObject) {
	console.log("onFailure:" + responseObject.invovationContext + " "
			+ responseObject.errorCode + " " + responseObject.errorReason);
}

function onSuccess(responseObject) {

	WL.Logger.info("onSuccess:" + "................");
	

}


function onMessageArrived(message) {
	console.log("onMessageArrived: payload=" + message.payloadString + " qos="
			+ message.qos);

	WL.Logger.info("onMessageArrived method inside  message.payloadString ..............."+ message.payloadString );
	loadWishlistBanner(message.payloadString);

}


function loadWishlistBanner(str){
	

	WL.Logger.info("str  ::..................................."+str);
	$("#mqttTextBanner").html(str);
}
