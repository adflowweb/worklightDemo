console.log("contactDetail.js load");

ADF.view.ContactDetail = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing
	// element.

	initialize : function() {
		_.bindAll(this, 'render','contactSet','contactDisplay'); // fixes loss of context for
//		this.contactDisplay();
	},

	events : {
	 'click button.btn-contactUpdate' : 'contactUpdateClick',
	 'click button.btn-contactUpdateFinish' : 'contactUpdateFinishClick',
	},

	render : function() {
		// load dashBoard view
		var that = this;
		console.error("render   render   render");
		navigation.load('views/contactDetail.html', function() {

			 that.contactDisplay();
			console.error("render2   render2   render2");
		});
		
		
		WL.App.overrideBackButton(backFunc);
		function backFunc() {
			if (!ADF.view.contactList) {
				ADF.view.contactList = new ADF.view.ContactList;
			}
			navigation.pushView(ADF.view.contactList, 'typeB');
		}
	},
	
	contactUpdateClick : function() {
		$('#Bt_contactUpdate').removeClass('btn-info').removeClass('btn-contactUpdate').addClass('btn-success').addClass('btn-contactUpdateFinish');
		$("#Bt_contactUpdate").html("수 정 완 료");
		$("input.contactInput").css("background-color","#FFF").css("color","#000");
		$("input.contactInput").attr("readonly",false);
		
		console.error("contactUpdateClick   contactUpdateClick   contactUpdateClick");
	},
	
	contactUpdateFinishClick : function() {
		$('#Bt_contactUpdate').removeClass('btn-success').removeClass('btn-contactUpdateFinish').addClass('btn-info').addClass('btn-contactUpdate');
		$("#Bt_contactUpdate").html("수 정  하 기");
		$("input.contactInput").css("background-color","#1B598A").css("color","#FFF");
		$("input.contactInput").attr("readonly",true);
		
		console.error("contactUpdateClick   contactUpdateClick   contactUpdateClick");
	},
	
	contactSet : function(item) {
		console.log(item);
		this.contact = item;
		console.error("contactSet   contactSet   contactSet");
	},
	
	contactDisplay : function() {
		
		console.log("nameKo ::"+this.contact.get('nameKo'));
		$("#In_NameKo").val(this.contact.get('nameKo'));
		$("#In_NameEn").val(this.contact.get('nameEn'));
		$("#In_Phone").val(this.contact.get('phone'));
		$("#In_Email").val(this.contact.get('email'));
		$("#In_Dept").val(this.contact.get('dept'));
		$("#In_Sex").val(this.contact.get('sex'));
		$("#In_No").val(this.contact.get('no'));
		$("#In_HiredDate").val(this.contact.get('hiredDate'));
		$("#In_BirthDate").val(this.contact.get('birthDate'));
		$("#In_Photo").html('<img class="contactInput" alt="" src="'
			+ this.contact.get('photo')
			+ '" />');
		console.error("contactDisplay   contactDisplay   contactDisplay");
	
	},

});