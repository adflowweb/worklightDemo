   

var arr = [ "one", "two", "three", "four", "five" ];

//$('.btn_goWishlistPage').click(function(){
$('.btn_goWishlistPage').click(function(){
	
	 alert('Going wishlistPage');   
	 appendToWishList();
 
    alert('123Going wishlistPageddddddddddddafsdfddd');
   
  

//**************************************************************************************************8  
 });     


/////////////////////////////////////////////////////////////////////////////////////////////////

var wishlistCreated = false;
var shoppinglistCreated = false;

function appendToWishList(){
	 alert('Going eylee after');
	    $.mobile.changePage('#wishlistPage', { transition: "pop"} );
    //Create the listview if not created
	    $.each( arr, function() {
	 
	    	/////////////////////////////////
			    if(!wishlistCreated){
			        $(".content-primary_one").append("<ul id='list_wish'  data-role='listview'  data-inset='true' data-split-theme='c' data-split-icon='arrow-r'></ul>");
			        wishlistCreated = true;
			        $(".content-primary_one").trigger("create");
			        $("#list_wish").append('<li data-role="list-divider"><h3>위시리스트</h3></li>');
			    }
			   
			    $("#list_wish").append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-hover-c ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="'+this+'" class="ui-link-inherit"> <img border="0" height="100" src="images/jacket.jpg" width="100" class="ui-li-thumb"><h3 class="ui-li-heading">'+this+'</h3><p class="ui-li-desc">'+this+'</p></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
			    $("#list_wish").listview("refresh");
    //////////////////////////////
    
    return (this != "three"); 
	       });
    
}

//////////////////////////////////////////////////////////////////////////
$('.btn_goShoppinglistPage').click(function(){
	
	 alert('GoinggoShoppinglistPage');   
	 appendToShoppingList();
 
   //   	$('.content-primary_one ul').append($('<li>').append("aaa")).listview("refresh");
//**************************************************************************************************8  
});   



function appendToShoppingList(){
	 alert('Going eylee after');
	 alert('Going eylee afteraasdfa77777777777777777');
	    $.mobile.changePage('#shoppinglistPage', { transition: "pop"} );
   //Create the listview if not created
	    $.each( arr, function() {
	 
	    	/////////////////////////////////
			    if(!shoppinglistCreated){
			        $(".content-primary_two").append("<ul id='list_shopping'  data-role='listview'  data-inset='true' data-split-theme='c' data-split-icon='arrow-r'></ul>");
			        shoppinglistCreated = true;
			        $(".content-primary_two").trigger("create");
			        $("#list_shopping").append('<li data-role="list-divider"><h3>장바구니</h3></li>');
			    }

			    $("#list_shopping").append('<li ><a href="#shoppinglistPageone" class="ui-link-inherit"><img src="images/jacket.jpg" class="img_thumnail_wish ui-li-thumb"><span class="tabone"><h3>'+this+'</h3><p>'+this+'</p></span></a> <a class="del" href="#"  data-iconpos="notext" data-icon="delete" >Delete</a></li>');
			    $("#list_shopping").listview("refresh");
   //////////////////////////////
   
   return (this != "three"); 
	       });
   
}


var li = '';
$(document.body).on('click', '.del' ,function(){
    li = $(this).parent();
    $('#sterge').popup("open");
});

$(document.body).on('click', '#delButton' ,function(){
    $('#sterge').popup("close");
    li.remove();
});

$(document.body).on('click', '#giveupButton' ,function(){
    $('#sterge').popup("close");
});

