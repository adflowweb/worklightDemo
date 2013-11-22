
/* JavaScript content from js/cart_detail.js in folder common */
/**
 * 2013.10.27. eylee
 *
 * cart list view
 * and detail page
 * cart crud / insert read update delete
 */

////////////////////////////////////////////////////////////////////////////
//wishlist  listview page
// cart db 에 5개씩만 저장하기
//insert 할 데이터 5개
//item 코드 ,가격, 테이블에서
//수량은 웹에서 가져와야
//CARTID,OWNER, ITEM1, AMT1, UNITPRC1, ITEM2, AMT2, UNITPRC2,ITEM3, AMT3, UNITPRC3, ITEM4, AMT4, PRC4,ITEM5, AMT5,UNITPRC5,ITEM6,AMT6, UNITPRC6, ITEM7, AMT7, UNITPRC7, ITEM8, AMT8, UNITPRC8, ITEM9, AMT9, UNITPRC9, ITEM10, AMT10, UNITPRC10
var productlistCreated = false;
var mycartlistCreated = false;
var mycartmodified = false; // wishlist modify /delete view form
function loadCartlistitems(conid){

	var user = conid;
	 WL.Logger.debug(".........loadCartlistitems.....try. to...something like that");
	    var invocationData = {
	            adapter : 'MallAdapter', // adapter name
	            procedure : 'getCartList',
	            parameters : [conid]
	    };
	    WL.Logger.debug("...loadCartlistitems...........try. to...something like that");

	        WL.Client.invokeProcedure(invocationData, {
	                onSuccess : loadCartlistitemsSuccess,
	                onFailure : loadCartlistitemsFailure
	        });     
	
 }
function loadCartlistitemsSuccess(result) {
    WL.Logger.debug("loadCartlistitemsSuccess Retrieve success" + JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {            
		displayCartitemload(result.invocationResult.resultSet);            
	} else {
	}
}

function loadCartlistitemsFailure(result) {
    WL.Logger.debug("loadCartlistitemsFailure Retrieve failure");
}


//start function displayMywishlist() 
//////////////////////////////////////////////////////////

function displayCartitemload(items) {
//	console.log("cartItem length :: "+items.length );
	$.mobile.changePage('#cartlistPage', { transition: "pop"} );
	$("#list_cart").empty();
	if(!mycartlistCreated){	 	
		$(".content-primary_two").trigger("create");
		$(".content-primary_two")
				.append(
						"<ul id='list_cart'  data-role='listview'  data-inset='true' data-split-theme='c' data-split-icon='arrow-r'></ul>");
		mycartlistCreated = true;		
	}	

		for ( var i = 0; i < items.length; i++) { 
			var  punitprc = null;
			var pname = null;
			var pdesc = null;
			var pimg = null;
			var pwname = null;
			var pwdescr = null;
			var cartid = null;
			var totalprice = null;	
			
			pname = items[i].ITEMNAME;
			punitprc = items[i].UNITPRC;
			pdesc = items[i].ITEMDESC;
			pimg = items[i].ITEMPIC1;
			cartid = items[i].CARTID; 
			cartamt= items[i].AMT1;
			cartprice = items[i].UNITPRC1;	
			totalprice = cartprice * cartamt;
			$("#list_cart")
			.append(
	//				'<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-hover-c ui-btn-up-c" ><a onclick="readCartitemload('+cartid+')" class="ui-link-inherit selectedCartlist"><div class="ui-btn-inner ui-li" ><img src="'+imageurl+pimg+'" class="img_thumnail_wish ui-li-thumb"><div class="ui-btn-text"><span class="tabone"><h7>'+pname+"</p><p>( "+pdesc+" ) "+'</h7></p><p><h8>total : '+cartamt  +'</h8></p><p>'+totalprice+'won</p></span></div></a><input type="hidden" name="cartid" class="cartid" value="'+cartid+'"><input type="hidden" class="orderprice " name="orderprice" value="'+cartprice+'"><input type="hidden" class="orderitem " name="orderitem" value="'+pname+'"><input type="hidden" class="itempic1 " name="itempic1" value="'+pimg+'"><span data-iconpos="notext" data-icon="arrow-r" class="ui-icon ui-icon-arrow-r ui-icon-shadow"> </span></div></li>');
	//				'<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-hover-c ui-btn-up-c" > <fieldset data-role="controlgroup_cart" ><input id="SelectedSensors_0__Value" name="SelectedSensors[0].Value" type="checkbox" value="true" /><input id="SelectedSensors_0__Id" name="SelectedSensors[0].Id" type="hidden" value="16" /><label for="SelectedSensors_0__Value" style="border-top-width: 0px;margin-top: 0px;border-bottom-width: 0px;margin-bottom: 0px;border-left-width: 0px;border-right-width: 0px;"></label></fieldset></label><a onclick="readCartitemload('+cartid+')" class="ui-link-inherit selectedCartlist"><div class="ui-btn-inner ui-li" ><img src="'+imageurl+pimg+'" class="img_thumnail_wish ui-li-thumb"><div class="ui-btn-text"><span class="tabone"><label  style="padding:10px 0px 0px 10px;"><h7>'+pname+"</p><p>( "+pdesc+" ) "+'</h7></p><p><h8>total : '+cartamt  +'</h8></p><p>'+totalprice+'won</p></label></span></div></a><input type="hidden" name="cartid" class="cartid" value="'+cartid+'"><input type="hidden" class="orderprice " name="orderprice" value="'+cartprice+'"><input type="hidden" class="orderitem " name="orderitem" value="'+pname+'"><input type="hidden" class="itempic1 " name="itempic1" value="'+pimg+'"><span data-iconpos="notext" data-icon="arrow-r" class="ui-icon ui-icon-arrow-r ui-icon-shadow"> </span></div></li>');
					'<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-hover-c ui-btn-up-c" > <input type="checkbox" name="checkbox_cartid" id="'+cartid+'" class="checkbox_cartid" value="'+cartid+'" /><a onclick="readCartitemload('+cartid+')" class="ui-link-inherit selectedCartlist"><div class="ui-btn-inner ui-li" ><img src="'+imageurl+pimg+'" class="img_thumnail_wish ui-li-thumb"><div class="ui-btn-text"><span class="tabone"><label  style="padding:10px 0px 0px 10px;"><h7>'+pname+"</p><p>( "+pdesc+" ) "+'</h7></p><p><h8>total : '+cartamt  +'</h8></p><p>'+totalprice+'won</p></label></span></div></a><input type="hidden" name="cartid" class="cartid" value="'+cartid+'"><input type="hidden" class="orderprice " name="orderprice" value="'+cartprice+'"><input type="hidden" class="orderitem " name="orderitem" value="'+pname+'"><input type="hidden" class="itempic1 " name="itempic1" value="'+pimg+'"><span data-iconpos="notext" data-icon="arrow-r" class="ui-icon ui-icon-arrow-r ui-icon-shadow"> </span></div></li>');
		}   //end for
	

		
    $('#cartlistPage').find("#list_cart").listview("refresh");	

}

//end function displayCartitemload() 

//***************************************************************************************************

$('selectedCartlist').bind("click", readCartitemload);
function readCartitemload(cartid){

	loadCartDetail(cartid);
}

function loadCartDetail(cartid) {

	    WL.Logger.debug("....loadCartDetail..........try. to...something like that");
        var invocationData = {
                adapter : 'MallAdapter', 
                procedure : 'getCartDetail',
                parameters : [cartid]
        };
        WL.Logger.debug("......loadCartDetail........try. to...something like that");

        WL.Client.invokeProcedure(invocationData, {
                onSuccess : loadCartDetailSuccess,
                onFailure : loadCartDetailFailure
        });
       
}
function loadCartDetailSuccess(result) {
        WL.Logger.debug("loadCartDetailSuccess Retrieve success" + JSON.stringify(result));
        
        if (result.invocationResult.isSuccessful) {              
                console.log(result.invocationResult.resultSet);
                displayCartDetail(result.invocationResult.resultSet);
                
        } else {
        }
}
function loadCartDetailFailure(result) {
        WL.Logger.debug("loadCartDetailFailure Retrieve failure");
}

//CARTID,OWNER, ITEM1, AMT1, UNITPRC1
function displayCartDetail(items) {
	$.map(items[0], function(value, key) {
		console.log(key, value);
	});
	$('#display_cartModDetail').empty();
	$('#cartmodificationform').empty();
	$('#updateforcart').empty();
	var itemcode = null;
	var itempic1= null;
	var itemcatm= null;
	var itemname= null;
	var itemdesc= null;
	var cartprice= null;
	var cartid= null;
	var cartitem= null;
	var cartamt= null;
	 var total = null;
	  itemcode = items[0].ITEMCODE;
	itempic1 = items[0].ITEMPIC1;
	 itemcatm = items[0].ITEMCATM;
	 itemname = items[0].ITEMNAME;
	 itemdesc = items[0].ITEMDESC;
	 cartprice = items[0].UNITPRC1;
	  cartid = items[0].CARTID;
	 cartitem= items[0].ITEM1;
	 cartamt = items[0].AMT1;	
	  total = cartamt * cartprice;
	//  product_info=new Object();
	//  product_info.name = ITEMNAME;
	//  product_info.code = ITEMCODE;
	//  product_info.desc = ITEMDESC;
	//  product_info.img = ITEMPIC1;
	//  product_info.price = UNITPRC;  
		
		
	//$('#display_product').append('<img src="http://192.168.0.171/WLShoppingMall/'+ITEMPIC1+'" width="200" height="200"><h3 id="Title">'+ITEMCODE+'</h3><label id="label">가격 : '+UNITPRC+'</label><p>'+ITEMDESC+'</p>');
		$('#display_cartModDetail').append('<h3 id="Title">'+itemname +'</h3><img src="'+imageurl+itempic1 +'" width="200" height="200"><h5 id="itemcode">'+itemdesc+'</h5><label id="label">금액 : '+cartprice +'</label><p>'+cartamt+'</p><input type="hidden" class="orderitemwithcart " name="orderitemwithcart" value="'+itemname+'"><input type="hidden" class="orderpricewithcart" name="orderpricewithcart" value="'+cartprice+'"><input type="hidden" class="itempic1withcart " name="itempic1withcart" value="'+itempic1+'"><input type="hidden" class="itemcodewithcart " name="itemcodewithcart" value="'+itemcode+'">');
		$("#display_cartModDetail").trigger("create");
		$('#cartmodificationform').append('<h3 class="mycart_amt">수량 : '+cartamt +' </h3><h3 class="mycart_price">금액 : '+(total)+'won</h3><input type="hidden" class="cartid " name="cartid" value="'+cartid+'">');
		$("#cartmodificationform").trigger("create");
		$('#updateforcart').append('<input type="hidden" class="cartUpdateitem" id="cartUpdateitem" name="cartUpdateitem" value="'+itemcode+'"><input type="hidden" class="cartUpdateprice" id="cartUpdateprice" name="cartUpdateprice" value="'+cartprice+'">');
		$("#updateforcart").trigger("create");

		$.mobile.changePage('#cartmodificationPage', { transition: "slide"});
//		var desc =$('input[name="pdesc"]').val();

}

////////////////////////////////////////////////////////////////////////////
//modify cart
//modifycartdetail();

// amount select box change event start
var changeselectVal=null;
$('#quantityItem').on("change",function() {
	changeselectVal  = $("#quantityItem" ).val();
});

//goto the modify page
function modifycartdetail(){	
	
	
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....modifycartdetail inside  with go..before dummy " + wlid);		
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("modifycartdetail inside :: "+conid+name+loginid);
		
		var updatequantity = null;
		if(changeselectVal=null){

			updatequantity = changeselectVal;
		}else{
			updatequantity = $("#quantityItem" ).val();
		}
		var updateitem1 = null;
		var updateunitprc1 = null;
		var updatecartid  = null;
		updateitem1 =$('input[name="cartUpdateitem"]').val();
		updateunitprc1 =$('input[name="cartUpdateprice"]').val();
		
		updatecartid =$('input[name="cartid"]').val();
		loadupdatecart(updateitem1, updatequantity, updateunitprc1, updatecartid);
	}
		
}


function loadupdatecart(updateitem1, updatequantity, updateunitprc1, updatecartid) {
WL.Logger.debug(".........loadupdatecart.....try. to...something like that");

var invocationData = {
	adapter : 'MallAdapter', // adapter name
	procedure : 'updateCart',
	parameters :  [updateitem1, updatequantity, updateunitprc1, updatecartid]

};
WL.Logger.debug(".........loadupdatecart.....try. to...something like that");

WL.Client.invokeProcedure(invocationData, {
	onSuccess : loadupdatecartSuccess,
	onFailure : loadupdatecartFailure
});


}
//load item end

function loadupdatecartSuccess(result) {
WL.Logger.debug("loadupdatecartSuccess Retrieve success" + JSON.stringify(result));
	detailcartAfterupdate(result.invocationResult.resultSet);
}


function loadupdatecartFailure(result) {
WL.Logger.debug("loadupdatecartFailure Retrieve failure");
}

function detailcartAfterupdate(items){
	
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....modifycartdetail inside  with go..before dummy " + authenID);		
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("detailcartAfterupdate inside :: "+conid+name+loginid);
		loadCartlistitems(conid);
	
	}	
	////////////////////////////////////////////////////////////////////////////////////////////
		
//		loadCartlistitems(conid);
}
//	 the end!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//*********************************
//**********************************************************************************************************
function deletecartdetail(){
//	alert("deletecartdetail............");
	var deletecartid = null;
	deletecartid =$('input[name="cartid"]').val();
//	alert("deletecartid"+deletecartid);	
//	alert("hello");	
	loaddelCartOnebyone(deletecartid);	
}
function loaddelCartOnebyone(deletecartid) {
	
		
		 var cartid = deletecartid;
		 WL.Logger.debug("....loaddelCartOnebyone..........try. to...something like that");

	    var invocationData = {
	            adapter : 'MallAdapter', // adapter name
	            procedure : 'deleteCart',
	            parameters : [cartid]
	    };
	    WL.Logger.debug("......loaddelCartOnebyone........try. to...something like that");

	    WL.Client.invokeProcedure(invocationData, {
	            onSuccess : loaddelCartlistSuccess,
	            onFailure : loaddelCartlistFailure
	    });
	  
}
//******************************************************************************************
//wish list pop up of list delete button start (for delete)







//when saving delete   
function saveCartlist_fordel(){
//	alert("btn_saveWishlist_fordel..................");
	var delCartlistArray = [];
	$("input[name=checkbox_cartid]:checked").each(function() {
		var test = $(this).val();
//		WL.Logger.error("helllo");
		console.log(test);
		delCartlistArray.push(test);
	});

	
	 len = delCartlistArray.length;

	 loaddelCartlist(delCartlistArray);
}

function loaddelCartlist(delCartlistArray) {
	 for ( var int = 0; int < delCartlistArray.length; int++) {
		 console.log("	delCartlistArray[int];"+	delCartlistArray[int]);
//		 alert("	delCartlistArray[int];"+	delCartlistArray[int]);
		 var cartid = delCartlistArray[int];
		 WL.Logger.debug("....loaddelCartlist..........try. to...something like that");

		    var invocationData = {
		            adapter : 'MallAdapter', // adapter name
		            procedure : 'deleteCart',
		            parameters : [cartid]
		    };
		    WL.Logger.debug("......loaddelCartlist........try. to...something like that");

		    WL.Client.invokeProcedure(invocationData, {
		            onSuccess : loaddelCartlistSuccess,
		            onFailure : loaddelCartlistFailure
		    });
	}       
}

function loaddelCartlistSuccess(result) {
      WL.Logger.debug("loaddelCartlistSuccess Retrieve success" + JSON.stringify(result));
      
      if (result.invocationResult.isSuccessful) {
              console.log("loaddelCartlistSuccess");
              console.log(result.invocationResult.resultSet);
              displayloaddelCartlist(result.invocationResult.resultSet);
              
      } else {

      }
}


function loaddelCartlistFailure(result) {
      WL.Logger.debug("loaddelCartlistFailure Retrieve failure");
}


function displayloaddelCartlist(items) {

	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....modifycartdetail inside  with go..before dummy " + authenID);		
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("detailcartAfterupdate inside :: "+conid+name+loginid);
		loadCartlistitems(conid);
	
	}	
	/////////////////////////////////////////////////////////////////////
//	loadCartlistitems(loginid);

}

//*************************************************************************
//deleteCart
//***************************************************************************************************

//addcart
//
//function addCartList(owner, item1, amt1, unitprc1) {
//	WL.Logger.info("addCartListsatement" + addCartListsatement);
//	return WL.Server.invokeSQLStatement({
//		preparedStatement : addCartListsatement,
//		parameters : [owner, item1, amt1, unitprc1]
//	});
//}itemcode itemPrice
// owner, item1, amt1, unitprc1 

//var changeamtselectVal=false;
//$('#amountItem').on("change",function() {
//	changeamtselectVal  = true;
//});

/////////////////////////////////////////////////////////////
function addCartbtn(){
	

	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....addCartbtn inside  with go..before dummy " + authenID);		
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("detailcartAfterupdate inside :: "+conid+name+loginid);
		var item1 = null;
		var unitprc1= null;
		var quantity = null;
		item1 =$('input[name="cartitem"]').val();
		unitprc1 =$('input[name="cartprice"]').val();
//		var quantity = $( "#quantityItem" ).val();amountItem
		quantity = $( "#amountItem" ).val();
		
//		alert("quantity :: "+quantity + "item1 :: "+item1 + "unitprc1 :: " +unitprc1 +"end");
		addCartitemload(conid, item1, quantity, unitprc1);	
	}
	
} 

function addCartitemload(owner, item1, quantity, unitprc1){
 WL.Logger.debug(".........addCartitemload.....try. to...something like that");
    var invocationData = {
            adapter : 'MallAdapter', 
            procedure : 'addCartList',
            parameters : [owner, item1, quantity, unitprc1]
    };
    WL.Logger.debug(".......addCartitemload.......try. to...something like that");

        WL.Client.invokeProcedure(invocationData, {
                onSuccess : addCartitemloadSuccess,
                onFailure : addCartitemloadFailure
        });        
}
function addCartitemloadSuccess(result) {
    WL.Logger.debug("addCartitemloadSuccess Retrieve success" + JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {           
			addCartitemconfirm(result.invocationResult.resultSet);
	} else {
	}
}

function addCartitemloadFailure(result) {
    WL.Logger.debug("addCartitemloadFailure Retrieve failure");
}
function addCartitemconfirm(items){
//	alert("success confirm add cart");
	alert("추가되었습니다.");	
}




//*******************************************************************************