
/* JavaScript content from js/wishlist_menu.js in folder common */
/**
 * 
 * eylee
 * 
 * management wishlist
 */



var mywishdetailCreated = false; // wishdetail view
var mywishlistCreated = false; // wishlist viewvar mywishlistadded = false; // wishlist modify /delete view form
var mywishlistbySelected = false;

// //////////////////////////////////////////////////////////////////////////
// wishlist listview page   getWLManageList

function loadWishlistMenuitems(conid) {
	

	var conid = conid;
	console.log("conid :: loadWishlistMenuitems insdie  :: " + conid);
	// var conid = WL.Client.getUserInfo("WLShoppersRealm", "userId");

	WL.Logger
			.debug(".........loadWishlistMenuitems.....try. to...something like that");
	var invocationData = {
		adapter : 'MallAdapter', // adapter name
		procedure : 'getWLManageList',
		parameters : [ conid ]
	};
	WL.Logger
			.debug("...loadWishlistMenuitems...........try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadWishlistMenuitemsSuccess,
		onFailure : loadWishlistMenuitemsFailure
	});

}
function loadWishlistMenuitemsSuccess(result) {
	WL.Logger.debug("loadWishlistMenuitemsSuccess Retrieve success"
			+ JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {
		displaywishlistMenuitemsload(result.invocationResult.resultSet);
	} else {
	}
}

function loadWishlistMenuitemsFailure(result) {
	WL.Logger.debug("loadWishlistMenuitemsFailure Retrieve failure");
}

// start function displayMywishlist()
// ////////////////////////////////////////////////////////
function displaywishlistMenuitemsload(items) {
	$.mobile.changePage('#multiwishlistPage', { transition: "pop"} );
	$("#list_wishmenu").empty();
	if(!mywishlistCreated){	 	
		$(".content-primary_multi").trigger("create");
		$(".content-primary_multi")
				.append(
						'<ul id="list_wishmenu"  data-role="listview"  data-inset="true" data-theme="d" data-divider-theme="e" data-count-theme="b" class="ui-listview ui-listview-inset ui-corner-all ui-shadow"></ul>');
		mywishlistCreated = true;		
	}			
		
			for ( var i = 0; i < items.length; i++) {
				
				var itemsArray = [];  
				var  wlid = null;
				var wname = null;
				var descr = null;
				var conid = null;
				var trstamp = null;
				var itemcode1 = null;
				var itemcode2 = null;
				var itemcode3 = null;	
				var itemcode4 = null;
				var itemcode5 = null;
				var itemcode6 = null;	
				var itemcode7 = null;
				var itemcode8 = null;	
				var itemcode9 = null;
				var itemcode10 = null;
				wlid = items[i].WLID;
				wname = items[i].WNAME;
				descr = items[i].DESCR;
				conid = items[i].CONID;
				trstamp = items[i].TRSTAMP; 
				itemcode1 = items[i].ITEMCODE1;
				itemsArray.push(itemcode1);
				WL.Logger.debug("itemcode1 :: "+itemcode1);
				itemcode2 = items[i].ITEMCODE2;
				itemsArray.push(itemcode2);
				itemcode3 = items[i].ITEMCODE3;
				itemsArray.push(itemcode3);
				itemcode4 = items[i].ITEMCODE4;
				itemsArray.push(itemcode4);
				itemcode5 = items[i].ITEMCODE5;
				itemsArray.push(itemcode5);
				itemcode6 = items[i].ITEMCODE6;
				itemsArray.push(itemcode6);
				itemcode7 = items[i].ITEMCODE7;
				itemsArray.push(itemcode7);
				itemcode8 = items[i].ITEMCODE8;
				itemsArray.push(itemcode8);
				itemcode9 = items[i].ITEMCODE9;
				itemsArray.push(itemcode9);
				itemcode10 = items[i].ITEMCODE10;
				itemsArray.push(itemcode10);	
				WL.Logger.debug("itemsArray.length  :: "+itemsArray.length);
				var countItem =0;
			   var wlidformanage = "'" + wlid +"'";
				for ( var int = 0; int < itemsArray.length; int++) {
					if(itemsArray[int] == null  || itemsArray[int] == ""){
						countItem++;
						WL.Logger.debug("null value add  ......... i :: " + countItem + itemsArray[int]);				
					}
							
				}  // end of for
				WL.Logger.debug("null value add  ......... i :: " +countItem);
				var lastItemcode = 10 - countItem;
				WL.Logger.debug("itemcount ......... lastItemcode :: " +lastItemcode);
				if(i==0){
					$("#list_wishmenu").append('<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-e ui-first-child">My Wishlist</li>');
				}
				$("#list_wishmenu")
					.append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-count ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a onclick="managewishlist('+wlidformanage+')"  data-theme="e" class="ui-link-inherit">'+wname+' ('+descr+')<span class="ui-li-count ui-btn-up-b ui-btn-corner-all">'+lastItemcode+'</span></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
			//		
		
	
		// ////////////////////////////////////////////////////////////////////////
	} // end for
	 $('#multiwishlistPage').find("#list_wishmenu").listview("refresh");	
	
	//
}

// end function displayMywishlist()
// ************************************************************ insert end
// read one by one
//



function managewishlist(wlidformanage){
	WL.Logger.debug("managewishlist inside    wlid    ::"+wlidformanage);
	var wlid = wlidformanage;
	WL.Logger.debug("managewishlist inside     wlidformanage   ::"+wlid);
	loadmanagewishlistitems(wlid);
}
////////////////////////////////////////////////////////////////////////////
//wishlist multi menu listview page
function loadmanagewishlistitems(wlid) {
	
	var mywlid = wlid;
	console.log("wlid :: loadmanagewishlistitems insdie  :: " + mywlid);
	// var conid = WL.Client.getUserInfo("WLShoppersRealm", "userId");

	WL.Logger
			.debug(".........loadmanagewishlistitems.....try. to...something like that");
	var invocationData = {
		adapter : 'MallAdapter', // adapter name
		procedure : 'getWListByselected',
		parameters : [ mywlid ]
	};
	WL.Logger
			.debug("...loadmanagewishlistitems...........try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadmanagewishlistitemsSuccess,
		onFailure : loadmanagewishlistitemsFailure
	});

}
function loadmanagewishlistitemsSuccess(result) {
	WL.Logger.debug("loadmanagewishlistitemsSuccess Retrieve success"
			+ JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {
		show_wlistmanagePage(result.invocationResult.resultSet);
	} else {
	}
}

function loadmanagewishlistitemsFailure(result) {
	WL.Logger.debug("loadmanagewishlistitemsFailure Retrieve failure");
}

//start function displayMywishlist()
//////////////////////////////////////////////////////////



function show_wlistmanagePage(items){
		
	var itemsArray = [];  	
	var wlid = items[0].WLID;
	var wname = items[0].WNAME;
	var descr = items[0].DESCR;
	var conid = items[0].CONID;
	var trstamp = items[0].TRSTAMP; 
	var itemcode1 = items[0].ITEMCODE1;
//	var mywlid = "'" + wlid +"'";
	var mywlid = wlid;
	itemsArray.push(itemcode1);
	WL.Logger.debug("itemcode1 :: "+itemcode1);
	var itemcode2 = items[0].ITEMCODE2;
	itemsArray.push(itemcode2);
	var itemcode3 = items[0].ITEMCODE3;
	itemsArray.push(itemcode3);
	var itemcode4 = items[0].ITEMCODE4;
	itemsArray.push(itemcode4);
	var itemcode5 = items[0].ITEMCODE5;
	itemsArray.push(itemcode5);
	var itemcode6 = items[0].ITEMCODE6;
	itemsArray.push(itemcode6);
	var itemcode7 = items[0].ITEMCODE7;
	itemsArray.push(itemcode7);
	var itemcode8 = items[0].ITEMCODE8;
	itemsArray.push(itemcode8);
	var itemcode9 = items[0].ITEMCODE9;
	itemsArray.push(itemcode9);
	var itemcode10 = items[0].ITEMCODE10;
	itemsArray.push(itemcode10);	
	var length = itemsArray.length;
	var countItem =0;
	 
		for ( var int = 0; int < itemsArray.length; int++) {
			if(itemsArray[int] == null  || itemsArray[int] == ""){
				countItem++;
				WL.Logger.debug("null value add  ......... i :: " + countItem + itemsArray[int]);				
			}
					
		}  // end of for
	WL.Logger.debug("null value add  ......... i :: " +countItem);
	var lastItemcode = 10 - countItem;
	WL.Logger.debug("itemcount ......... lastItemcode :: " +lastItemcode);
	$.mobile.changePage('#wishdetailPage', {
		transition : "slide"
	});
	$("#display_wishDetail").empty();
	$('#display_wishModDetail').empty();
	
	
    $('#display_wishDetail').append('<a onclick="goToselectedWL()" data-theme="e" ><div class="ui-corner-all custom-corners" data-theme="c"><div class="ui-bar ui-bar-a"><h3>'+ wname +'( ' + lastItemcode + ') 보러가기 </h3></div><div class="ui-body ui-body-a"><p>설명 : '
					+ descr+'</p></div><input type="hidden" class="mywlid " name="mywlid" value="'+mywlid+'"><input type="hidden" class="mywlname " name="mywlname" value="'+wname+'"></div><input type="hidden" class="mywldescr " name="mywldescr" value="'+descr+'"></div>');
		
		
	
	
	$('#display_wishModDetail').append(
			'<a onclick="goToselectedWL()" ><h3 id="Title">'
			+ wname +'( ' + length + ') 보러가기 '
			+ '</h3><label id="labeldesc">설명 : '
			+ descr
			+ '</label><input type="hidden" class="mywlid " name="mywlid" value="'+mywlid+'"></a>' );
	
	$("#display_wishModDetail").trigger("create");
	$("#display_wishDetail").trigger("create");
	
	
	

	
}
$('#deletebyselectedWL').click(function (){
	//mywlid
	var deleteid = $('input[name="mywlid"]').val();	
	deleteWlistbySelected(deleteid);
});


$('#modifybyselectedWL').click(function (){	

	var mywlname = $('input[name="mywlname"]').val();
	var mywldescr = $('input[name="mywldescr"]').val();
	$('#wishform').empty();
	
	$('#wishform')
	.append(
			'<label for="wishlist_mt_form" class="ui-input-text">wishlist 제목</label><div><input type="text" name="wishlist_mt_form" id="wishlist_mt_form" value="'+mywlname+'" placeholder="'+mywlname+'"></div><label for="wishlist_md_form" class="ui-input-text">wishlist 설명</label><div ><input type="text" name="wishlist_md_form" id="wishlist_md_form"  placeholder="'+mywldescr+'"  value="'+mywldescr+'"><input type="hidden" class="wlname " name="wlname" value="'+mywlname+'"></div><input type="hidden" class="wldescr " name="wldescr" value="'+mywldescr+'"></div></div>');
	$("#wishform").trigger("create");	
	
	$.mobile.changePage('#wishmodificationPage', {
		transition : "slide"
	});
});

function updatewishdetail() {
	var modifyid = $('input[name="mywlid"]').val();

	var mywlname = $('input[name="wlname"]').val();
	var mywldescr = $('input[name="wldescr"]').val();
	WL.Logger.debug("modifyid" +modifyid);

	var modtitle = $('input[name="wishlist_mt_form"]').val();
	if(modtitle==null || modtitle==""){		
		modtitle = mywlname;
		WL.Logger.debug("mywlname :: "+mywlname);		
	}
	var moddesc = $('input[name="wishlist_md_form"]').val();
	if(moddesc==null || moddesc==""){		
		moddesc = mywldescr;
		WL.Logger.debug("mywldescr :: "+moddesc);		
	}
	WL.Logger.debug("modtitle :: "+modtitle +" :: moddesc " +moddesc +modifyid);
	loadupdatewish(modtitle, moddesc, modifyid);
}



/////////////////////////////////////////////////////////////////////////////////
//  mmodify | update  wishlist title and descr  for db

function loadupdatewish(modtitle, moddesc, modifyid) {
	WL.Logger
			.debug(".........loadupdatewish.....try. to...something like that");

	var invocationData = {
		adapter : 'MallAdapter', // adapter name
		procedure : 'updateWish',
		parameters : [ modtitle, moddesc, modifyid ]

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

	 var modifyid = $('input[name="mywlid"]').val();

	 WL.Logger.debug("modifyid" +modifyid);
	 managewishlist(modifyid);	
	
}

/////////////////////////////////////////////////////////
//  delete wishlist


function deleteWlistbySelected(deleteid) {	

		var wlid = deleteid;
		WL.Logger
				.debug("....deleteWlistbySelected..........try. to...something like that");

		var invocationData = {
			adapter : 'MallAdapter', // adapter name
			procedure : 'deleteWish',
			parameters : [ wlid ]
		};
		WL.Logger
				.debug("......deleteWlistbySelected........try. to...something like that");

		WL.Client.invokeProcedure(invocationData, {
			onSuccess : deleteWlistbySelectedSuccess,
			onFailure : deleteWlistbySelectedFailure
		});
	
}

function deleteWlistbySelectedSuccess(result) {
	WL.Logger.debug("deleteWlistbySelectedSuccess Retrieve success"
			+ JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {		
		console.log(result.invocationResult.resultSet);
		displayloaddelWlistbySelected(result.invocationResult.resultSet);

	} else {

	}
}

function deleteWlistbySelectedFailure(result) {
	WL.Logger.debug("deleteWlistbySelectedFailure Retrieve failure");
}

function displayloaddelWlistbySelected(items) {
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..displayloaddelWlistbySelected null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....displayloaddelWlistbySelected  inside  with go..before dummy " + wlid);		
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("displayloaddelWlistbySelected inside :: "+conid+name+loginid);
		loadWishlistMenuitems(conid);
	}
}


/////////////////////////////////////////////////////////////////////////////////
//   add wishlist
function addnewWishlist(){
//	mywishlistadded
	$('#addwishform').empty();	
//	display_wishaddDetail
	$('#addwishform')
	.append(
	'<label for="wishlist_newt_form" class="ui-input-text">wishlist 제목</label><div><input type="text" name="wishlist_newt_form" id="wishlist_newt_form" ></div><label for="wishlist_newd_form" class="ui-input-text">wishlist 설명</label><div ><input type="text" name="wishlist_newd_form" id="wishlist_newd_form" ></div>');
	$("#addwishform").trigger("create");	
	
	$.mobile.changePage('#addwishlistPage', {
		transition : "slide"
	});
}

function addwishlist(){
	
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....btn_addWishlist  inside  with go..before dummy " + wlid);		
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("btn_addWishlist inside :: "+conid+name+loginid);		
		var newtitle = $('input[name="wishlist_newt_form"]').val();
		var newdesc = $('input[name="wishlist_newd_form"]').val();
	
		WL.Logger.debug("newtitle :: "+newtitle +" :: newdesc " +newdesc);
		addnewWishListload(newtitle, newdesc, conid);
	}
	
}



function addnewWishListload(newtitle, newdesc, conid) {
	WL.Logger
			.debug(".........addnewWishListload.....try. to...something like that");
	WL.Logger.debug("addnewWishListload   conid " + conid);
	var invocationData = {
		adapter : 'MallAdapter',
		procedure : 'addWishList',
		parameters : [ newtitle, newdesc, conid ]
	};
	WL.Logger
			.debug(".......addWishitemload.......try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : addnewWishListloadSuccess,
		onFailure : addnewWishListloadFailure
	});
}
function addnewWishListloadSuccess(result) {
	WL.Logger.debug("addnewWishListloadSuccess Retrieve success"
			+ JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {
		addWishlistconfirm(result.invocationResult.resultSet);
	} else {
	}
}

function addnewWishListloadFailure(result) {
	WL.Logger.debug("addnewWishListloadFailure Retrieve failure");
}
function addWishlistconfirm(items) {
	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..username null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....btn_addWishlist  inside  with go..before dummy " + wlid);		
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("btn_addWishlist inside :: "+conid+name+loginid);		
		loadWishlistMenuitems(conid);
	}
	
}

// //////////////////////////////////////////////////////////////////////////

//go to wishlist with items  read one by one
function goToselectedWL(){

	//mywlid
	var mywlid = $('input[name="mywlid"]').val();
	WL.Logger.debug("mywlid" +mywlid);
	//mywlname
	var wname = $('input[name="mywlname"]').val();
	WL.Logger.debug("mywlid" +mywlid);
	getItemsWListByselected(mywlid);
	$('#wishlist_title').html('<h3 name="wishlist_title" id="wishlist_title" value="">'+wname+'</h3><input type="hidden" class="myupdatewlid " name="myupdatewlid" value="'+mywlid+'">');	
}


function getItemsWListByselected(wlid){
	    WL.Logger.debug("....getItemsWListByselected..........try. to...something like that");
        var invocationData = {
                adapter : 'MallAdapter', 
                procedure : 'getWListByselected',
                parameters : [wlid]
        };
        WL.Logger.debug("......getItemsWListByselected........try. to...something like that");

        WL.Client.invokeProcedure(invocationData, {
                onSuccess :  getItemsWListByselectedSuccess,
                onFailure :  getItemsWListByselectedFailure
        });
       
}
function getItemsWListByselectedSuccess(result) {
        WL.Logger.debug("getItemsWListByselectedSuccess Retrieve success" + JSON.stringify(result));
        
        if (result.invocationResult.isSuccessful) {              
                console.log(result.invocationResult.resultSet);
                getItemsInfoByselected(result.invocationResult.resultSet);
                
        } else {
        }
}
function getItemsWListByselectedFailure(result) {
        WL.Logger.debug("getItemsWListByselectedFailure Retrieve failure");
}

function getItemsInfoByselected(items) {

		var  wlid = null;
		var wname = null;
		var descr = null;
		var conid = null;
		var trstamp = null;
		var itemcode1 = null;
		var itemcode2 = null;
		var itemcode3 = null;	
		var itemcode4 = null;
		var itemcode5 = null;
		var itemcode6 = null;	
		var itemcode7 = null;
		var itemcode8 = null;	
		var itemcode9 = null;
		var itemcode10 = null;

		
		var itemsArray = [];  
	
		wlid = items[0].WLID;
		wname = items[0].WNAME;
		descr = items[0].DESCR;
		conid = items[0].CONID;
		trstamp = items[0].TRSTAMP; 
		itemcode1 = items[0].ITEMCODE1;
		itemsArray.push(itemcode1);
		WL.Logger.debug("itemcode1 :: "+itemcode1);
		itemcode2 = items[0].ITEMCODE2;
		itemsArray.push(itemcode2);
		itemcode3 = items[0].ITEMCODE3;
		itemsArray.push(itemcode3);
		itemcode4 = items[0].ITEMCODE4;
		itemsArray.push(itemcode4);
		itemcode5 = items[0].ITEMCODE5;
		itemsArray.push(itemcode5);
		itemcode6 = items[0].ITEMCODE6;
		itemsArray.push(itemcode6);
		itemcode7 = items[0].ITEMCODE7;
		itemsArray.push(itemcode7);
		itemcode8 = items[0].ITEMCODE8;
		itemsArray.push(itemcode8);
		itemcode9 = items[0].ITEMCODE9;
		itemsArray.push(itemcode9);
		itemcode10 = items[0].ITEMCODE10;
		itemsArray.push(itemcode10);	

		
		WL.Logger.debug("itemsArray.length  :: "+itemsArray.length);
		var i =0;	
		for ( var int = 0; int < itemsArray.length; int++) {
			
			if(itemsArray[int] == null  || itemsArray[int] == ""){
				i++;
				WL.Logger.debug("null value add  ......... i :: " + i + itemsArray[int]);				
			}
		}  // end of for
		
		
		
			var lastItemcode = 10 - i;
			var updateCode = lastItemcode +1;
			WL.Logger.debug( wlid + wname + descr+ conid + trstamp+itemcode1+itemcode2+itemcode3+itemcode4+itemcode5+itemcode6 );			
			ArrayItemsInfoByselected(itemsArray);			
}


function ArrayItemsInfoByselected(itemsArray){
	var myArrayItems = itemsArray;
	for ( var int = 0; int < myArrayItems.length; int++) {
		WL.Logger.debug("friday ArrayItemsInfoByselected  :: "  + myArrayItems[int]);					
	}  // end of for

	WL.Logger.debug(".........ArrayItemsInfoByselected.....try. to...something like that");
	var invocationData = {
	adapter : 'MallAdapter', // adapter name
	procedure : 'getItemsInfobyWL',
	parameters : [ myArrayItems[0], myArrayItems[1],  myArrayItems[2],  myArrayItems[3],  myArrayItems[4],  myArrayItems[5],  myArrayItems[6],  myArrayItems[7],  myArrayItems[8],  myArrayItems[9] ]
	};
	WL.Logger.debug("...ArrayItemsInfoByselected...........try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
	onSuccess : ArrayItemsInfoByselectedSuccess,
	onFailure : ArrayItemsInfoByselectedFailure
	});	
}


function ArrayItemsInfoByselectedSuccess(result) {
	WL.Logger.debug("ArrayItemsInfoByselectedSuccess Retrieve success"
	+ JSON.stringify(result));
	
	if (result.invocationResult.isSuccessful) {
		displayItemswithWLoneByone(result.invocationResult.resultSet);
	} else {
		
	}
}

function ArrayItemsInfoByselectedFailure(result) {
WL.Logger.debug("ArrayItemsInfoByselectedFailure Retrieve failure");
}

//start function displayMywishlist()
//////////////////////////////////////////////////////////

function displayItemswithWLoneByone(items){
	$.mobile.changePage('#wishlistPage', { transition: "pop"} );
	$("#list_wish").empty();
	if(!mywishlistbySelected){	 	
		$(".content-primary_one").trigger("create");
		$(".content-primary_one")
				.append(
						"<ul id='list_wish'  data-role='listview'  data-inset='true' data-split-theme='c' data-split-icon='arrow-r'></ul>");
		mywishlistbySelected = true;		
	}
	for ( var i = 0; i < items.length; i++) {
		
		var punitprc = null;
		var pname = null;
		var pdesc = null;
		var pimg = null;
		var pwdescr = null;
	    var itemcode = null;
		
			for ( var i = 0; i < items.length; i++) {
			pname = items[i].ITEMNAME;
			punitprc = items[i].UNITPRC;
			pdesc = items[i].ITEMDESC;
			pimg = items[i].ITEMPIC1;			
			pwdescr = items[i].DESCR;
			myitemcode = items[i].ITEMCODE;
			var readcode = "'" + myitemcode +"'";
			// $('input[name=pwlid]').val(pwlid);
			$("#list_wish")
					.append(
							'<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-hover-c ui-btn-up-c" > <input type="checkbox" name="checkbox_wishid" id="'+myitemcode+'" class="checkbox_wishid" value="'+myitemcode+'" /><a onclick="readWishitemload('+readcode+')" class="ui-link-inherit selectedCartlist"><div class="ui-btn-inner ui-li" ><img src="'+imageurl+pimg+'" class="img_thumnail_wish ui-li-thumb"><div class="ui-btn-text"><span class="tabone"><label  style="padding:10px 0px 0px 10px;"><h7>'+ pname
							+ '</h7></p><p><h8>'
							+ pdesc
							+ '</h8></p><p>'
							+ punitprc
							+ 'won</h8></p></label></span></div></a>'							
							+ '<span data-iconpos="notext" data-icon="arrow-r" class="ui-icon ui-icon-arrow-r ui-icon-shadow"> </span></div></li>');

		
		}
		// /////////////////////end for
		// ////////////////////////////////////////////////////////////////////////
	} // end for
	 $('#wishlistPage').find("#list_wish").listview("refresh");	
	
	//	
}

function readWishitemload(readcode) {
	var itemcode = readcode;
	$.mobile.changePage('#pg_detail', {
		transition : "pop"
	});

	WL.Logger
	.debug("....gotoDetailPage..........try. to...something like that :: readWishitemload "+itemcode);
	
	loadProductDetail(itemcode);


}
//******************************************************************
// delete my items by selected wishlist

//////////////////////////////////////////////////////////////////////////
//when saving delete
function saveWishlist_fordel() {
	// alert("btn_saveWishlist_fordel..................");
	
	var uncheckedWishArray = [];
	var mywlid = $('input[name="myupdatewlid"]').val();
//	$("input[name=checkbox_wishid]:checked").each(function() {
//		var test = $(this).val();
//		WL.Logger.error("checked helllo  checked :: "+test);		
//		delWishlistArray.push(test);
//	});
	var uncheckedWishHT = {};
	
	$("input[name=checkbox_wishid]:not(:checked)").each(function() {
		var test = $(this).val();
		WL.Logger.debug("unchecked helllo  unchecked :: "+test);		
		uncheckedWishArray.push(test);
		
	});
	
	 for ( var int = 0; int < uncheckedWishArray.length; int++) {
		 WL.Logger.debug(" uncheckedWishArray[int];"+ uncheckedWishArray[int]);	
		 uncheckedWishHT[int] = uncheckedWishArray[int];
		 WL.Logger.debug(" uncheckedWishHT[int];"+ uncheckedWishHT[int]);	
	 }
	 var length = uncheckedWishArray.length;
	 WL.Logger.debug(" uncheckedWishArray length;"+ length);	

	 for ( length; length < 10 ; length++) {
			uncheckedWishArray.push(null);	
			 uncheckedWishHT[length] = null;			
	 }
	 for ( var int2 = 0; int2 < 10; int2++) {
		 WL.Logger.debug(" uncheckedWishHT[int];"+ int2 +uncheckedWishHT[int2]);	
	}
	 WL.Logger.debug(" after push null uncheckedWishArray length;"+ uncheckedWishArray.length);	
	 for ( var int = 0; int < uncheckedWishArray.length; int++) {
		 WL.Logger.debug(" after push null, uncheckedWishArray[int];"+ int + uncheckedWishArray[int]);	
	 }
		
	updatefordelWishlist(uncheckedWishHT, mywlid);

}

function updatefordelWishlist(uncheckedWishHT, mywlid){
	
		var wlid = mywlid;
		var wlht = uncheckedWishHT;
		WL.Logger
				.debug("....updatefordelWishlist..........try. to...something like that");

		var invocationData = {
			adapter : 'MallAdapter', // adapter name
			procedure : 'updateWLbyselected',
			parameters : [ wlht[0], wlht[1], wlht[2], wlht[3], wlht[4], wlht[5], wlht[6], wlht[7], wlht[8], wlht[9], wlid ]
		};
		WL.Logger
				.debug("......updatefordelWishlist........try. to...something like that");

		WL.Client.invokeProcedure(invocationData, {
			onSuccess : updatefordelWishlistSuccess,
			onFailure : updatefordelWishlistFailure
		});
	
}

function updatefordelWishlistSuccess(result) {
	WL.Logger.debug("updatefordelWishlistSuccess Retrieve success"
			+ JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {
		console.log("updatefordelWishlistSuccess");
		console.log(result.invocationResult.resultSet);
		displayupdatefordelWishlist(result.invocationResult.resultSet);

	} else {

	}
}

function updatefordelWishlistFailure(result) {
	WL.Logger.debug("updatefordelWishlistFailure Retrieve failure");
}

function displayupdatefordelWishlist(items) {

	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	
	if (wlid == null || wlid == "") {
		console.log("wlid :: null? .....if..displayupdatefordelWishlist null check , and before loadDummy()........ :: "+wlid);
		loadDummy();		
	} else {
		console.log("else....displayupdatefordelWishlist  inside  with go..before dummy " + wlid);		
		var conid = userRealmht["conid"];
		var name = userRealmht["name"];
		var loginid = userRealmht["loginid"];
		
		WL.Logger.debug("displayupdatefordelWishlist inside :: "+conid+name+loginid);
		loadWishlistMenuitems(conid);
	}	
}

//*************************************************************************

