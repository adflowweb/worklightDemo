/**
 * mqtt connection and push banner
 */


var bannerHT;
var client;
var mqttResult = false;

function mqttConnection(wlid) {
	//////////////////////////////////////////////////////////
	   
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("btn_loginformPag :: "+conid+name+loginid);
	
		
		// Make connection to the server.
		WL.Logger.info("mqttConnection      method...inside....................");
		
		client = new Messaging.Client("192.168.0.171", 1883, conid);
		WL.Logger.debug("mqttConnection client" + client);
	    
	
		client.onConnectionLost = onConnectionLost;
		client.onMessageArrived = onMessageArrived;
       
		client.connect({
			onSuccess : onConnect,
			onFailure : onConnectFailure
		});
	

}
function onConnect() {
	// Once a connection has been made, make a subscription and send a
	// message.
			
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("btn_loginformPag :: "+conid+name+loginid);
		console.log("onConnect");
		WL.Logger.info("onConnect method inside ...............");
		bannerSubscribe(conid);
		// for gps, mqttconnection check mqttResult
		mqttResult = true;

}

function onConnectFailure(responseObject) {
	 console.log("onFailure:"+responseObject.ivocationContext+" "+responseObject.errorCode+" "+responseObject.errorMessage);
	 
}




function onConnectionLost(responseObject) {
	if (responseObject.errorCode !== 0)
		console.log("onConnectionLost:" + responseObject.errorMessage);
	mqttResult = false;
}





function bannerSubscribe(conid) {
	var clientId = conid;
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
		
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("btn_loginformPag :: "+conid+name+loginid);
		var headLineText = bannerHT["headLineText"];
		var adItem = bannerHT["adItem"];	
		var adText = bannerHT["adText"] ;	
		var adTarget = bannerHT["adTarget"];		
	
		$('#multiwishlistheader').empty();
		var ITEMCODE = null;
		var ITEMPIC1 = null;
		
		ITEMCODE = items[0].ITEMCODE;
		ITEMPIC1 = items[0].ITEMPIC1;		
	    WL.Logger.error("$('#multiwishlistheader').empty(); after " + ITEMCODE+  ITEMPIC1);
		$('#multiwishlistheader').attr('onclick', 'javascript:gotoAdsProduct();');
		$('#multiwishlistheader').append('<div id="bannerUser"><h3>'+ adTarget +'님이 좋아하실 상품</h3></div>');
		$('#multiwishlistheader').append('<div id="bannerAdvertisefor" class="ui-grid-d"><div style="float:left;width:120px;" class="ui-block-a"><p id="orderReturninfo_left"><a class="goAdsProduct"><img width="100" height="100" class="img_order" src="'+ imageurl+ ITEMPIC1+'"></p></div><div style="width:50%" class="ui-block-b"><div id="banner_right_col"><br/><p id="bannerinfo">'+headLineText+'<br><h7 id="banneradtxt">'+adText+'</h7></p></div></div></div>');
		$("#multiwishlistheader").trigger("create");
	
}
//{"dirMMsg":{"hotDealType":"off","headLineText":"파격 할인 소식","adText":"바이크 투어링을 위한 노스페이스 콤포트 텐트 50% 할인 특가!","adDetails":"2013년 12월 31일까지 노스페이스 텐트 이월 전품목에 대해 50% 할인 특가를 실시합니다. 매장 한정 이벤트이며 재고 소진 시까지 진행합니다.","adLoc":{"longitude":127.056023,"latitude":37.491732},"adItem":"0000000031","adTarget":"한지름"}}


function gotoAdsProduct(){
//	alert("livedasdf");
	var adItem = bannerHT["adItem"];	
	gotoProductPage(adItem);
}