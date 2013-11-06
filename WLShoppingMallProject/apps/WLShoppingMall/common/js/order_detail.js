/**
 * 11.5. eylee order get delete add
 */

// ///////////////////////////////////////////////////////////
function buyItembtn() {

	var conid = getCookie("username");
	WL.Logger.debug("hello getCookie username :: " + conid);

	if (conid == null || conid == "") {
		console.log(" username null check , and before loadDummy() " + conid);
		loadDummy();

	} else {
		console.log(" username null check , and before loadDummy() " + conid);
		console.log("else....username with go..after dummy " + conid);
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

	var conid = getCookie("username");
	WL.Logger.debug("hello getCookie username :: " + conid);

	if (conid == null || conid == "") {
		console.log(" username null check , and before loadDummy() " + conid);
		loadDummy();

	} else {
		console.log(" username null check , and before loadDummy() " + conid);
		console.log("else....username with go..after dummy " + conid);
		var item1 = null;
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

function buyItembtnwithwish() {

	var conid = getCookie("username");
	WL.Logger.debug("hello getCookie username :: " + conid);

	if (conid == null || conid == "") {
		console.log(" username null check , and before loadDummy() " + conid);
		loadDummy();

	} else {
		console.log(" username null check , and before loadDummy() " + conid);
		console.log("else....username with go..after dummy " + conid);
		var item1 = null;
		var unitprc1 = null;
		var quantity = null;
		var itempic1 = null;
		var orderitem = null;
		var lefthtml = null;
		item1 = $('input[name="itemcodewithwish"]').val();
		unitprc1 = $('input[name="orderpricewithwish"]').val();
		// var quantity = $( "#quantityItem" ).val();amountItem
		quantity = $("#amountItem").val();
		itempic1 = $('input[name="itempic1withwish"]').val();
		orderitem = $('input[name="orderitemwithwish"]').val();
		displayOrderPage(item1, unitprc1, itempic1, orderitem, conid);

	}
}

function displayOrderPage(item1, unitprc1, itempic1, orderitem, conid) {
	console.log("item1 :: " + item1 + "unitprc1 :: " + unitprc1 + "end");
	// addCartitemload(conid, item1, quantity, unitprc1);
	lefthtml = '<a onclick="gotoProductPage(' + item1 + ')" >'
			+ '<img width="100" height="100" src="' + imageurl + itempic1
			+ '" class="img_order">' + '</a>';
	$.mobile.changePage('#orderPage', {
		transition : "slide"
	});
	$('#orderUser').empty();
	$('#orderinfo').empty();
	$('#orderinfo_left').empty();
	$('#orderUser').html('<h3>' + conid + '님의 주문하실 상품</h3>');
	$('#orderUser').append('<input type="hidden" class="paymentitem1 " name="paymentitem1" value="'+item1+'"><input type="hidden" class="paymentunitprc1" name="paymentunitprc1" value="'+unitprc1+'"><input type="hidden" class="paymentitempic1" name="paymentitempic1" value="'+itempic1+'"><input type="hidden" class="paymentitem " name="paymentitem" value="'+orderitem+'"><input type="hidden" class="paymentconid " name="paymentconid" value="'+conid+'">');
	$('#orderinfo').html(
			"제품코드 :: <br/>" + item1 + "<br/>제품명 :: <br/>" + orderitem
					+ "<br/>가격 :: <br/>" + unitprc1);
	$('#orderinfo_left').html(lefthtml);

}
var myOrderHT;
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
	// loadWishlistitems(conid);
	var conid = getCookie("username");
	WL.Logger.debug("hello getCookie username :: " + conid);

	if (conid == null || conid == "") {
		console.log(" username null check , and before loadDummy() " + conid);
		loadDummy();

	} else {		
		console.log("else....username with go..after dummy " + conid);
		loadTranHistoryDetail(conid);
	}
	
}

// //////////////////////////////////////////////////////////////////////////
// wishlist listview page
function loadTranHistoryDetail(conid) {
	
	
	var buyitem1 = myOrderHT["buyitem1"];
	var buyunitprc1 = myOrderHT["buyunitprc1"];	
	var buyitempic1 = myOrderHT["buyitempic1"];	
	var buyitem = myOrderHT["buyitem"];
	var buy_card = myOrderHT["buy_card"];	
	var buy_cvc = myOrderHT["buy_cvc"];	
	var buy_expMon = myOrderHT["buy_expMon"];
	var buy_expYear = myOrderHT["buy_expYear"];	
	
	console.log(" buyitem1 :: "+buyitem1+ " buyunitprc1 :: "+ buyunitprc1+" buyitempic1 :: "+buyitempic1+ " buyitem :: "+ buyitem+ " buy_card :: "+buy_card+" buy_cvc:: "+ buy_cvc+" buy_expMon:: "+buy_expMon+" buy_expYear :: "+ buy_expYear);
	$.mobile.changePage('#orderResultPage', {
	transition : "slide"
	});
	$('#orderReturnUser').empty();
	$('#orderReturninfo').empty();
	$('#orderReturninfo_left').empty();
	$('#orderPaymentInfo').empty();
	$('#orderReturnUser').html('<h3>' + conid + '님의 결제하신 상품</h3>');
	
	$('#orderReturninfo').html(
			"제품코드 :: <br/>" + buyitem1 + "<br/>제품명 :: <br/>" + buyitem
					+ "<br/>가격 :: <br/>" + buyunitprc1);
	$('#orderReturninfo_left').html(lefthtml);
	$('#orderPaymentInfo').append('<h3>' + conid + '님의 결제정보</h3>');
	$('#orderPaymentInfo').append('<h3> 카드정보 :' + buy_card + '</h3>');

}


$('#btn_orderList').click(function (){
	
	var conid = getCookie("username");
	WL.Logger.debug("hello getCookie username :: " + conid);

	if (conid == null || conid == "") {
		console.log(" username null check , and before loadDummy() " + conid);
		loadDummy();

	} else {		
		console.log("else....username with go..after dummy " + conid);
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
	$.mobile.changePage('#orderlistPage', {
		transition : "pop"
	});
	$("#list_order").empty();
	// Create the listview if not created
	
	for ( var i = 0; i < items.length; i++) {
		// ///////////////////////////////
		
		if (!productlistCreated) {
			
			$(".content-orderlist")
					.append(
							"<ul id='list_order'  data-role='listview'  data-inset='true' data-split-theme='c' data-split-icon='arrow-r'  data-filter='true' data-filter-placeholder='제품명 검색'></ul>");
			productlistCreated = true;

			$(".content-orderlist").trigger("create");
			$("#list_order").append(
					'<li data-role="list-divider"><h3>구매 리스트</h3></li>');
		}

		$("#list_order")
				.append(
						'<li ><img border="0" height="100" src="'
						+ imageurl 	+ items[i].ITEMPIC1 + '"class="img_thumnail_order ui-li-thumb"><span class="tabone"><p><h7>'
						+ items[i].ITEMNAME
						+ '</h7></p><p><h8>'
						+ items[i].UNITPRC
						+ '</h8></p><p>구매일:'
						+ items[i].TRSTAMP
						+ '</p></span></li>');
		
		$("#list_order").listview("refresh");
		// ////////////////////////////
	}

}
// //go tp shoppinglistpage end
// ***************************************************************************************************


	