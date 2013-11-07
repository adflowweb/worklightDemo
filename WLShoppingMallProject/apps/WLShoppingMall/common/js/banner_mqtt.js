/**
 * mqtt connection and push banner
 */

mqttId = null;
var bannerHT;
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


	var subscribeBannerTopic = "dirMarketing/msg/on/" + clientId;
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
//	loadWishlistBanner(message.payloadString);
	
	
		
	var admessage = JSON.parse(message.payloadString);
	WL.Logger.error("contact.dirMMsg.headLineText , " + admessage.dirMMsg.headLineText);
	var headLineText =  admessage.dirMMsg.headLineText;
	var adItem = admessage.dirMMsg.adItem;  
	var adText = admessage.dirMMsg.adText;
	var adTarget = admessage.dirMMsg.adTarget;
	
	loadBannerDetail(headLineText, adItem, adText,adTarget);

}


function loadBannerDetail(headLineText, adItem, adText, adTarget){
	
	WL.Logger.info("str  ::..................................."+adItem+headLineText+adText);
	bannerHT = {};
	
	bannerHT["headLineText"] =  headLineText;	 
	bannerHT["adItem"] = adItem;	
	bannerHT["adText"] = adText;	
	bannerHT["adTarget"] = adTarget ;	
	
	
	var finderadItem = adItem;

	WL.Logger
			.debug("....loadBannerDetail..........try. to...something like that :: finderadItem"+finderadItem);

	var invocationData = {
		adapter : 'MallAdapter', // adapter name
		procedure : 'getProduct',
		parameters : [ finderadItem ]
	};
	WL.Logger
			.debug("......loadBannerDetail........try. to...something like that :: finderadItem"+finderadItem);

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadBannerDetailSuccess,
		onFailure : loadBannerDetaillFailure
	});

}

function loadBannerDetailSuccess(result) {
	WL.Logger.debug("loadBannerDetailSuccess Retrieve success"
			+ JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {
		console.log("loadBannerDetailSuccess");
		console.log(result.invocationResult.resultSet);
		displayBanner(result.invocationResult.resultSet);

	} else {

	}
}

function loadBannerDetaillFailure(result) {
	WL.Logger.debug("loadBannerDetaillFailure Retrieve failure");
}

function displayBanner(items) {
		
	
	var headLineText = bannerHT["headLineText"];
	var adItem = bannerHT["adItem"];	
	var adText = bannerHT["adText"] ;	
	var adTarget = bannerHT["adTarget"];		

	$('#wishlistheader').empty();
	var ITEMCODE = null;
	var ITEMPIC1 = null;
	
	ITEMCODE = items[0].ITEMCODE;
	ITEMPIC1 = items[0].ITEMPIC1;		

	$('#wishlistheader').attr('onclick', 'javascript:gotoAdsProduct();');
	$('#wishlistheader').append('<div id="bannerUser"><h3>'+ adTarget +'님이 좋아하실 상품</h3></div>');
	$('#wishlistheader').append('<div id="bannerAdvertisefor" class="ui-grid-d"><div style="float:left;width:120px;" class="ui-block-a"><p id="orderReturninfo_left"><a class="goAdsProduct"><img width="100" height="100" class="img_order" src="'+ imageurl+ ITEMPIC1+'"></p></div><div style="width:50%" class="ui-block-b"><div id="banner_right_col"><br/><p id="bannerinfo">'+headLineText+'<br><h7 id="banneradtxt">'+adText+'</h7></p></div></div></div>');
	$("#wishlistheader").trigger("create");

}

function gotoAdsProduct(){
//	alert("livedasdf");
	var adItem = bannerHT["adItem"];	
	gotoProductPage(adItem);
}