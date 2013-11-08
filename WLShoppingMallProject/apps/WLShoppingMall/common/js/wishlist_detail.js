/**
 * 2013.10.25 eylee actions in wishdetailPage
 * 
 * crud / addWishlist and update delete page btn_result_insertwishdetail /
 * btn_result_modifywishdetail / result_deletewishdetail
 * 
 */

// visit wishdetailPage
var conid; // for selecting wishlist
var mywishdetailCreated = false; // wishdetail view
var mywishlistCreated = false; // wishlist view
var mywishlistmodified = false; // wishlist modify /delete view form
//'pageinit',
$('.btn_addWishlist').click(
				function() {
					// alert("product_info.desc ::"+product_info.desc);
					// alert("product_info.desc ::"+product_info.name);
					// alert("product_info.code ::"+product_info.code);
					// alert("product_info.img ::"+product_info.img);
					// alert("product_info.price ::"+product_info.price);

					if (!mywishdetailCreated) {
						$("#display_wishDetail").empty();
						$("#wishform").empty();
						$("#wishmodform").empty();

					} else {
						mywishdetailCreated = true;
					}// end of if mywishdetailCreated
					$('#display_wishDetail')
							.append(
									'<h3 id="Title">'
											+ product_info.name
											+ '</h3><img src="'
											+ imageurl
											+ product_info.img
											+ '" width="200" height="200"><h3 id="Title">'
											+ product_info.code
											+ '</h3><label id="label">가격 : '
											+ product_info.price
											+ '</label><p>' + product_info.desc
											+ '</p>');
					$("#display_wishDetail").trigger("create");
					$('#wishform')
							.append(
									'<label for="wishlist_t_form">wishlist 제목</label><input type="text" name="wishlist_t_form" 	id="wishlist_t_form"><label for="wishlist_d_form">wishlist 설명</label><input type="text" name="wishlist_d_form" id="wishlist_d_form" >');
					$("#wishform").trigger("create");

					$.mobile.changePage('#wishdetailPage', {
						transition : "slide"
					});
					//	
				});

function insertwishdetail() {

	var wname = product_info.name;
	var descr = product_info.desc;
	// var conid = product_info.desc; // must add login module
	// /////////////////////////////////////////////////////////////////////

	if (authenID == null || authenID == "") {
		console.log(" username null check , and before loadDummy() " + authenID);
		loadDummy();

	} else {		

		console.log("else....username with go..after dummy " + authenID);

		var itemcode1 = product_info.code;
		var wish_title = $('input[name="wishlist_t_form"]').val();
		var wish_desc = $('input[name="wishlist_d_form"]').val();

		// alert("desc, wish_desc, conid, itemcode1" +wish_title+
		// wish_desc+conid+itemcode1);
		addWishitemload(wish_title, wish_desc, authenID, itemcode1);
		$.mobile.changePage('#wishdetailPage', {
			transition : "slide"
		});

	}
	// ///////////////////////////////////////////////////////////////////////
	// conid = '00001';

}

function addWishitemload(wish_title, wish_desc, conid, itemcode1) {
	WL.Logger
			.debug(".........addWishitemload.....try. to...something like that");
	WL.Logger.debug("addWishitemload   conid " + conid);
	var invocationData = {
		adapter : 'MallAdapter',
		procedure : 'addWishList',
		parameters : [ wish_title, wish_desc, conid, itemcode1 ]
	};
	WL.Logger
			.debug(".......addWishitemload.......try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : addWishitemloadSuccess,
		onFailure : addWishitemloadFailure
	});
}
function addWishitemloadSuccess(result) {
	WL.Logger.debug("addWishitemloadSuccess Retrieve success"
			+ JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {
		addWishitemconfirm(result.invocationResult.resultSet);
	} else {
	}
}

function addWishitemloadFailure(result) {
	WL.Logger.debug("addWishitemloadFailure Retrieve failure");
}
function addWishitemconfirm(items) {
	// loadWishlistitems(conid);
	if (authenID == null || authenID == "") {
		console.log(" username null check , and before loadDummy() " + authenID);
		loadDummy();

	} else {
		console.log("else....username with go..after dummy " + authenID);
		loadWishlistitems(authenID);
	}
	
}

// //////////////////////////////////////////////////////////////////////////
// wishlist listview page
function loadWishlistitems(conid) {
	// function loadWishlistitems(){
	// var conid = getCookie("username");
	// alert("popup show loadWishlistitems");
	// alert("inside loadWishlistitems // get cookies conid :: "+ conid);
	// var conid = '00001';

	// var username = getCookie("username");
	// alert("get form loadWishlistitems method :: "+cookiename);
	// var conid = cookiename;

	var conid = conid;
	console.log("conid :: loadWishlistitems insdie  :: " + conid);
	// var conid = WL.Client.getUserInfo("WLShoppersRealm", "userId");

	WL.Logger
			.debug(".........loadWishlistitems.....try. to...something like that");
	var invocationData = {
		adapter : 'MallAdapter', // adapter name
		procedure : 'getWishList',
		parameters : [ conid ]
	};
	WL.Logger
			.debug("...loadWishlistitems...........try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadWishlistitemsSuccess,
		onFailure : loadWishlistitemsFailure
	});

}
function loadWishlistitemsSuccess(result) {
	WL.Logger.debug("loadWishlistitemsSuccess Retrieve success"
			+ JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {
		displayaddWishitemload(result.invocationResult.resultSet);
	} else {
	}
}

function loadWishlistitemsFailure(result) {
	WL.Logger.debug("loadWishlistitemsFailure Retrieve failure");
}

// start function displayMywishlist()
// ////////////////////////////////////////////////////////
function displayaddWishitemload(items) {
	$.mobile.changePage('#wishlistPage', { transition: "pop"} );
	$("#list_wish").empty();
	if(!mywishlistCreated){	 	
		$(".content-primary_one").trigger("create");
		$(".content-primary_one")
				.append(
						"<ul id='list_wish'  data-role='listview'  data-inset='true' data-split-theme='c' data-split-icon='arrow-r'></ul>");
		mywishlistCreated = true;		
	}
	for ( var i = 0; i < items.length; i++) {
		
		var punitprc = null;
		var pname = null;
		var pdesc = null;
		var pimg = null;
		var pwname = null;
		var pwdescr = null;
		var pwlid = null;
		
			for ( var i = 0; i < items.length; i++) {
			pname = items[i].ITEMNAME;
			punitprc = items[i].UNITPRC;
			pdesc = items[i].ITEMDESC;
			pimg = items[i].ITEMPIC1;
			pwlid = items[i].WLID;
			pwname = items[i].WNAME;
			pwdescr = items[i].DESCR;
			// $('input[name=pwlid]').val(pwlid);
			$("#list_wish")
					.append(
							'<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-hover-c ui-btn-up-c" > <input type="checkbox" name="checkbox_wishid" id="'+pwlid+'" class="checkbox_wishid" value="'+pwlid+'" /><a onclick="readWishitemload('+pwlid+')" class="ui-link-inherit selectedCartlist"><div class="ui-btn-inner ui-li" ><img src="'+imageurl+pimg+'" class="img_thumnail_wish ui-li-thumb"><div class="ui-btn-text"><span class="tabone"><label  style="padding:10px 0px 0px 10px;"><h7>'+ pwname
							+ "</p><p>( "
							+ pname
							+ " ) "
							+ '</h7></p><p><h8>'
							+ pwdescr
							+ '</h8></p><p>'
							+ punitprc
							+ 'won</h8></p></label></span></div></a><input type="hidden" name="pwlid" class="pwlid" value="'
							+ pwlid
							+ '"><span data-iconpos="notext" data-icon="arrow-r" class="ui-icon ui-icon-arrow-r ui-icon-shadow"> </span></div></li>');
			//		
		
		}
		// /////////////////////end for
		// ////////////////////////////////////////////////////////////////////////
	} // end for
	 $('#wishlistPage').find("#list_wish").listview("refresh");	
	
	//
}

// end function displayMywishlist()
// ************************************************************ insert end
// read one by one
//
$('selectedWishlist').bind("click", readWishitemload);
function readWishitemload(pwlid) {
	// var hi = $(this).data("pwlid");

	// alert("hi data(pwlid);" +hi);
	loadWishDetail(pwlid);
}

function loadWishDetail(pwlid) {

	WL.Logger
			.debug("....loadWishDetail..........try. to...something like that");
	var invocationData = {
		adapter : 'MallAdapter',
		procedure : 'getWishDetail',
		parameters : [ pwlid ]
	};
	WL.Logger
			.debug("......loadWishDetail........try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadWishDetailSuccess,
		onFailure : loadWishDetailFailure
	});

}
function loadWishDetailSuccess(result) {
	WL.Logger.debug("loadWishDetailSuccess Retrieve success"
			+ JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {
		console.log(result.invocationResult.resultSet);
		displayWishDetail(result.invocationResult.resultSet);

	} else {
	}
}
function loadWishDetailFailure(result) {
	WL.Logger.debug("loadWishDetailFailure Retrieve failure");
}

function displayWishDetail(items) {
	$.map(items[0], function(value, key) {
		console.log(key, value);
	});

	var ITEMCODE = items[0].ITEMCODE;
	var ITEMPIC1 = items[0].ITEMPIC1;
	var ITEMCATM = items[0].ITEMCATM;
	var ITEMNAME = items[0].ITEMNAME;
	var ITEMDESC = items[0].ITEMDESC;
	var UNITPRC = items[0].UNITPRC;
	var wlid = items[0].WLID;
	var wname = items[0].WNAME;
	var descr = items[0].DESCR;
	
	$('#display_wishModDetail').empty();
	$('#wishmodificationform').empty();

	
	$('#display_wishModDetail').append(
			'<h3 id="Title">' + ITEMNAME + '</h3><img src="' + imageurl
					+ ITEMPIC1
					+ '" width="200" height="200"><h5 id="itemcode">'
					+ ITEMCODE + '</h5><label id="label">가격 : ' + UNITPRC
					+ '</label><p>' + ITEMDESC + '</p><input type="hidden" class="orderitemwithwish " name="orderitemwithwish" value="'+ITEMNAME+'"><input type="hidden" class="orderpricewithwish" name="orderpricewithwish" value="'+UNITPRC+'"><input type="hidden" class="itempic1withwish " name="itempic1withwish" value="'+ITEMPIC1+'"><input type="hidden" class="itemcodewithwish " name="itemcodewithwish" value="'+ITEMCODE+'">');
	$("#display_wishModDetail").trigger("create");
	$('#wishmodificationform')
			.append(
					'<h3 class="mywishInfo_title">wishlist 제목 : '
							+ wname
							+ ' </h3><h3 class="mywishInfo_desc">wishlist 설명 : '
							+ descr
							+ '</h3><input type="hidden" class="wlid" name="wlid" value="'
							+ wlid + '">');
	$("#wishmodificationform").trigger("create");
	// $('#udforwish').show();
	// alert("pwlid sdf:: "+wlid);

	// $.mobile.changePage('#wishdetailPage', { transition: "slide"});
	$.mobile.changePage('#wishmodificationPage', {
		transition : "slide"
	});
	// var desc =$('input[name="pdesc"]').val();

}

// go to product detail end
// update wishlist modid

// goto the modify page
function modifywishdetail() {

	if (document.getElementById("wishlist_md_form") == null) {
		$('#wishmodform')
				.append(
						'<label for="wishlist_mt_form" class="ui-input-text">wishlist 제목</label><div class="ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-c"><input type="text" name="wishlist_mt_form" id="wishlist_mt_form" class="ui-input-text ui-body-c"></div><label for="wishlist_md_form" class="ui-input-text">wishlist 설명</label><div class="ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-c"><input type="text" name="wishlist_md_form" id="wishlist_md_form" class="ui-input-text ui-body-c"></div>');
	} else {
		console.log('this record already exists');
	}
	mywishlistmodified = true;
	if (!mywishlistmodified) {
		$('#wishmodform').empty();
	}
}
function updatewishdetail() {
	// alert("updatewishdetail............");
	var modid = $('input[name="wlid"]').val();

	console.log("modid" + modid);
	// alert("wlid :: "+modid);
	var modtitle = $('input[name="wishlist_mt_form"]').val();
	var moddesc = $('input[name="wishlist_md_form"]').val();
	// alert("modtitle :: "+modtitle +" :: moddesc " +moddesc);
	loadupdatewish(modtitle, moddesc, modid);
}

//
function loadupdatewish(modtitle, moddesc, modid) {
	WL.Logger
			.debug(".........loadupdatewish.....try. to...something like that");

	var invocationData = {
		adapter : 'MallAdapter', // adapter name
		procedure : 'updateWish',
		parameters : [ modtitle, moddesc, modid ]

	};
	WL.Logger
			.debug(".........loadupdatewish.....try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadupdatewishSuccess,
		onFailure : loadupdatewishFailure
	});

}
// load item end

function loadupdatewishSuccess(result) {
	WL.Logger.debug("loadupdatewishSuccess Retrieve success"
			+ JSON.stringify(result));
	detailwishAfterupdate(result.invocationResult.resultSet);
}

function loadupdatewishFailure(result) {
	WL.Logger.debug("loadupdatewishFailure Retrieve failure");
}

function detailwishAfterupdate(items) {
	// alert("detailwishAfterupdate");
	// /////////////////////////////////////////////////
	// wishlist select after saving
	
	if (authenID == null || authenID == "") {
		console.log(" username null check , and before loadDummy() " + authenID);
		loadDummy();

	} else {

		console.log("else....username with go..after dummy " + authenID);
		loadWishlistitems(authenID);
	
	}
	
	
}
// //go tp shoppinglistpage end
// *********************************

// ******************************************************************************************
// wish list pop up of list delete button start (for delete)

// ////////////////////////////////////////////////////////////////////////
// when saving delete
function saveWishlist_fordel() {
	// alert("btn_saveWishlist_fordel..................");
	var delWishlistArray = [];
	
	
	$("input[name=checkbox_wishid]:checked").each(function() {
		var test = $(this).val();
//		WL.Logger.error("helllo");
		console.log(test);
		delWishlistArray.push(test);
	});

	
	
	len = delWishlistArray.length;
	// for ( var int = 0; int < len; int++) {
	// console.log(" delWishlistArray[int];"+ delWishlistArray[int]);
	// alert(" delWishlistArray[int];"+ delWishlistArray[int]);
	// }
	loaddelWishlist(delWishlistArray);

}

function loaddelWishlist(delWishlistArray) {
	for ( var int = 0; int < delWishlistArray.length; int++) {
		console.log("	delWishlistArray[int];" + delWishlistArray[int]);

		var wlid = delWishlistArray[int];
		WL.Logger
				.debug("....loaddelWishlist..........try. to...something like that");

		var invocationData = {
			adapter : 'MallAdapter', // adapter name
			procedure : 'deleteWish',
			parameters : [ wlid ]
		};
		WL.Logger
				.debug("......loaddelWishlist........try. to...something like that");

		WL.Client.invokeProcedure(invocationData, {
			onSuccess : loaddelWishlistSuccess,
			onFailure : loaddelWishlistFailure
		});
	}
}

function loaddelWishlistSuccess(result) {
	WL.Logger.debug("loaddelWishlistSuccess Retrieve success"
			+ JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {
		console.log("loaddelWishlistSuccess");
		console.log(result.invocationResult.resultSet);
		displayloaddelWishlist(result.invocationResult.resultSet);

	} else {

	}
}

function loaddelWishlistFailure(result) {
	WL.Logger.debug("loaddelWishlistFailure Retrieve failure");
}

function displayloaddelWishlist(items) {
//	alert("plz login");
//	var loginid = "000001";
	if (authenID == null || authenID == "") {
		console.log(" username null check , and before loadDummy() " + authenID);
		loadDummy();

	} else {	
		console.log("else....username with go..after dummy " + authenID);
		loadWishlistitems(authenID);
	}
}

// *************************************************************************
