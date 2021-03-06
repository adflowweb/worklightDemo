
/* JavaScript content from js/main_menu.js in folder common */
/**
 * 2013.10.26 eylee actions in wishdetailPage
 * 
 * main page events and detail page events
 * 
 */

var productlistCreated = false; // main list_product empty check
var salelistCreated = false; // main list_product empty check
// var imageurl = "http://127.0.0.1:8080/JqueryFun/images/";
var imageurl = "http://192.168.0.171/WLShoppingMall/";
var product_info; // use between product detail and wish detail
var userRealmht;

// gp tp btn_gotoproduct start
$('.btn_gotoproduct').click(function() {
	loadITEMSList();
});

// load item start
function loadITEMSList() {
	WL.Logger.debug(".........loadITEMSList.....try. to...something like that");

	var invocationData = {
		adapter : 'MallAdapter', // adapter name
		procedure : 'getITEMs',
		parameters : []
	// parameters if any
	};
	WL.Logger.debug(".........loadITEMSList.....try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadmainSQLQuerySuccess,
		onFailure : loadmainSQLQueryFailure
	});

}
// load item end

function loadmainSQLQuerySuccess(result) {
	WL.Logger.debug("loadITEMSList Retrieve success" + JSON.stringify(result));
	appendToProductList(result.invocationResult.resultSet);
}

function loadmainSQLQueryFailure(result) {
	WL.Logger.debug("loadITEMSList Retrieve failure");
}


function appendToProductList(items) {
	$.mobile.changePage('#pg_shopping', {
		transition : "pop"
	});
	$("#list_product").empty();
	// Create the listview if not created
	
	for ( var i = 0; i < items.length; i++) {
		// ///////////////////////////////
	var itemid = items[i].ITEMCODE;
	var happitemcode = "'" + itemid +"'";
		
		
		if (!productlistCreated) {
			
			$(".content-primary_product")
					.append(
							"<ul id='list_product'  data-role='listview'  data-inset='true' data-split-theme='c' data-split-icon='arrow-r'  data-filter='true' data-filter-placeholder='제품명 검색'></ul>");
			productlistCreated = true;

			$(".content-primary_product").trigger("create");
			$("#list_product").append(
					'<li data-role="list-divider"><h3>상품 리스트</h3></li>');
		}

		$("#list_product")
				.append(
						'<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-hover-c ui-btn-up-c" ><div class="ui-btn-inner ui-li" ><div class="ui-btn-text"><a onclick="gotoDetailPage('
								+ happitemcode+ ')" class="ui-link-inherit finderItemcode"> <img border="0" height="100" src="'
								+ imageurl
								+ items[i].ITEMPIC1
								+ '" width="100" class="ui-li-thumb"><h3 class="ui-li-heading">'
								+ items[i].ITEMNAME
								+ '</h3><h4 class="ui-li-heading">'
								+ items[i].UNITPRC
								+ '</h4><p class="ui-li-desc">'
								+ items[i].ITEMDESC
								+ '</p></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
		
		$("#list_product").listview("refresh");
		// ////////////////////////////
	}

}
// //go tp shoppinglistpage end
// ***************************************************************************************************
// go to detail page0
function gotoDetailPage(itemCode) {
	
	WL.Logger.debug("gotoDetailPage(itemCode)"+itemCode );

	$.mobile.changePage('#pg_detail', {
		transition : "pop"
	});

	var happycode = itemCode;
	WL.Logger
	.debug("....gotoDetailPage..........try. to...something like that :: happyCode "+happycode);
	loadProductDetail(happycode);


}

//gotoSalePage

function gotoSalePage(itemCode) {

	WL.Logger.debug("gotoDetailPage(itemCode)"+itemCode );

	$.mobile.changePage('#pg_detail', {
		transition : "pop"
	});

	var happycode = itemCode;
	WL.Logger
	.debug("....gotoDetailPage..........try. to...something like that :: happyCode "+happycode);
	loadProductDetail(happycode);

}



// for order
function gotoProductPage(itemCode) {
	
	$.mobile.changePage('#pg_detail', {
		transition : "pop"
	});

	WL.Logger
	.debug("....gotoProductPage..........try. to...something like that :: itemCode "+itemCode);
	loadProductDetail(itemCode);


}

function loadProductDetail(itemCodeView) {
	var ITEMCODE = "";
	ITEMCODE = itemCodeView;

	WL.Logger
			.debug("....loadProductDetail..........try. to...something like that :: ITEMCODE"+ITEMCODE);

	var invocationData = {
		adapter : 'MallAdapter', // adapter name
		procedure : 'getProduct',
		parameters : [ ITEMCODE ]
	};
	WL.Logger
			.debug("......loadProductDetail........try. to...something like that :: ITEMCODE"+ITEMCODE);

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadProductDetailSuccess,
		onFailure : loadProductDetailFailure
	});

}

function loadProductDetailSuccess(result) {
	WL.Logger.debug("loadProductDetail Retrieve success"
			+ JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {		
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
	$("#display_product").empty();
	$('#addcartform').empty();
	var ITEMCODE = null;
	var ITEMPIC1 = null;
	var ITEMCATM= null;
	var ITEMNAME= null;
	var ITEMDESC = null;
	var UNITPRC = null;
	ITEMCODE = items[0].ITEMCODE;
	ITEMPIC1 = items[0].ITEMPIC1;
	ITEMCATM = items[0].ITEMCATM;
	ITEMNAME = items[0].ITEMNAME;
	ITEMDESC = items[0].ITEMDESC;
	 UNITPRC = items[0].UNITPRC;
	product_info = new Object();
	product_info.name = ITEMNAME;
	product_info.code = ITEMCODE;
	product_info.desc = ITEMDESC;
	product_info.img = ITEMPIC1;
	product_info.price = UNITPRC;

	
	$('#display_product').append(
			'<h3 id="Title">' + ITEMNAME + '</h3><img src="' + imageurl
					+ ITEMPIC1
					+ '" width="200" height="200"><h5 id="itemcode">'
					+ ITEMCODE + '</h5><label id="itemPrice">가격 : ' + UNITPRC
					+ '</label><p>' + ITEMDESC + '</p><input type="hidden" class="orderitem " name="orderitem" value="'+ITEMNAME+'"><input type="hidden" class="orderprice " name="orderprice" value="'+UNITPRC+'"><input type="hidden" class="itempic1 " name="itempic1" value="'+ITEMPIC1+'"><input type="hidden" class="cartprice" id="cartprice" name="cartprice" value="'
					+ UNITPRC + '">');
	$("#display_product").trigger("create");
	$('#addcartform')
			.append(
					'<input type="hidden" class="cartitem" id="cartitem" name="cartitem" value="'
							+ ITEMCODE
							+ '">');
	$("#addcartform").trigger("create");

}

// go to product detail end
// ///////////////////////////////////////////////////////////////
// go to wishlist
//

$('.btn_goWishlistPage').click(function() {
	
	
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {		
		WL.Logger.debug(" if..btn_goWishlistPage username null check , and before loadDummy() " + wlid);
		loadDummy();

	} else {
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("btn_goWishlistPage inside :: "+conid+name+loginid);
		
		//mqttConnection call
//		mqttConnection(conid);

		loadWishlistMenuitems(conid);
	
	}

	
	
});
// ////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////
// dummy start
function loadDummy() {
	WL.Logger.debug(".........getDummy.....try. to...something like that");
	var invocationData = {
		adapter : 'MallAdapter', // adapter name
		procedure : 'getDummy',
		parameters : []
	};
	WL.Logger.debug("...getDummy...........try. to...something like that");

	WL.Client
			.invokeProcedure(
					invocationData,
					{
						onSuccess : function loadDummySuccess(result) {
							WL.Logger.debug("loadDummySuccess Retrieve success"
									+ JSON.stringify(result));

							if (result.invocationResult.isSuccessful) {
								WL.Logger
										.debug("result.invocationResult.isSuccessful........");
							} else {
							}
						},
						onFailure : function loadDummyFailure(result) {
							WL.Logger.debug("onFailure loadDummyFailure");
						}
					});
	
}
// dummy end
// /////////////////////////////////////////////////////////////////////////////////

// go to cart

$('.btn_goCartlistPage').click(function() {
//	alert("plz login");
//	var loginid = "000001";
//	loadCartlistitems(loginid);
//	
	
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);		
		loadDummy();	
		

	} else {
		console.log("else....username with go..before dummy " + wlid);		
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("btn_loginformPag :: "+conid+name+loginid);
		loadCartlistitems(conid);

	}
});

// //////////////////////////////////////////////////////////////////////////////////////////////
// salelist //btn_gotoproduct" href="#pg_salelist"

$('.btn_gotosale').click(function() {
	loadSaleList();
});

// load sale start
function loadSaleList() {
	WL.Logger.debug(".........loadSaleList.....try. to...something like that");

	var invocationData = {
		adapter : 'MallAdapter', // adapter name
		procedure : 'getITEMs',
		parameters : []
	// parameters if any
	};
	WL.Logger.debug(".........loadSaleList.....try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadSaleListSQLQuerySuccess,
		onFailure : loadSaleListSQLQueryFailure
	});

}
// load item end

function loadSaleListSQLQuerySuccess(result) {
	WL.Logger.debug("loadSaleListSQLQuerySuccess Retrieve success"
			+ JSON.stringify(result));
	appendToSaleList(result.invocationResult.resultSet);
}

function loadSaleListSQLQueryFailure(result) {
	WL.Logger.debug("loadSaleListSQLQueryFailure Retrieve failure");
}

function appendToSaleList(items) {
	WL.Logger.error("appendToSaleList endtrypoint"+items);
	$.mobile.changePage('#pg_salelist', {
		transition : "pop"
	});
	$("#list_sale").empty();
	// Create the listview if not created
	for ( var i = 0; i < items.length; i++) {
		// ///////////////////////////////
		var itemid = items[i].ITEMCODE;
		var happitemcode = "'" + itemid +"'";
		
		if (!salelistCreated) {
			$(".content-primary_sale")
					.append(
							"<ul id='list_sale'  data-role='listview'  data-inset='true' data-split-theme='c' data-split-icon='arrow-r'  data-filter='true' data-filter-placeholder='제품명 검색'></ul>");
			salelistCreated = true;

			$(".content-primary_sale").trigger("create");
			$("#list_sale").append(
					'<li data-role="list-divider"><h3>상품 리스트</h3></li>');
		}

		$("#list_sale")
			.append(
						'<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-hover-c ui-btn-up-c" ><div class="ui-btn-inner ui-li" ><div class="ui-btn-text"><a onclick="gotoSalePage('
								+ happitemcode+ ')" class="ui-link-inherit finderItemcode"> <img border="0" height="100" src="'
								+ imageurl
								+ items[i].ITEMPIC1
								+ '" width="100" class="ui-li-thumb"><h3 class="ui-li-heading">'
								+ items[i].ITEMNAME
								+ '</h3><h4 class="ui-li-heading">'
								+ items[i].UNITPRC
								+ '</h4><p class="ui-li-desc">'
								+ items[i].ITEMDESC
								+ '</p></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
		
		$("#list_sale").listview("refresh");
		// ////////////////////////////
	}

}

// /////////////////////////////////////////////////////////////////

function checkCookie() {
	var username = getCookie("username");
	if (username != null && username != "") {
		console.log("Welcome again " + username);
	} else {
		// username = prompt("Please enter your name:", "");
		// if (username != null && username != "") {
		// setCookie("username", username, 365);
		// }
	}
}

function getCookie(c_name) {
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1) {
		c_start = c_value.indexOf(c_name + "=");
	}
	if (c_start == -1) {
		c_value = null;
	} else {
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1) {
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start, c_end));
	}
	return c_value;
}

function setCookie(c_name, value, exdays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value)
			+ ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
}

function eraseCookie(c_name) {
	// var date = new Date();
	// date = date.setDate(date.getDate() - 1);
	// setCookie(c_name,"",date);
	// document.cookie = c_name + "=" + c_value;
	// document.cookie = c_name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	// WL.Logger.error("insede clear clear eraseCookie,.");
	var cookie = document.cookie.split(';');

	for ( var i = 0; i < cookie.length; i++) {

		var chip = cookie[i], entry = chip.split("="), name = entry[0];
		console.log("name :: " + name);
		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}
}

////////////////////////////////////////////////////

//gotoLogin

$('.btn_loginformPag').click(function() {
	
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
		
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....username with go..before dummy " + authenID);		
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("btn_loginformPag :: "+conid+name+loginid);
	}	
	
});

$(function(){   
//	var h = $("#viewport").height();
	var h = $(window).height();   // 546px - 400px ...about 150px
	var height = h - 138;
	var one = height / 2;
	var two = height / 2;
	var three = height / 4;
	var four = height / 4;
	var five = height / 2;

	 $('#layout_one').css({'height':one+'px'});
	 $('#layout_two').css({'height':two+'px'});
	 $('#layout_two_re').css({'height':two+'px'});
	 $('#layout_three').css({'height':three+'px'});
	 $('#layout_four').css({'height':four+'px'});
	 $('#layout_five').css({'height':five+'px'});
	WL.Logger.debug("one :: "+one + " two :: " +two + " three :: "+three + " four :: " +four +" five :: " +five);
	WL.Logger.debug("viewport h "+h);
//	 id="layout_one"
	
});
