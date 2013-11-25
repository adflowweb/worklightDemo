
/* JavaScript content from js/WorkOrder.js in folder common */
/**
 * 
 */
 
var ClientId = "C111";

$("#workOrderBtn").click(function(){
	
	 workOrderLoad(DELID);
	 
})

function workOrderLoad(delID) {
	
//	alert("TransDetail::"+delID);

  $("#workOrderHeader").html("차량번호:"+ ASNDVCL + " 작업 지시");
  
  $("#workOrderTextarea").empty();

	$.mobile.changePage("#workOrderPage");
	
		  subscribe();
	
	
}

// ## 발송 버튼
$("#workOrderSendBtn").click(function(){
	
//	 $('#workOrderSendOkPopup').popup("open");


	msgSend();
	

  
	 
})

function msgSend() {
	var msg = $("#msgSendText").val();
	

	
	mqttSend(msg);
	$("#workOrderTextarea").append('<p style="color: purple; text-align: right">'+msg+'</p>');
	$("#msgSendText").html('');
	$("#msgSendText").empty();
	
	
}



// 발송 OK 버튼
$("#workOrderSendOkBtn").click(function(){
	
	var t = new Date();
	var _Year = 1900 + t.getYear() ;
	var _Month = 1 + t.getMonth();
	
	var instText = $("#workOrderTextarea").val();
	
//	alert("DELID::"+ DELID);
	
	var trStamp = "" + _Year + _Month + t.getDate() + t.getHours() + t.getMinutes();
	
//	alert("trStamp::"+ trStamp);


   addWorkOrder(DELID, instText, trStamp);
	 
})



function addWorkOrder(delID, instText, trStamp) {
		
	WL.Logger.debug("..............try. to...something like that");

	var invocationData = {
		adapter : 'StockReq', // adapter name
		procedure : 'addWorkOrder',
		parameters : [delID, instText, trStamp]
	// parameters if any
	};
	WL.Logger.debug("..............try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : addWorkOrderSuccess,
		onFailure : addWorkOrderFailure
	});
	
	
}

function addWorkOrderSuccess(result) {
	WL.Logger.debug("Retrieve success" + JSON.stringify(result));
	
	if (result.invocationResult.isSuccessful) {
		
		displayAddWorkOrder();
		
	} else {

	}
//	displayFeeds(result.invocationResult.resultSet);
}


function addWorkOrderFailure(result) {
	WL.Logger.debug("Retrieve failure");
}


function displayAddWorkOrder() { 
	
	//다시 발주 리스트 화면으로.
	deliveryListInit();
 }
 
 
 
//#### MQTT TEST ######

// Login butten click
$("#loginBtn").click(function(){
	
	
	  loadLoginDummy();
//	LDAPRealmChallengeHandler.handleChallenge();
	
//	$("#loginPopup").popup();
//	$("#loginPopup").popup("open");
//	$("#passwordInputField").val("");
	
//	mqttConnect();
	 
})

// Login Dummy call
function loadLoginDummy() {
		
	WL.Logger.debug("..............try. to...something like that");

	var invocationData = {
		adapter : 'StockReq', // adapter name
		procedure : 'loginDummy',
		parameters : []
	// parameters if any
	};
	WL.Logger.debug("..............try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadLoginDummySuccess,
		onFailure : loadLoginDummyFailure
	});
	
	
}

function loadLoginDummySuccess(result) {
	WL.Logger.debug("Retrieve success" + JSON.stringify(result));
}


function loadLoginDummyFailure(result) {
	WL.Logger.debug("Retrieve failure");
}



// LogOut butten click
$("#logOutBtn").click(function(){
	WL.Logger.error("logOutBtn aaa");
	
	WL.Client.logout('LDAPRealm',{onSuccess: WL.Client.reloadApp});
	
//  client.disconnect();
//  loginCheck = true; 
  WL.Logger.error("disconnectaa");
	 
})


var client ;

function mqttConnect(){
	
	//#####   MQTT start ########
	// Make connection to the server.
	client = new Messaging.Client("192.168.0.171", 1883, ClientId);

	// Set up a callBacks used when the connection is completed, 
	// when a message arrives for this client and when the connection is lost. 
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;
	client.connect({onSuccess:onConnect});

  //#####   MQTT Web Socket end ########



	 
}

	function onConnect() {
	  // Once a connection has been made, make a subscription and send a message.
	  WL.Logger.debug("onConnect");
	  
	  
//	  var subscribeTopicName = "/inventory/delivery/"+ASNDVCL+"/instruction";
//	  client.subscribe("/World");
//	  message = new Messaging.Message("Hello");
//	  message.destinationName = "/World";
//	  client.send(message); 
	}
	function onConnectionLost(responseObject) {
	  if (responseObject.errorCode !== 0)
	    WL.Logger.debug("onConnectionLost:"+responseObject.errorMessage);
	}
	function onMessageArrived(message) {
	  WL.Logger.error("message.destinationName:"+message.destinationName);
	  
	  var json_mes = JSON.parse(message.payloadString);
	  

		if (message.destinationName.indexOf("coord")) {
			
			Lat =  json_mes.vehLocation.curCoord.lat;
			
			Lng =  json_mes.vehLocation.curCoord.long;
			
			WL.Logger.error("onMessageArrived .Lat, Lng:"+Lat+", "+ Lng);
			
			carUnsubscribe();
			
			
		} else if (message.destinationName.indexOf("adHocInst")) {
			
			
	  
//	  WL.Logger.error("onMessageArrived:"+message.payloadString);
	  
	  	var respCodeName = mappingNamerespCode(json_mes.instResp.respDetails.respCode);
	  
	  	alert( "[차량번호]:"+ json_mes.instResp.vehId +"\n"+json_mes.instResp.respDetails.origInstId+"에 대한 응답"+"\n"+"[발주번호]:"+json_mes.instResp.respDetails.origInstId+"\n"+ "[상태]:"+ respCodeName +"\n"+ "[Msg]:"+ json_mes.instResp.respDetails.respBody+"\n"+"[응답시간]:"+json_mes.instResp.respDetails.instTStamp);
			
//			$("#workOrderTextarea").append('<p style="color: purple; text-align: left">'+json_mes.instResp.respDetails.respBody+'</p>');
				
		}
	  
	  
	  
//	  $("#workOrderTextarea").append('<p style="color: blue; text-align: left">'+message.payloadString+'</p>');
	  
//	  client.disconnect(); 
	  
//	  WL.Logger.debug("disconnect");
	}	
	
function subscribe() {
	try {
		  var subscribeTopicName = "invenReq/delivery/adHocInst/+/resp";
      var options = {qos:0, 
                     onFailure: function(responseObject) {alert(responseObject.errorMessage + subscribeTopicName);}};
      client.subscribe(subscribeTopicName, options);
    } catch (error) {
      alert(error.message);
    } 
}

function mqttSend(msg) {
	try {
		 	var publishTopicName = "invenReq/delivery/adHocInst/"+ASNDVCL+"/send";

		 	WL.Logger.debug("publishTopicName::"+publishTopicName);
		 	var respCode = "2";
		 	
		 	var t = new Date();
			var _Year = 1900 + t.getYear() ;
			var _Month = 1 + t.getMonth();
		 	
		 	var instTStamp = "" + _Year + _Month + t.getDate() + t.getHours() + t.getMinutes()+ t.getSeconds();
		 	
		 	var sendMsg = '{"instResp": {"vehId": "'+ASNDVCL+'","respDetails": {"origInstId":"'+ASNDVCL+'-'+instTStamp+'","delId":"'+DELID+'", "sReqId":"'+REQID+'","respCode":"'+respCode+'", "respBody":"'+msg+'","instTStamp":"'+instTStamp+'"}}}'
		 	
		 	

		 	
		 	
	  	message = new Messaging.Message(sendMsg);
	  	message.destinationName = publishTopicName;
	  	client.send(message); 
	  	
	  	
    } catch (error) {
      alert(error.message);
    } 
}

//// ##  MQTT Android Loging start ##
//function subscribeSucceeded(result) {
//	WL.Client.logout("Subscribed to " + result.invocationContext.filter + "Ok");
//
//}
//
//function subscribeFailed(result) {
//	WL.Client.logout("Subscribe to " + result.invocationContext.filter + " failed");
//}

//window.onbeforeunload = function() {
//	WL.Logger.error("disconnect_first");
//	
//	WL.Client.logout('LDAPRealm',{onSuccess: alert("onbeforeunload")});
//	client.disconnect();
//	loginCheck = true; 
//	WL.Logger.error("disconnectaa");
//};



