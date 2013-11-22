/**
 * 
 */
 
var WAREHOUS = "";
var ASNDVCL = "";
var STATUS = "";
var REQSTORE = ""; 

function deliveryDetail(delID) {
	
//	alert("deliveryDetail::"+delID);

  DELID = delID;

	$.mobile.changePage("#deliveryDetailPage");
	
	loadDeliveryDetail(delID);

	
}



function loadDeliveryDetail(delID) {
		
	WL.Logger.debug("..............try. to...something like that");

	var invocationData = {
		adapter : 'StockReq', // adapter name
		procedure : 'getDeliveryDetail',
		parameters : [delID]
	// parameters if any
	};
	WL.Logger.debug("..............try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadDeliveryDetailSuccess,
		onFailure : loadDeliveryDetailFailure
	});
	
	
}

function loadDeliveryDetailSuccess(result) {
	WL.Logger.debug("Retrieve success" + JSON.stringify(result));
	
	if (result.invocationResult.isSuccessful) {
		
		displayDeliveryDetail(result.invocationResult.resultSet);
		
	} else {

	}
//	displayFeeds(result.invocationResult.resultSet);
}


function loadDeliveryDetailFailure(result) {
	WL.Logger.debug("Retrieve failure");
}

function displayDeliveryDetail(items) {
	
	
//	alert("REQSTORE::"+items[0].REQSTORE);


  WAREHOUS = items[0].WAREHOUS;
  ASNDVCL = items[0].ASNDVCL;
  STATUS = items[0].STATUS;
  REQSTORE = items[0].REQSTORE;
  
  
  // 좌표 초기화
  Lat = 0;
	Lng = 0;
  // 해당 차량의 좌표를 수신
  carSubscribe();
  
//  alert("WAREHOUS::"+WAREHOUS);


  $("#deliveryDetailHeader").html("발주ID "+items[0].DELID);

  var nameREQSTORE = mappingNameREQSTORE(items[0].REQSTORE);
  var nameREQUESTR = mappingNameREQUESTR(items[0].REQUESTR);
  var nameRECPNT = mappingNameREQUESTR(items[0].RECPNT);
  var nameWAREHOUS = mappingNameWAREHOUS(items[0].WAREHOUS);


	
	
	var detailContent ='		<h3 style="padding-left: 6px;">일반 정보</h3>                                                                                                 '
	+'		<ul class="basicInfo ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-inset="true" style="margin-top:-12px;">  '
	+'			<li class="ui-li ui-li-static ui-btn-up-d ui-corner-top">                                                                                    '
	+'				<table style="width: 100%;">                                                                                                               '
	+'					<tbody><tr>                                                                                                                              '
	+'						<td width="40%"><span>물류센터</span></td>                                                                                                 '
	+'						<td align="right"><span class="name">'+nameWAREHOUS+'</span></td>                                                                    '
	+'					</tr>                                                                                                                                    '
	+'				</tbody></table>                                                                                                                           '
	+'			</li>																																			'   
	+'			<li class="ui-li ui-li-static ui-btn-up-d">                                                                                    '
	+'				<table style="width: 100%;">                                                                                                               '
	+'					<tbody><tr>                                                                                                                              '
	+'						<td width="40%"><span>지점</span></td>                                                                                                 '
	+'						<td align="right"><span class="name">'+nameREQSTORE+'</span></td>                                                                    '
	+'					</tr>                                                                                                                                    '
	+'				</tbody></table>                                                                                                                           '
	+'			</li>                                                                                                                                        '
	+'			<li class="ui-li ui-li-static ui-btn-up-d">                                                                                                  '
	+'				<table style="width: 100%;">                                                                                                               '
	+'					<tbody><tr>                                                                                                                              '
	+'						<td width="40%"><span>요청자</span></td>                                                                                               '
	+'						<td align="right"><span class="mobile">'+nameREQUESTR+'</span></td>                                                                  '
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
	+'						<td align="right"><span class="mobile">'+nameRECPNT+'</span></td>                                                                    '
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
	
	 $( "#deliveryDetailContent" ).empty();
	
	$("#deliveryDetailContent").append(detailContent);  

}









