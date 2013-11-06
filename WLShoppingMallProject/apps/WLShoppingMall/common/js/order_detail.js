/**
 * 11.5. eylee order get delete add
 */

// ///////////////////////////////////////////////////////////
function buyItembtn(){
	
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
		item1 =$('input[name="cartitem"]').val();
		unitprc1 =$('input[name="cartprice"]').val();
// var quantity = $( "#quantityItem" ).val();amountItem
		quantity = $( "#amountItem" ).val();
		itempic1 =$('input[name="itempic1"]').val();
		orderitem =$('input[name="orderitem"]').val();
		displayOrderPage(item1, unitprc1, itempic1, orderitem, conid );
		
	}	
} 


function buyItembtnwithcart(){
	
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
		item1 =$('input[name="itemcodewithcart"]').val();
		unitprc1 =$('input[name="orderpricewithcart"]').val();
// var quantity = $( "#quantityItem" ).val();amountItem
		quantity = $( "#amountItem" ).val();
		itempic1 =$('input[name="itempic1withcart"]').val();
		orderitem =$('input[name="orderitemwithcart"]').val();
		displayOrderPage(item1, unitprc1, itempic1, orderitem, conid);
		
	}	
} 

function buyItembtnwithwish(){
	
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
		item1 =$('input[name="itemcodewithwish"]').val();
		unitprc1 =$('input[name="orderpricewithwish"]').val();
// var quantity = $( "#quantityItem" ).val();amountItem
		quantity = $( "#amountItem" ).val();
		itempic1 =$('input[name="itempic1withwish"]').val();
		orderitem =$('input[name="orderitemwithwish"]').val();
		displayOrderPage(item1, unitprc1, itempic1, orderitem, conid);
		
	}	
} 

function displayOrderPage(item1, unitprc1, itempic1, orderitem, conid){
	alert("item1 :: "+item1 + "unitprc1 :: " +unitprc1 +"end");
// addCartitemload(conid, item1, quantity, unitprc1);
	lefthtml = '<a onclick="gotoProductPage('+item1+')" >'		
	+ '<img width="100" height="100" src="'+imageurl+itempic1+'" class="img_order">'
	+ '</a>';		
	$.mobile.changePage('#orderPage', { transition: "slide"});	
	$('#orderUser').empty();
	$('#orderinfo').empty();
	$('#orderinfo_left').empty();
	$('#orderUser').html('<h3>'+conid+'님의 주문하실 상품</h3>');
	$('#orderinfo').html("제품코드 :: <br/>"+item1 + "<br/>제품명 :: <br/>" +orderitem+ "<br/>제품명 :: <br/>" +unitprc1);
	$('#orderinfo_left').html(lefthtml);
	
}


$('#payment-form').bind('submit', function(){ 

alert("action......");
// prevent Default functionality
//e.preventDefault();
//
//// get the action-url of the form
//var actionurl = e.currentTarget.action;
//
//// do your own request an handle the results
// $.ajax({
//        url: actionurl,
//        type: 'post',
//        dataType: 'json',
//        data: $(myformselector).serialize(),
//        success: function(data) {
//                
//                 }
//    });


});