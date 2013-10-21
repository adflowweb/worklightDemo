var reqID = new Array(5);
var branch = new Array(5);


$("#reqListBtn").click(function requestList() {
	
	
//	[{reqID:200001, branch:"����"}, {reqID:200002, branch:"����"},{reqID:200003, branch:"����"},{reqID:200004, branch:"����"}]

// $.mobile.page
	
//	alert("aaaaaa:: "+ reqID.length);
	$.mobile.changePage("#reqListPage");
	
	
    for ( var i = 0; i < reqID.length; i++) {
//    	alert("111::"+ i);
    	reqID[i] = 2000 + i;
    	branch[i] = "마포";
	}
    
    
	  	
    for ( var i = 0; i < reqID.length ; i++) {
//    	var li = 
    	$('#reqlistview').append($('<li><a href="javascript:reqList('+reqID[i]+')">'+reqID[i]+'<a><p>'+branch[i]+'</p></li>'));
//    	list.append($('<li>').append("aaa"));
    	
    	
// 	  	var _li = $('<li>');
// 	  	_li.append(reqID[i]);
// 	  	_li.append($('<p>'+branch[i]+'</p>'));


//    	var list = $('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-first-child ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"> <a href="#home" class="ui-link-inherit">'+reqID[i]+'</a> <p class="ui-li-desc">'+ branch[i] + '</p></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
    	
// 	   _ul.append(_li);
 	}
    
    
//    $("#reqlistview" ).append(list);
    
    $( "#reqlistview" ).listview( "refresh" );
 	  
// 	  list.append(_ul);
 	
// 	  $("#reqlistview" ).append(list);
	
//    $( "#reqlistview" ).listview( "refresh" );
    $.mobile.changePage('#reqList', { transition: "pop"} );
});



function reqDetail() {
	
	
//	[{reqID:200001, branch:"����"}, {reqID:200002, branch:"����"},{reqID:200003, branch:"����"},{reqID:200004, branch:"����"}]


	alert("reqDetail");
	$.mobile.changePage("#reqDetail");

	
}

$("#btn").click(function(){ alert("test")})



