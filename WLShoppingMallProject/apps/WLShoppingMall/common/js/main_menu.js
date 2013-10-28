/**
 * 2013.10.26 eylee actions in wishdetailPage 
 *  
 *  main page events and detail page events
 *    
 */

var productlistCreated = false;    // main list_product empty check
//var imageurl = "http://127.0.0.1:8080/JqueryFun/images/";
var imageurl = "http://192.168.0.171/WLShoppingMall/";
var product_info;   // use between product detail and wish detail

//gp tp btn_gotoproduct start
$('.btn_gotoproduct').click(function(){
loadITEMSList();
});  


//load item start
function loadITEMSList() {
WL.Logger.debug(".........loadITEMSList.....try. to...something like that");

var invocationData = {
	adapter : 'MallAdapter', // adapter name
	procedure : 'getITEMs',
	parameters : []
//parameters if any
};
WL.Logger.debug(".........loadITEMSList.....try. to...something like that");

WL.Client.invokeProcedure(invocationData, {
	onSuccess : loadmainSQLQuerySuccess,
	onFailure : loadmainSQLQueryFailure
});


}
//load item end

function loadmainSQLQuerySuccess(result) {
WL.Logger.debug("loadITEMSList Retrieve success" + JSON.stringify(result));
	appendToProductList(result.invocationResult.resultSet);
}


function loadmainSQLQueryFailure(result) {
WL.Logger.debug("loadITEMSList Retrieve failure");
}

function appendToProductList(items){
	   $.mobile.changePage('#pg_shopping', { transition: "pop"} );
	   $("#list_product").empty();
	//Create the listview if not created
	   for ( var i = 0; i < items.length; i++) {
   	/////////////////////////////////
			    if(!productlistCreated){
			        $(".content-primary_product").append("<ul id='list_product'  data-role='listview'  data-inset='true' data-split-theme='c' data-split-icon='arrow-r'></ul>");
			        productlistCreated = true;
			        
			        $(".content-primary_product").trigger("create");
			        $("#list_product").append('<li data-role="list-divider"><h3>상품 리스트</h3></li>');
			    }
			    
			    $("#list_product").append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-hover-c ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="javascript:gotoDetailPage('+items[i].ITEMCODE+');" class="ui-link-inherit "> <img border="0" height="100" src="'+imageurl+items[i].ITEMPIC1+'" width="100" class="ui-li-thumb"><h3 class="ui-li-heading">'+items[i].ITEMNAME+'</h3><h4 class="ui-li-heading">'+items[i].UNITPRC+'</h4><p class="ui-li-desc">'+items[i].ITEMDESC+'</p></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
//			    $("#list_product").append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-hover-c ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="javascript:gotoDetailPage('+items[i].ITEMCODE+');return false;" class="ui-link-inherit "> <img border="0" height="100" src="http://192.168.0.171/WLShoppingMall/'+items[i].ITEMPIC1+'" width="100" class="ui-li-thumb"><h3 class="ui-li-heading">'+items[i].ITEMNAME+'</h3><h4 class="ui-li-heading">'+items[i].UNITPRC+'</h4><p class="ui-li-desc">'+items[i].ITEMDESC+'</p></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
			    $("#list_product").listview("refresh");
	//////////////////////////////
	   }

	}
	////go tp shoppinglistpage end
//***************************************************************************************************
//   go to detail page
function gotoDetailPage(itemCode){
var pad = "0000000000";
//	var pad = "00000";  localtest version
var code = itemCode.toString();
//alert("code toString:: "+code);
$.mobile.changePage('#pg_detail', { transition: "pop"} );
	 
var str = "" + code;	 
itemCodeView = pad.substring(0, pad.length - str.length) + str;
//alert('itemCodeView :: '+itemCodeView);
loadProductDetail(itemCodeView);

}

function loadProductDetail(itemCodeView) {
	var ITEMCODE = "";
	ITEMCODE = itemCodeView;
     
        WL.Logger.debug("....loadProductDetail..........try. to...something like that");

        var invocationData = {
                adapter : 'MallAdapter', // adapter name
                procedure : 'getProduct',
                parameters : [ITEMCODE]
        };
        WL.Logger.debug("......loadProductDetail........try. to...something like that");

        WL.Client.invokeProcedure(invocationData, {
                onSuccess : loadProductDetailSuccess,
                onFailure : loadProductDetailFailure
        });
       
}

function loadProductDetailSuccess(result) {
        WL.Logger.debug("loadProductDetail Retrieve success" + JSON.stringify(result));
        
        if (result.invocationResult.isSuccessful) {
                console.log("hahahloadProductDetailFailure");
                console.log(result.invocationResult.resultSet);
                displayProductDetail(result.invocationResult.resultSet);
                
        } else {

        }
}


function loadProductDetailFailure(result) {
        WL.Logger.debug("loadProductDetailFailure Retrieve failure");
}


function displayProductDetail(items) {

$.map(items[0], function(value, key) {
	console.log(key, value);
});
//
$( "#display_product" ).empty();    
$('#addcartform').empty();    

  var ITEMCODE = items[0].ITEMCODE;
  var ITEMPIC1 = items[0].ITEMPIC1;
  var ITEMCATM = items[0].ITEMCATM;
  var ITEMNAME = items[0].ITEMNAME;
  var ITEMDESC = items[0].ITEMDESC;
  var UNITPRC = items[0].UNITPRC;
  product_info=new Object();
  product_info.name = ITEMNAME;
  product_info.code = ITEMCODE;
  product_info.desc = ITEMDESC;
  product_info.img = ITEMPIC1;
  product_info.price = UNITPRC;  

//$('#display_product').append('<img src="http://192.168.0.171/WLShoppingMall/'+ITEMPIC1+'" width="200" height="200"><h3 id="Title">'+ITEMCODE+'</h3><label id="label">가격 : '+UNITPRC+'</label><p>'+ITEMDESC+'</p>');
	$('#display_product').append('<h3 id="Title">'+ITEMNAME+'</h3><img src="'+imageurl+ITEMPIC1+'" width="200" height="200"><h5 id="itemcode">'+ITEMCODE+'</h5><label id="itemPrice">가격 : '+UNITPRC+'</label><p>'+ITEMDESC+'</p>');
	$("#display_product").trigger("create");
	$('#addcartform').append('<input type="hidden" class="cartitem" id="cartitem" name="cartitem" value="'+ITEMCODE+'"><input type="hidden" class="cartprice" id="cartprice" name="cartprice" value="'+UNITPRC+'">');
	$("#addcartform").trigger("create");

}

//go to product detail end
/////////////////////////////////////////////////////////////////
//go to wishlist
//
$('.btn_goWishlistPage').click(function(){
	alert("plz login");
	var loginid="000001";
	loadWishlistitems(loginid);
});
//////////////////////////////////////////////////////////////////////
// go to cart

$('.btn_goCartlistPage').click(function(){
	alert("plz login");
	var loginid="000001";
	loadCartlistitems(loginid);
	
});
