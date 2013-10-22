function testList() {
	$.mobile.changePage("#pg_test");

	for ( var i = 0; i < 10; i++) {
		var list = $('<li id="listview"'+i+'><a href="#pg_detail">').html("test");
		list.append($('<span>').html("sochoi"));
		list.append($('</span></a></li>'));	   	   
	    $("#shoppingList" ).append(list);
	}
	$( "#shoppingList" ).listview( "refresh" );
	
	alert("?");
}	