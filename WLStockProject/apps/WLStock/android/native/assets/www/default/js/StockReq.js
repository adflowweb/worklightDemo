
/* JavaScript content from js/StockReq.js in folder common */


// 재고 확보 요청 리스트 호출
$("#reqListBtn").click(function requestList() {
	
	$.mobile.changePage("#reqListPage");
	
    loadStockReqList();

});




function StocReqDetail(reqID) {
	
//	alert("reqDetail::"+reqID);
	$.mobile.changePage("#StocReqDetailPage");
	
	
//	alert("11111::");
	StocReqDetailLoad(reqID);
//	alert("11111::");

	
}

$("#btn").click(function(){ alert("test")})

function loadStockReqList() {

	
	WL.Logger.debug("..............try. to...something like that");

	var invocationData = {
		adapter : 'StockReq', // adapter name
		procedure : 'getStockReqList',
		parameters : []
	// parameters if any
	};
	WL.Logger.debug("..............try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadStockReqListSuccess,
		onFailure : loadStockReqListFailure
	});
	
	
}

function loadStockReqListSuccess(result) {
	WL.Logger.debug("Retrieve success" + JSON.stringify(result));
	
	if (result.invocationResult.isSuccessful) {
		
		displayResult(result.invocationResult.resultSet);
		
	} else {

	}
//	displayFeeds(result.invocationResult.resultSet);
}


function loadStockReqListFailure(result) {
	WL.Logger.debug("Retrieve failure");
}

function displayResult(items) {
	
	$( "#reqlistview" ).empty();
	
	var nameREQSTORE = mappingNameREQSTORE(items[0].REQSTORE);
	
	for ( var i = 0; i < items.length ; i++) {
    	var list = $('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-first-child ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"> <a href="javascript:StocReqDetail(\''+items[i].REQID+'\')" class="ui-link-inherit">요청ID '+items[i].REQID+'</a> <p class="ui-li-desc">지점:'+ nameREQSTORE+' 입고요청날짜:'+items[i].RDELDATE + '</p></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
    	
    	$("#reqlistview" ).append(list);
 	}
    
    $( "#reqlistview" ).listview( "refresh" );
	

}


