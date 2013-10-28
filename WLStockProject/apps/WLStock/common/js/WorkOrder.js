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
	

	
}

// ## 발송 버튼
$("#workOrderSendBtn").click(function(){
	
	 $('#workOrderSendOkPopup').popup("open");
	 
})


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