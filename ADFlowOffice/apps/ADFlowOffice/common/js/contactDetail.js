console.log("contactDetail.js load");

ADF.view.ContactDetail = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing
	// element.

	initialize : function() {
		_.bindAll(this, 'render','contactSet','contactDisplay'); // fixes loss of context for
//		this.contactDisplay();
	},

	events : {
	// 'click button#searchBtn' : 'searchBtn',
	// 'click li' : 'liClick',
	},

	render : function() {
		// load dashBoard view
		var that = this;
		console.error("render   render   render");
		navigation.load('views/contactDetail.html', function() {

			 that.contactDisplay();
			console.error("render2   render2   render2");
		});
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