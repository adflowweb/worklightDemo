/**
 *  eylee
 */

var checkPopup = false;
var authenID;

var WLShoppersChallengeHandler = WL.Client
		.createChallengeHandler("WLShoppersRealm");

WLShoppersChallengeHandler.isCustomResponse = function(response) {

	if (!response || !response.responseText) {
		return false;
		
		
	}

	if (response.responseText.indexOf("j_security_check") >= 0) {
		return true;
		
	}

	return false;
};

WLShoppersChallengeHandler.handleChallenge = function(response) {

	var pageId = $.mobile.activePage.attr("id");

	var page = $('#'+pageId);	


	var contentid = pageId+'_content';

	var popup;

	popup = $('<div data-role="popup" id="frm_LoginPopup" data-overlay-theme="a" data-theme="c" style="max-width: 400px;" class="ui-corner-all"><div data-role="header" data-theme="a" class="ui-corner-top ui-header ui-bar-a" role="banner"><h1 class="ui-title" role="heading" aria-level="1">Login</h1></div><div data-role="content" data-theme="d"class="ui-corner-bottom ui-content"><h3 class="ui-title">Login required</h3><p><input id="WL_username" name="WL_username" placeholder="Enter your username"	type="text"> <input id="WL_password" name="WL_password" placeholder="Enter your password" type="password"></p><a onclick="javascript:login_cancel();"  data-role="button" data-inline="true" data-theme="a">취소</a> <a onclick="javascript:authenticationLogin();"  id="frm_LoginPopupBtn"	data-role="button" data-inline="true" data-rel="ok"	data-transition="flow" data-theme="b">보내기</a></div>');
	 $('#'+pageId).append(popup);
	 $('#'+pageId).find('#frm_LoginPopup').popup();

	 $('#frm_LoginPopup').popup('open');

	 $('#'+pageId).find('#frm_LoginPopup').trigger('create');

};

function authenticationLogin(){

		
			// ////////////////////////////////////////////////////////////////////////////
			authenID = $('input[name="WL_username"]').val();
			var WL_password = $('input[name="WL_password"]').val();

			var reqURL = '/j_security_check';
			var option = {};
			var WL_username = $('input[name="WL_username"]').val();

			option.parameters = {
				j_username : WL_username,
				j_password : WL_password
			};
			option.headers = {};
			// option.headers = {"eyleername":username};
			WLShoppersChallengeHandler.submitLoginForm(reqURL, option,
					WLShoppersChallengeHandler.submitLoginFormCallback);
			
}

function login_cancel(){
	$('#frm_LoginPopup').popup('close');

	WLShoppersChallengeHandler.submitFailure(); // history back...
	
	 var pageId = $.mobile.activePage.attr("id");
	 $('#'+pageId).find('#frm_LoginPopup').remove();

}


WLShoppersChallengeHandler.submitLoginFormCallback = function(response) {
	

	var res = WLShoppersChallengeHandler.isCustomResponse(response);

	if (res) {

//		WLShoppersChallengeHandler.handleChallenge(response);
		alert("인증에 실패하였습니다.");
		$('#frm_LoginPopup').popup('close');
		WLShoppersChallengeHandler.submitFailure(); // history back...
		
		 var pageId = $.mobile.activePage.attr("id");
		 $('#'+pageId).find('#frm_LoginPopup').remove();

	} else {
		
		
		var userId = authenID;
		loadUserId(userId);
		$('#frm_LoginPopup').popup('close');
	
		WLShoppersChallengeHandler.submitSuccess();
		var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");		
		
		var isConnectionbtn = '<a onclick="logout()" style="height: 200px" data-theme="a" data-role="button" class="btn_logout ui-btn ui-shadow ui-btn-corner-all ui-last-child ui-btn-up-a" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span"><span class="ui-btn-inner"><span class="ui-btn-text">로그아웃</span></span></a>';
		$('#nowconnection').html(isConnectionbtn);
		

		
	}

};

// //////////////////////////////////////////////////////////////////
// logout
$('.btn_logout').bind('click', function() {
	var logoutwlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	WL.Logger.error("logout entry point:: " +logoutwlid);
	WL.Client.logout('WLShoppersRealm');
	
//	WL.Client.logout("WLShoppersRealm");
	gotoLandingPage();
});

function logout(){
	
	
	var logoutwlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	WL.Logger.error("logout entry point:: " +logoutwlid);
//	WL.Client.logout('WLShoppersRealm', {onSuccess : WL.Client.reloadApp});
	WL.Client.logout('WLShoppersRealm');	
//	WL.Client.logout("WLShoppersRealm");
	gotoLandingPage();
}


function gotoLandingPage(){
	WL.Client.reloadApp();  // restart session
//	  WL.Client.connect();

	var logoutwlid2 = WL.Client.getUserInfo("WLShoppersRealm", "userId");
		
		WL.Logger.error("gotoLandingPage entrypoint" +logoutwlid2);

		var isConnectionbtn = '<a style="height: 200px" data-theme="a" data-role="button" class="btn_loginformPag ui-btn ui-shadow ui-btn-corner-all ui-last-child ui-btn-up-a" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span"><span class="ui-btn-inner"><span class="ui-btn-text">로그인</span></span></a>';
//
		$('#nowconnection').html(isConnectionbtn);

		$.mobile.changePage('#pg_home', {
			transition : "slide"
		});		
		 
		
	}
////////////////////////////////////////////////////////////////////////////////////////////////

function loadUserId(conid){

	var user = conid;
	 WL.Logger.debug(".........loadUserId.....try. to...something like that");
	    var invocationData = {
	            adapter : 'MallAdapter', // adapter name
	            procedure : 'getUser',
	            parameters : [user]
	    };
	    WL.Logger.debug("...loadUserId...........try. to...something like that");

	        WL.Client.invokeProcedure(invocationData, {
	                onSuccess : loadUserIdSuccess,
	                onFailure : loadUserIdFailure
	        });     
	
 }
function loadUserIdSuccess(result) {
    WL.Logger.debug("loadUserIdSuccess Retrieve success" + JSON.stringify(result));
	if (result.invocationResult.isSuccessful) {
		displayUserIdload(result.invocationResult.resultSet);   
	} else {
	}
}

function loadUserIdFailure(result) {
    WL.Logger.debug("loadUserIdFailure Retrieve failure");
  
}


//start function displayUserIdload() 
//////////////////////////////////////////////////////////

function displayUserIdload(items) {
	
	 WL.Logger.error("displayUserIdload(items)..entry point");
	 WL.Logger.error("displayUserIdload(items)..entry point" + items[0]);
	 var wlid = WL.Client.getUserInfo("WLShoppersRealm", "userId");
	 WL.Logger.error("displayUserIdload wlid :: "+wlid);
	var conidwithdb = items[0].conid;
	var cnamewithdb = items[0].cname;
	
	
	

	userRealmht = {};
	userRealmht["conid"] = conidwithdb;
	 WL.Logger.error('displayUserIdload userRealmht[conid] :: '+userRealmht["conid"]);

	userRealmht["name"] = cnamewithdb;
	 WL.Logger.error('displayUserIdload  hana userRealmht["name"] :: '+userRealmht["name"]);
	userRealmht["loginid"] = wlid;
	 WL.Logger.error('displayUserIdload duuulll userRealmht["loginid"] :: '+userRealmht["loginid"]);
//////////////////////////////////////////////////////
	 
	 
	mqttConnection(conidwithdb);
		/////////////////////////////////////////////////////
	
}

//end function displayUserIdload() 

//***************************************************************************************************

// when to close the browser, log out..
window.onbeforeunload = function() {
    WL.Logger.debug("logging out");
    WL.Client.logout('WLShoppersRealm', {
		onSuccess : WL.Client.reloadApp
	});
    var isConnectionbtn = '<a class="btn_loginformPag" data-role="button" data-theme="a" style="height: 200px" >로그인</a>';
	$('#nowconnection').html(isConnectionbtn);
};