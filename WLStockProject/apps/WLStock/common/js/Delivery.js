/**
 * 
 */


var DELID = "";

function deliveryInit(reqID){
	
	DELID = reqID
	
	$("#deliveryId").html("발주ID : "+ DELID);
	
//	alert("발주::");
	
	$.mobile.changePage("#deliveryOkPage");
	
}



$("#deliOkBtn").click(function(){
	
	var idWAREHOUS = $("#select-WAREHOUS").val();
	
	var idASNDVCL = $("#select-ASNDVCL").val();
	
	addDelivery(DELID,REQID,idWAREHOUS,idASNDVCL);

// updateOrderOk(REQID);
	 
})




// ## 승인 버튼
$("#deliBtn").click(function(){
	

	$('#delOkPopup').popup("open");
	 
})



function updateOrderOk(reqID) {

	
	WL.Logger.debug("..............try. to...something like that");

	var invocationData = {
		adapter : 'StockReq', // adapter name
		procedure : 'updateStockReq',
		parameters : [reqID]
	// parameters if any
	};
	WL.Logger.debug("..............try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : updateOrderOkSuccess,
		onFailure : updateOrderOkFailure
	});
	
	
}

function updateOrderOkSuccess(result) {
	WL.Logger.debug("Retrieve success" + JSON.stringify(result));
	
	if (result.invocationResult.isSuccessful) {
		
		displayOrderOk(result.invocationResult.resultSet);
		
	} else {

	}
//	displayFeeds(result.invocationResult.resultSet);
}


function updateOrderOkFailure(result) {
	WL.Logger.debug("Retrieve failure");
}

function displayOrderOk(items) { 
	$.mobile.changePage("#reqListPage");
	
    loadStockReqList();
 }
 
 

function addDelivery(delID,reqID,idWAREHOUS,idASNDVCL) {

	
	WL.Logger.debug("..............try. to...something like that");

	var invocationData = {
		adapter : 'StockReq', // adapter name
		procedure : 'addDelivery',
		parameters : [delID,reqID,idWAREHOUS,idASNDVCL]
	// parameters if any
	};
	WL.Logger.debug("..............try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : addDeliverySuccess,
		onFailure : addDeliveryFailure
	});
	
	
}

function addDeliverySuccess(result) {
	WL.Logger.debug("Retrieve success" + JSON.stringify(result));
	
	if (result.invocationResult.isSuccessful) {
		
		//재고요청 발주 승인 Update
		updateOrderOk(REQID);
		
//		displayAddDelivery(result.invocationResult.resultSet);
		
	} else {

	}
//	displayFeeds(result.invocationResult.resultSet);
}


function addDeliveryFailure(result) {
	WL.Logger.debug("Retrieve failure");
}




