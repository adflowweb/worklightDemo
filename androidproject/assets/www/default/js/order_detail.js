
/* JavaScript content from js/order_detail.js in folder common */
/**
 * 11.5. eylee order get delete add
 */
var orderlistCreated =false;
var myOrderHT;
var goorder = false;
/////////////////////////////////////////////////////////////
//  buyItembtn
function buyItembtn() {

//	WL.Logger.debug("press buyItembtn");
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....buyItembtn inside with go..before dummy " + wlid);		

		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("modifycartdetail inside :: "+conid+name+loginid);
	
		
		var item1 = null;
		var unitprc1 = null;
		var quantity = null;
		var itempic1 = null;
		var orderitem = null;
		var lefthtml = null;
		item1 = $('input[name="cartitem"]').val();
		unitprc1 = $('input[name="cartprice"]').val();
		// var quantity = $( "#quantityItem" ).val();amountItem
		quantity = $("#amountItem").val();
		itempic1 = $('input[name="itempic1"]').val();
		orderitem = $('input[name="orderitem"]').val();
		displayOrderPage(item1, unitprc1, itempic1, orderitem, conid);
		
	}
}

function buyItembtnwithcart() {


var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....buyItembtn inside with go..before dummy " + wlid);		

		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("modifycartdetail inside :: "+conid+name+loginid);
	
		var unitprc1 = null;
		var quantity = null;
		var itempic1 = null;
		var orderitem = null;
		var lefthtml = null;
		item1 = $('input[name="itemcodewithcart"]').val();
		unitprc1 = $('input[name="orderpricewithcart"]').val();
		// var quantity = $( "#quantityItem" ).val();amountItem
		quantity = $("#amountItem").val();
		itempic1 = $('input[name="itempic1withcart"]').val();
		orderitem = $('input[name="orderitemwithcart"]').val();
		displayOrderPage(item1, unitprc1, itempic1, orderitem, conid);

	}
}



function displayOrderPage(item1, unitprc1, itempic1, orderitem, conid) {
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....buyItembtn inside with go..before dummy " + wlid);		

		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("modifycartdetail inside :: "+conid+name+loginid);
		
		
		WL.Logger.debug("press orderPage before");
		$.mobile.changePage('#doOrderPage', {
			transition : "pop"
		});
		$("#list_order").empty();
		$("#orderUser").empty();
		$("#odercontent").empty();
		var item1= item1;
		var unitprc1 = unitprc1;
		var itempic1 =itempic1;
		var orderitem = orderitem;
		var conid = conid;

		// Create the listview if not created

			
			if (!goorder) {	
				
				$("#order_primary").append("<ul id='list_order'  data-role='listview'  data-inset='true' data-split-theme='c' data-split-icon='arrow-r' ></ul>");
				goorder = true;
	                      
				$("#order_primary").trigger("create");
				$("#orderUser").trigger("create");
				
			}
		
			
			
		WL.Logger.debug("press orderPage after :: " + item1 +unitprc1 + itempic1 +orderitem +conid);
//		$('#orderUser').empty();
//		$('#orderinfo').empty();
//		$('#orderinfo_left').empty();
////		$("#orderUser").trigger("create");
////		$("#orderinfo").trigger("create");
////		("#orderinfo_left").trigger("create");
//		$("#list_order").append('<h3>' + wlid + '님의 주문하실 상품</h3>');
		$("#list_order").append('<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-e ui-first-child">' + wlid + '님의 주문하실 상품</li>');
		$("#list_order")
		.append('<li><a onclick="gotoProductPage(' + item1 + ')" >'
		+ '<img width="100" height="100" src="' + imageurl + itempic1
		+ '" class="img_order">' + '</a></li>');		
		$("#orderUser").append('<input type="hidden" class="paymentitem1 " name="paymentitem1" value="'+item1+'"><input type="hidden" class="paymentunitprc1" name="paymentunitprc1" value="'+unitprc1+'"><input type="hidden" class="paymentitempic1" name="paymentitempic1" value="'+itempic1+'"><input type="hidden" class="paymentitem " name="paymentitem" value="'+orderitem+'"><input type="hidden" class="paymentconid " name="paymentconid" value="'+conid+'">');
		$("#orderUser").append(
				"제품코드 :: <br/>" + item1 + "<br/>제품명 :: <br/>" + orderitem
						+ "<br/>가격 :: <br/>" + unitprc1);
		$("#list_product").listview("refresh");
		
		
		
	}// end of else
	
	
} // end of dispalyorderpage function

$('#btn_order').bind('click', function() {
	myOrderHT = {};
		

	var paymentitem1 = null;
	paymentitem1 = $('input[name="paymentitem1"]').val();
	var paymentunitprc1 = null;
	paymentunitprc1 = $('input[name="paymentunitprc1"]').val();
	var paymentitempic1 = null;
	paymentitempic1 = $('input[name="paymentitempic1"]').val();
	var paymentitem = null;
	paymentitem = $('input[name="paymentitem"]').val();
	var paymentconid = null;
	paymentconid = $('input[name="paymentconid"]').val();
	
	
	var payment_card = null;
	payment_card = $('input[name="payment_card"]').val();
	var payment_cvc = null;
	payment_cvc = $('input[name="payment_cvc"]').val();
	var payment_expMon = null;
	payment_expMon = $('input[name="payment_expMon"]').val();
	var payment_expYear = null;
	payment_expYear = $('input[name="payment_expYear"]').val();

	myOrderHT["buyitem1"] =  paymentitem1;	 
	myOrderHT["buyunitprc1"] = paymentunitprc1;	
	myOrderHT["buyitempic1"] = paymentitempic1;	
	myOrderHT["buyitem"] = paymentitem ;	
	myOrderHT["buy_card"] = payment_card;	
	myOrderHT["buy_cvc"] = payment_cvc;	
	myOrderHT["buy_expMon"] = payment_expMon;
	myOrderHT["buy_expYear"] = payment_expYear;	
	
	
	addTranHistoryload(paymentconid, paymentitem1);
	console.log("payment_card :: "+payment_card+" payment_cvc :: "+payment_cvc + " payment_expMon :: "+payment_expMon +" payment_expYear :: "+payment_expYear);
	///////////////////////////////////////////////////////////

});



////////////////////////////////////////////////////////////////////////////////////////////


function addTranHistoryload(conid, itemcode1) {
	WL.Logger
			.debug(".........addTranHistoryload.....try. to...something like that");
	WL.Logger.debug("addTranHistoryload   conid " + conid);
	var invocationData = {
		adapter : 'MallAdapter',
		procedure : 'addTranHist',
		parameters : [ conid, itemcode1 ]
	};
	WL.Logger
			.debug(".......addTranHistoryload.......try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : addTranHistoryloadSuccess,
		onFailure : addTranHistoryloadFailure
	});
}
function addTranHistoryloadSuccess(result) {
	WL.Logger.debug("addTranHistoryloadSuccess Retrieve success"
			+ JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {
		addTranHistoryconfirm(result.invocationResult.resultSet);
	} else {
	}
}

function addTranHistoryloadFailure(result) {
	WL.Logger.debug("addTranHistoryloadFailure Retrieve failure");
}
function addTranHistoryconfirm(items) {
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....buyItembtn inside with go..before dummy " + wlid);		

		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("modifycartdetail inside :: "+conid+name+loginid);
	
		loadTranHistoryDetail(conid);
	}
	
}

// //////////////////////////////////////////////////////////////////////////
// wishlist listview page
function loadTranHistoryDetail(conid) {
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....buyItembtn inside with go..before dummy " + wlid);		

		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("modifycartdetail inside :: "+conid+name+loginid);
		var buyitem1 = myOrderHT["buyitem1"];
		var buyunitprc1 = myOrderHT["buyunitprc1"];	
		var buyitempic1 = myOrderHT["buyitempic1"];	
		var buyitem = myOrderHT["buyitem"];
		var buy_card = myOrderHT["buy_card"];	
		if(buy_card==null){
			buy_card = "결제 정보 없음";
		}
		var buy_cvc = myOrderHT["buy_cvc"];	
		var buy_expMon = myOrderHT["buy_expMon"];
		var buy_expYear = myOrderHT["buy_expYear"];	
		var lefthtml = '<a onclick="gotoProductPage(' + buyitem1 + ')" >'
		+ '<img width="100" height="100" src="' + imageurl + buyitempic1
		+ '" class="img_order">' + '</a>';
		console.log(" buyitem1 :: "+buyitem1+ " buyunitprc1 :: "+ buyunitprc1+" buyitempic1 :: "+buyitempic1+ " buyitem :: "+ buyitem+ " buy_card :: "+buy_card+" buy_cvc:: "+ buy_cvc+" buy_expMon:: "+buy_expMon+" buy_expYear :: "+ buy_expYear);
		$.mobile.changePage('#orderResultPage', {
		transition : "slide"
		});
		$('#orderReturnUser').empty();
		$('#orderReturninfo').empty();
		$('#orderReturninfo_left').empty();
		$('#orderPaymentInfo').empty();
		$('#orderReturnUser').html('<h3>' + wlid + '님의 결제하신 상품</h3>');
		
		$('#orderReturninfo').html(
				"제품코드 :: <br/>" + buyitem1 + "<br/>제품명 :: <br/>" + buyitem
						+ "<br/>가격 :: <br/>" + buyunitprc1);
		$('#orderReturninfo_left').html(lefthtml);
		$('#orderPaymentInfo').append('<h3>' + wlid + '님의 결제정보</h3>');
		$('#orderPaymentInfo').append('<h3> 카드정보 :' + buy_card + '</h3>');
	}

}


$('.btn_orderList').click(function (){
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....buyItembtn inside with go..before dummy " + wlid);		

		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("modifycartdetail inside :: "+conid+name+loginid);
	
		loadOrderlistitems(conid);
	}
	
	
});
//////////////////////////////////////////////////////////////////////////////////

function loadOrderlistitems(conid) {
	WL.Logger.debug(".........loadOrderlistitems.....try. to...something like that");

	var invocationData = {
		adapter : 'MallAdapter', // adapter name
		procedure : 'getTranHist',
		parameters : [conid]
	// parameters if any
	};
	WL.Logger.debug(".........loadOrderlistitems.....try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadOrderlistSQLQuerySuccess,
		onFailure : loadOrderlistSQLQueryFailure
	});

}
// load item end

function loadOrderlistSQLQuerySuccess(result) {
	WL.Logger.debug("loadOrderlistSQLQuerySuccess Retrieve success" + JSON.stringify(result));
	appendToOrderList(result.invocationResult.resultSet);
}

function loadOrderlistSQLQueryFailure(result) {
	WL.Logger.debug("loadOrderlistSQLQueryFailure Retrieve failure");
}


function appendToOrderList(items) {
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....buyItembtn inside with go..before dummy " + wlid);		

		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("modifycartdetail inside :: "+conid+name+loginid);
	
		//mqttConnection call
		
		
		$.mobile.changePage('#orderlistPage', {
	        transition : "pop"
	});
	$("#listTo_order").empty();
	// Create the listview if not created

	for ( var i = 0; i < items.length; i++) {
	        // ///////////////////////////////
	        
	        if (!orderlistCreated) {
	                
	                $("#content-orderlist")
	                                .append(
	                                                "<ul id='listTo_order'  data-role='listview'  data-inset='true' data-split-theme='c' data-split-icon='arrow-r' ></ul>");
	                orderlistCreated = true;

	                $("#content-orderlist").trigger("create");
	        
	        }

	        $("#listTo_order")
	                        .append(
	                                        '<li ><img border="0" height="100" src="'
	                                        + imageurl    + items[i].ITEMPIC1 + '"class="img_thumnail_order ui-li-thumb"><span class="tabone"><p><h7>'
	                                        + items[i].ITEMNAME
	                                        + '</h7></p><p><h8>'
	                                        + items[i].UNITPRC
	                                        + '</h8></p><p>구매일:'
	                                        + items[i].TRSTAMP
	                                        + '</p></span></li>');
	        
	        $("#listTo_order").listview("refresh");
	        // ////////////////////////////
	}
		
	}
	

}
// //go tp shoppinglistpage end
// ***************************************************************************************************


	