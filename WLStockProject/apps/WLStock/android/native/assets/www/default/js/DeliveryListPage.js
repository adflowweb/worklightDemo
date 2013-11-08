
/* JavaScript content from js/DeliveryListPage.js in folder common */
/**
 * 
 */

$("#deliveryListBtn").click(function(){
	

	 deliveryListInit();
	 
})


function deliveryListInit(){
	
	
	
	$.mobile.changePage("#deliveryListPage");
	
	loadDeliveryList();
	
}


// Delivery List query
function loadDeliveryList() {
	
	WL.Logger.debug("..............try. to...something like that");
	var invocationData = {
		adapter : 'StockReq', // adapter name
		procedure : 'getDeliveryList',
		parameters : []
	// parameters if any
	};
	WL.Logger.debug("..............try. to...something like that");
	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadDeliveryListSuccess,
		onFailure : loadDeliveryListFailure
	});
	
	
}

function loadDeliveryListSuccess(result) {
	WL.Logger.debug("Retrieve success" + JSON.stringify(result));
	
	if (result.invocationResult.isSuccessful) {
		
		displayloadDeliveryList(result.invocationResult.resultSet);
		
	} else {

	}
//	displayFeeds(result.invocationResult.resultSet);
}


function loadDeliveryListFailure(result) {
	WL.Logger.debug("Retrieve failure");
}

function displayloadDeliveryList(items) { 
	
	$( "#deliveryListView" ).empty();
	
	var nameWAREHOUS = mappingNameWAREHOUS(items[0].WAREHOUS);
	var nameASNDVCL = mappingNameASNDVCL(items[0].ASNDVCL);
	
	
	for ( var i = 0; i < items.length ; i++) {
    	var list = $('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-first-child ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"> <a href="javascript:deliveryDetail(\''+items[i].DELID+'\')" class="ui-link-inherit">발주ID '+items[i].DELID+'</a> <p class="ui-li-desc">물류센터:'+ nameWAREHOUS+' 화물차량:'+nameASNDVCL + '</p></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
    	
    	$("#deliveryListView" ).append(list);
 	}
    
    $( "#deliveryListView" ).listview( "refresh" );
    
 }