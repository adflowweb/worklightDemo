
/* JavaScript content from js/wishlist_multi.js in folder common */
/**
 * 
 * 2013. 11. 13
 * eylee
 * multi wishlist
 * 
 */



// visit wishdetailPage
//var conid; // for selecting wishlist


var selectedwitemht;
$('.btn_addMultiWishlist').click(function() {
	
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
		loadMultiWishlistitems(conid);	
		
	} ////////////////////else end
					
});   // btn_addWishlist end



////////////////////////////////////////////////////////////////////////////
//wishlist multi menu listview page
function loadMultiWishlistitems(conid) {
	
	var conid = conid;
	console.log("conid :: loadMultiWishlistitems insdie  :: " + conid);
	// var conid = WL.Client.getUserInfo("WLShoppersRealm", "userId");

	WL.Logger
			.debug(".........loadMultiWishlistitems.....try. to...something like that");
	var invocationData = {
		adapter : 'MallAdapter', // adapter name
		procedure : 'getMultiWishList',
		parameters : [ conid ]
	};
	WL.Logger
			.debug("...loadMultiWishlistitems...........try. to...something like that");

	WL.Client.invokeProcedure(invocationData, {
		onSuccess : loadMultiWishlistitemsSuccess,
		onFailure : loadMultiWishlistitemsFailure
	});

}
function loadMultiWishlistitemsSuccess(result) {
	WL.Logger.debug("loadMultiWishlistitemsSuccess Retrieve success"
			+ JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {
		show_wlistpopupmenu(result.invocationResult.resultSet);
	} else {
	}
}

function loadMultiWishlistitemsFailure(result) {
	WL.Logger.debug("loadMultiWishlistitemsFailure Retrieve failure");
}

//start function displayMywishlist()
//////////////////////////////////////////////////////////



function show_wlistpopupmenu(items){
	$("#popupwishMenu").empty();

	$("#popupwishMenu").trigger("create");
	$("#popupwishMenu").append('<ul id="multi_wlistmenu" data-role="listview" data-inset="true" class="ui-listview ui-listview-inset ui-corner-all ui-shadow"><li data-role="divider" data-theme="a" class="ui-li ui-li-static ui-btn-up-a ui-first-child">add wishlist</li>');

	for ( var i = 0; i < items.length; i++) {		
		var wlid = null;
		var wname = null;
		wlid = items[i].wlid;
		wname = items[i].wname;
		var wishlistid = "'"+wlid + "'" ;
		$("#multi_wlistmenu").append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a onclick="addWishlistbyselected('+wishlistid+')" class="ui-link-inherit">'+wname+'</a><div></div></li>');
				
//		
	} // end of for


	 $('#popupwishMenu').popup('open');
//	 $("#multi_wlistmenu").listview("refresh");	
	 
}    // end of show_wlistpopupmenu() function

function addWishlistbyselected(wishlistid){
	WL.Logger.debug("addWishlistbyselected  :: "+ wishlistid);
	var wlid = wishlistid;
	WL.Logger.debug("wlid :: "+wlid);
	item1 =$('input[name="cartitem"]').val();
	WL.Logger.debug("show_wlistpopupmenu    item1 :: "+item1);
//	var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
//	addWishbyselecteditemload(wlid, item1);
	selectedwitemht = {};	
	
	selectedwitemht["wlid"] = wlid;
	selectedwitemht["item1"] = item1;
	loadWListByselected(wlid);
	// getWListByselected
	//SELECT * FROM WLDEMO.WISHLIST where wlid='201311080000000D'

}

function loadWListByselected(wlid){
	    WL.Logger.debug("....loadWListByselected..........try. to...something like that");
        var invocationData = {
                adapter : 'MallAdapter', 
                procedure : 'getWListByselected',
                parameters : [wlid]
        };
        WL.Logger.debug("......loadWListByselected........try. to...something like that");

        WL.Client.invokeProcedure(invocationData, {
                onSuccess : loadWListByselectedSuccess,
                onFailure : loadWListByselectedFailure
        });
       
}
function loadWListByselectedSuccess(result) {
        WL.Logger.debug("loadWListByselectedSuccess Retrieve success" + JSON.stringify(result));
        
        if (result.invocationResult.isSuccessful) {              
                console.log(result.invocationResult.resultSet);
                countWListByselected(result.invocationResult.resultSet);
                
        } else {
        }
}
function loadWListByselectedFailure(result) {
        WL.Logger.debug("loadWListByselectedFailure Retrieve failure");
}

//CARTID,OWNER, ITEM1, AMT1, UNITPRC1
function countWListByselected(items) {

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
		
//		compare nowcode with itemcode with db
		var nowCode = selectedwitemht["item1"];
		WL.Logger.debug("nowCode :: "+nowCode);
		
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
		var confirmitem = false;
		for ( var int = 0; int < itemsArray.length; int++) {
			if(itemsArray[int]==nowCode){
				WL.Logger.debug("이미 추가한 상품입니다. "+ itemsArray[int]);				
				confirmitem = true;
			}
			if(itemsArray[int] == null  || itemsArray[int] == ""){
				i++;
				WL.Logger.debug("null value add  ......... i :: " + i + itemsArray[int]);				
			}
					
		}  // end of for
		
		
		
		if(confirmitem){
			alert("이미 추가한 상품입니다.");
		}else{
			var lastItemcode = 10 - i;
			var updateCode = lastItemcode +1;
			WL.Logger.debug( wlid + wname + descr+ conid + trstamp+itemcode1+itemcode2+itemcode3+itemcode4+itemcode5+itemcode6 );
			
			WL.Logger.debug("lastItemcode ::"+lastItemcode);
			

			addWishbyselecteditemload(wlid, updateCode);		
		}	
}



//******************************************************************

function addWishbyselecteditemload(wlid, updateCode) {
	
	var itemcode = selectedwitemht["item1"];
	WL.Logger
			.debug(".........addWishbyselecteditemload.....try. to...something like that");
	WL.Logger.debug("addWishbyselecteditemload   updateCode " + updateCode );
	WL.Logger.debug("addWishbyselecteditemload   wlid " + wlid );
	WL.Logger.debug("addWishbyselecteditemload   itemcode " + itemcode );
	var invocationData = {};
	if(updateCode== 1){
		invocationData = {
			adapter : 'MallAdapter',
			procedure : 'updateSelectedWL1',
			parameters : [ itemcode, wlid ]
		};
		WL.Logger
		.debug("..updateSelectedWL1.....addWishbyselecteditemload.......try. to...something like that");

		WL.Client.invokeProcedure(invocationData, {
			onSuccess :addWishbyselecteditemloadSuccess,
			onFailure : addWishbyselecteditemloadFailure
		});
	}
	else if(updateCode== 2){
		invocationData = {
			adapter : 'MallAdapter',
			procedure : 'updateSelectedWL2',
			parameters : [ itemcode, wlid ]
		};
		WL.Logger
		.debug("...updateSelectedWL2....addWishbyselecteditemload.......try. to...something like that");

		WL.Client.invokeProcedure(invocationData, {
			onSuccess :addWishbyselecteditemloadSuccess,
			onFailure : addWishbyselecteditemloadFailure
		});
	}
	else if(updateCode== 3){
		invocationData = {
			adapter : 'MallAdapter',
			procedure : 'updateSelectedWL3',
			parameters : [ itemcode, wlid ]
		};
		WL.Logger
		.debug("...updateSelectedWL3....addWishbyselecteditemload.......try. to...something like that");

		WL.Client.invokeProcedure(invocationData, {
			onSuccess :addWishbyselecteditemloadSuccess,
			onFailure : addWishbyselecteditemloadFailure
		});
	}
	else if(updateCode== 4){
		invocationData = {
			adapter : 'MallAdapter',
			procedure : 'updateSelectedWL4',
			parameters : [ itemcode, wlid ]
		};
		WL.Logger
		.debug("....updateSelectedWL4...addWishbyselecteditemload.......try. to...something like that");

		WL.Client.invokeProcedure(invocationData, {
			onSuccess :addWishbyselecteditemloadSuccess,
			onFailure : addWishbyselecteditemloadFailure
		});
	}
	else if(updateCode== 5){
		invocationData = {
			adapter : 'MallAdapter',
			procedure : 'updateSelectedWL5',
			parameters : [ itemcode, wlid ]
		};
		WL.Logger
		.debug("...updateSelectedWL5....addWishbyselecteditemload.......try. to...something like that");

		WL.Client.invokeProcedure(invocationData, {
			onSuccess :addWishbyselecteditemloadSuccess,
			onFailure : addWishbyselecteditemloadFailure
		});
	}
	else if(updateCode== 6){
		invocationData = {
			adapter : 'MallAdapter',
			procedure : 'updateSelectedWL6',
			parameters : [ itemcode, wlid ]
		};
		WL.Logger
		.debug("...updateSelectedWL6....addWishbyselecteditemload.......try. to...something like that");

		WL.Client.invokeProcedure(invocationData, {
			onSuccess :addWishbyselecteditemloadSuccess,
			onFailure : addWishbyselecteditemloadFailure
		});
	}
	else if(updateCode== 7){
		invocationData = {
			adapter : 'MallAdapter',
			procedure : 'updateSelectedWL7',
			parameters : [ itemcode, wlid ]
		};
		WL.Logger
		.debug("..updateSelectedWL7.....addWishbyselecteditemload.......try. to...something like that");

		WL.Client.invokeProcedure(invocationData, {
			onSuccess :addWishbyselecteditemloadSuccess,
			onFailure : addWishbyselecteditemloadFailure
		});
	}
	else if(updateCode== 8){
		invocationData = {
			adapter : 'MallAdapter',
			procedure : 'updateSelectedWL8',
			parameters : [ itemcode, wlid ]
		};
		WL.Logger
		.debug("..updateSelectedWL8.....addWishbyselecteditemload.......try. to...something like that");

		WL.Client.invokeProcedure(invocationData, {
			onSuccess :addWishbyselecteditemloadSuccess,
			onFailure : addWishbyselecteditemloadFailure
		});
	}
	else if(updateCode== 9){
		invocationData = {
			adapter : 'MallAdapter',
			procedure : 'updateSelectedWL9',
			parameters : [ itemcode, wlid ]
		};
		WL.Logger
		.debug("..updateSelectedWL9.....addWishbyselecteditemload.......try. to...something like that");

		WL.Client.invokeProcedure(invocationData, {
			onSuccess :addWishbyselecteditemloadSuccess,
			onFailure : addWishbyselecteditemloadFailure
		});
	}
	else if(updateCode== 10){
		invocationData = {
			adapter : 'MallAdapter',
			procedure : 'updateSelectedWL10',
			parameters : [ itemcode, wlid ]
		};
		WL.Logger
		.debug(".updateSelectedWL10......addWishbyselecteditemload.......try. to...something like that");

		WL.Client.invokeProcedure(invocationData, {
			onSuccess :addWishbyselecteditemloadSuccess,
			onFailure : addWishbyselecteditemloadFailure
		});
	}
	else {
		alert("10개 이상 추가 할 수 없습니다.");
	}	
	
}
function addWishbyselecteditemloadSuccess(result) {
	WL.Logger.debug("addWishbyselecteditemloadSuccess Retrieve success"
			+ JSON.stringify(result));

	if (result.invocationResult.isSuccessful) {
		 addWishbyselecteditemconfirm(result.invocationResult.resultSet);
	} else {
	}
}

function addWishbyselecteditemloadFailure(result) {
	WL.Logger.debug("addWishbyselecteditemloadFailure Retrieve failure");
}
function addWishbyselecteditemconfirm(items) {
	WL.Logger.debug(items);	
	alert("추가되었습니다.");	
}


//////////////////////////////////////////////////////////

