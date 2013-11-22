/**
 * 
 */
 

$("#transDetailBtn").click(function(){
	
	 TransDetailLoad(DELID);
	 
})

function TransDetailLoad(delID) {
	
//	alert("TransDetail::"+delID);

  

	$.mobile.changePage("#TransDetailPage");
	
	displayTransDetail(delID);
	
//	loadTransDetail(delID);

	
}


function displayTransDetail(delID) {
	
	
//	alert("displayTransDetail::"+delID);
	
//	alert("WAREHOUS222::"+WAREHOUS);


  $("#TransDetailHeader").html("발주ID "+delID);
  
  var nameWAREHOUS = mappingNameWAREHOUS(WAREHOUS);
  var nameASNDVCL = mappingNameASNDVCL(ASNDVCL);
  var nameSTATUS = mappingNameSTATUS(STATUS);
  var nameREQSTORE = mappingNameREQSTORE(REQSTORE);
  
//  alert("nameWAREHOUS::"+nameWAREHOUS);
  
  
  var locat = '';
  var pickup = '';
  
  switch (STATUS) {
			case "L":
				locat = "물류 센터";
				pickup = "미완료";
				break;

			case "O":	
				locat = "운송 중";
				pickup = "완료";
				break;
				
			case "T":	
				locat = "운송 중";
				pickup = "완료";
				break;

			case "U":	
				locat = nameREQSTORE;
				pickup = "완료";
				break;

			case "C":	
				locat = nameREQSTORE;
				pickup = "완료";
				break;

			default:
			  locat = "";
				pickup = "";
				break;
		};


	
	
	var detailContent ='		<h3 style="padding-left: 6px;">운송 정보</h3>                                                                                                 '
	+'		<ul class="basicInfo ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-inset="true" style="margin-top:-12px;">  '
	+'			<li class="ui-li ui-li-static ui-btn-up-d ui-corner-top">                                                                                    '
	+'				<table style="width: 100%;">                                                                                                               '
	+'					<tbody><tr>                                                                                                                              '
	+'						<td width="40%"><span>차량 번호</span></td>                                                                                                 '
	+'						<td align="right"><span class="name">'+ASNDVCL+'</span></td>                                                                    '
	+'					</tr>                                                                                                                                    '
	+'				</tbody></table>                                                                                                                           '
	+'			</li>   																	'
	+'			<li class="ui-li ui-li-static ui-btn-up-d">                                                                                    '
	+'				<table style="width: 100%;">                                                                                                               '
	+'					<tbody><tr>                                                                                                                              '
	+'						<td width="40%"><span>운전자</span></td>                                                                                                 '
	+'						<td align="right"><span class="name">'+nameASNDVCL+'</span></td>                                                                    '
	+'					</tr>                                                                                                                                    '
	+'				</tbody></table>                                                                                                                           '
	+'			</li>                                                                                                                                        '
	+'        </ul>                                                                                                                                      '
	+'                                                                                                                                                   '
	+'        <h3 style="padding-left: 6px;">운송 상태</h3>                                                                                              '
	+'		<ul class="cardInfo ui-listview ui-listview-inset ui-corner-all ui-shadow" data-role="listview" data-inset="true" style="margin-top:-12px;">   '
	+'			<li class="ui-li ui-li-static ui-btn-up-d ui-corner-top">                                                                                    '
	+'				<table style="width: 100%;">                                                                                                               '
	+'					<tbody><tr>                                                                                                                              '
	+'						<td width="40%"><span>위치</span></td>                                                                                                 '
	+'						<td align="right"><span class="identityCard">'+locat+'</span></td>                                                            '
	+'					</tr>                                                                                                                                    '
	+'				</tbody></table>                                                                                                                           '
	+'			</li>                                                                                                                                        '
	+'			<li class="ui-li ui-li-static ui-btn-up-d">                                                                                                  '
	+'				<table style="width: 100%;">                                                                                                               '
	+'					<tbody><tr>                                                                                                                              '
	+'						<td width="40%"><span>상차</span></td>                                                                                                 '
	+'						<td align="right"><span class="passport">'+pickup+'</span></td>                                                                '
	+'					</tr>                                                                                                                                    '
	+'				</tbody></table>                                                                                                                           '
	+'			</li>                                                                                                                                        '
	+'			<li class="ui-li ui-li-static ui-btn-up-d">                                                                                                  '
	+'				<table style="width: 100%;">                                                                                                               '
	+'					<tbody><tr>                                                                                                                              '
	+'						<td width="40%"><span>상태</span></td>                                                                                                 '
	+'						<td align="right"><span class="passport">'+nameSTATUS+'</span></td>                                                                '
	+'					</tr>                                                                                                                                    '
	+'				</tbody></table>                                                                                                                           '
	+'			</li>                                                                                                                                        '

	+'       </ul>                                                                                                                                       ';
	
	 $( "#TransDetailContent" ).empty();
	
	$("#TransDetailContent").append(detailContent);  

}









