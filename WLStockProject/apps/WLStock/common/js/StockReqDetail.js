/**
 * 
 */



function StocReqDetailLoad(reqID) {
	
	
//	alert("reqDetail::"+reqID);

	$.mobile.changePage("#StocReqDetailPage");
	
	loadStockReqDetail(reqID);

	
}

var REQID = "";

function loadStockReqDetail(reqID) {
	
	

	
	WL.Logger.debug("..............try. to...something like that");

	var invocationData = {
		adapter : 'StockReq', // adapter name
		procedure : 'getStockReqs',
		parameters : [reqID]
	// parameters if any
	};
	WL.Logger.debug("..............try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadStockReqDetailSuccess,
		onFailure : loadStockReqDetailFailure
	});
	
	
}

function loadStockReqDetailSuccess(result) {
	WL.Logger.debug("Retrieve success" + JSON.stringify(result));
	
	if (result.invocationResult.isSuccessful) {
		
		displayStockReqDetail(result.invocationResult.resultSet);
		
	} else {

	}
//	displayFeeds(result.invocationResult.resultSet);
}


function loadStockReqDetailFailure(result) {
	WL.Logger.debug("Retrieve failure");
}

function displayStockReqDetail(items) {
	
	
//	alert("REQSTORE::"+items[0].REQSTORE);
    
	
	
	var detailContent ='		<h3 style="padding-left: 6px;">Basic Info</h3>                                                                                                 '
	+'		<ul class="basicInfo ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-inset="true" style="margin-top:-12px;">  '
	+'			<li class="ui-li ui-li-static ui-btn-up-d ui-corner-top">                                                                                    '
	+'				<table style="width: 100%;">                                                                                                               '
	+'					<tbody><tr>                                                                                                                              '
	+'						<td width="40%"><span>지점</span></td>                                                                                                 '
	+'						<td align="right"><span class="name">'+items[0].REQSTORE+'</span></td>                                                                    '
	+'					</tr>                                                                                                                                    '
	+'				</tbody></table>                                                                                                                           '
	+'			</li>                                                                                                                                        '
	+'			<li class="ui-li ui-li-static ui-btn-up-d">                                                                                                  '
	+'				<table style="width: 100%;">                                                                                                               '
	+'					<tbody><tr>                                                                                                                              '
	+'						<td width="40%"><span>요청자</span></td>                                                                                               '
	+'						<td align="right"><span class="mobile">'+items[0].REQUESTR+'</span></td>                                                                  '
	+'					</tr>                                                                                                                                    '
	+'				</tbody></table>                                                                                                                           '
	+'			</li>                                                                                                                                        '
	+'			<li class="ui-li ui-li-static ui-btn-up-d ui-corner-bottom ui-li-last">                                                                      '
	+'				<table style="width: 100%;">                                                                                                               '
	+'					<tbody><tr>                                                                                                                              '
	+'						<td width="40%"><span>요청일</span></td>                                                                                               '
	+'						<td align="right"><span class="mobile">'+items[0].REQDATE+'</span></td>                                                                   '
	+'					</tr>                                                                                                                                    '
	+'				</tbody></table>                                                                                                                           '
	+'			</li>                                                                                                                                        '
	+'			<li class="ui-li ui-li-static ui-btn-up-d ui-corner-bottom ui-li-last">                                                                      '
	+'				<table style="width: 100%;">                                                                                                               '
	+'					<tbody><tr>                                                                                                                              '
	+'						<td width="40%"><span>입고요청일</span></td>                                                                                           '
	+'						<td align="right"><span class="mobile">'+items[0].RDELDATE+'</span></td>                                                                  '
	+'					</tr>                                                                                                                                    '
	+'				</tbody></table>                                                                                                                           '
	+'			</li>                                                                                                                                        '
	+'			<li class="ui-li ui-li-static ui-btn-up-d ui-corner-bottom ui-li-last">                                                                      '
	+'				<table style="width: 100%;">                                                                                                               '
	+'					<tbody><tr>                                                                                                                              '
	+'						<td width="40%"><span>입고담당</span></td>                                                                                             '
	+'						<td align="right"><span class="mobile">'+items[0].RECPNT+'</span></td>                                                                    '
	+'					</tr>                                                                                                                                    '
	+'				</tbody></table>                                                                                                                           '
	+'			</li>                                                                                                                                        '
	+'        </ul>                                                                                                                                      '
	+'                                                                                                                                                   '
	+'        <h3 style="padding-left: 6px;">물품 정보</h3>                                                                                              '
	+'		<ul class="cardInfo ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-inset="true" style="margin-top:-12px;">   '
	+'			<li class="ui-li ui-li-static ui-btn-up-d ui-corner-top">                                                                                    '
	+'				<table style="width: 100%;">                                                                                                               '
	+'					<tbody><tr>                                                                                                                              '
	+'						<td width="40%"><span>코드</span></td>                                                                                                 '
	+'						<td align="right"><span class="identityCard">'+items[0].STOCKITM+'</span></td>                                                            '
	+'					</tr>                                                                                                                                    '
	+'				</tbody></table>                                                                                                                           '
	+'			</li>                                                                                                                                        '
	+'			<li class="ui-li ui-li-static ui-btn-up-d">                                                                                                  '
	+'				<table style="width: 100%;">                                                                                                               '
	+'					<tbody><tr>                                                                                                                              '
	+'						<td width="40%"><span>수량</span></td>                                                                                                 '
	+'						<td align="right"><span class="passport">'+items[0].STOCKAMT+'</span></td>                                                                '
	+'					</tr>                                                                                                                                    '
	+'				</tbody></table>                                                                                                                           '
	+'			</li>                                                                                                                                        '
	+'       </ul>                                                                                                                                       ';
	
	
	$("#StocReqDetailContent").append(detailContent);                                                                                                   
	                                                                                                                                                     
    
    $( "#StocReqDetailContent" ).listview( "refresh" );
	

}


$("#orderOkBtn").click(function(){ alert("test::"+REQID)})




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

function displayOrderOk(items) { alert("reqID + " 발주 승인 완료")}

