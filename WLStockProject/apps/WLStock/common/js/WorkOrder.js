/**
 * 
 */

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
	
	
	$("#loginPopup").popup();
	$("#loginPopup").popup("open");
	$("#passwordInputField").val("");
	
//	mqttConnect();
	 
})



// LogOut butten click
$("#logOutBtn").click(function(){
	
	WL.Client.logout('LDAPRealm',{onSuccess: WL.Client.reloadApp});
	
  client.disconnect(); 
  console.log("disconnect");
	 
})




function mqttConnect(){
	
	// Make connection to the server.
	client = new Messaging.Client("192.168.0.171", 1883, "clientId");

	// Set up a callBacks used when the connection is completed, 
	// when a message arrives for this client and when the connection is lost. 
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;
	client.connect({onSuccess:onConnect});

	 
}

	function onConnect() {
	  // Once a connection has been made, make a subscription and send a message.
	  console.log("onConnect");
	  
	  
//	  var subscribeTopicName = "/inventory/delivery/"+ASNDVCL+"/instruction";
//	  client.subscribe("/World");
//	  message = new Messaging.Message("Hello");
//	  message.destinationName = "/World";
//	  client.send(message); 
	}
	function onConnectionLost(responseObject) {
	  if (responseObject.errorCode !== 0)
	    console.log("onConnectionLost:"+responseObject.errorMessage);
	}
	function onMessageArrived(message) {
	  console.log("onMessageArrived:"+message.payloadString);
	  $("#workOrderTextarea").append('<p style="color: blue; text-align: left">'+message.payloadString+'</p>');
	  
//	  client.disconnect(); 
	  
//	  console.log("disconnect");
	}	
	
function subscribe() {
	try {
		  var subscribeTopicName = "/inventory/delivery/"+ASNDVCL+"/instruction/response";
      var options = {qos:0, 
                     onFailure: function(responseObject) {alert(responseObject.errorMessage + subscribeTopicName);}};
      client.subscribe(subscribeTopicName, options);
      
      subscribeTopicName = "/inventory/delivery/"+ASNDVCL+"/instruction/response2";
      var options = {qos:0, 
                     onFailure: function(responseObject) {alert(responseObject.errorMessage + subscribeTopicName);}};
      client.subscribe(subscribeTopicName, options);
    } catch (error) {
      alert(error.message);
    } 
}

function mqttSend(msg) {
	try {
		 	var publishTopicName = "/inventory/delivery/"+ASNDVCL+"/instruction";
//	  	client.subscribe("/World");
		 	console.log("publishTopicName::"+publishTopicName);
	  	message = new Messaging.Message(msg);
	  	message.destinationName = publishTopicName;
	  	client.send(message); 
	  	
	  	
    } catch (error) {
      alert(error.message);
    } 
}
