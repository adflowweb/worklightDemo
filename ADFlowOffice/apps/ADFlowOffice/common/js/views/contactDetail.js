console.log("contactDetail.js load");

ADF.view.ContactDetail = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing
	// element.

	initialize : function() {
		_.bindAll(this, 'render','contactSet','contactDisplay','contactUpdateFinishClick','contactAddFinishClick'); 
//		this.contactDisplay();
		
		this.photoTemp;
		this.addFlag = false;
	},

	events : {
	 'click button.btn-contactUpdate' : 'contactUpdateClick',
	 'click button.btn-contactUpdateFinish' : 'contactUpdateFinishClick',
	 'click button.btn-contactAdd' : 'contactAddClick',
	 'click button.btn-contactAddFinish' : 'contactAddFinishClick',
	 'click button.btn-contactDelFinish' : 'contactDelFinishClick',
	},

	render : function() {
		// load dashBoard view
		var that = this;
		console.error("render   render   render");
		navigation.load('views/contactDetail.html', function() {
			
			if (this.addFlag) {
				
				$('#Bt_contactUpdate').removeClass('btn-info').removeClass('btn-contactUpdate').addClass('btn-success').addClass('btn-contactAddFinish');
				$("#Bt_contactUpdate").html("추 가 완 료");
				$("input.contactInput").css("background-color","#FFF").css("color","#000");
				$("input.contactInput").attr("readonly",false);
				this.photoTemp =  '';
				
				
			} else {
				
				that.contactDisplay();

			}
			 
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
		$("select.contactInputSel").attr("disabled",false);
		console.error("contactUpdateClick   contactUpdateClick   contactUpdateClick");
	},
	
	contactUpdateFinishClick : function() {
		
		$('#Bt_contactUpdate').removeClass('btn-success').removeClass('btn-contactUpdateFinish').addClass('btn-info').addClass('btn-contactUpdate');
		$("#Bt_contactUpdate").html("수 정  하 기");
		$("input.contactInput").css("background-color","#1B598A").css("color","#FFF");
		$("input.contactInput").attr("readonly",true);
		$("select.contactInputSel").attr("disabled",true);
		
		var data = '"nameen" : "'+document.getElementById("In_NameEn").value + 
				'",	"hiredate" : "' +document.getElementById("In_HiredDate").value +
				'",	"sex" : "'+ document.getElementById("In_Sex").selectedIndex +
				'",	"phone" : "'+ document.getElementById("In_Phone").value +
				'",	"email" : "'+ document.getElementById("In_Email").value +
				'",	"no" : "'+ document.getElementById("In_No").value +
				'",	"birthdate" : "'+ document.getElementById("In_BirthDate").value +
				'",	"dept" : "'+ document.getElementById("In_Dept").value +
				'",	"nameko" : "'+ document.getElementById("In_NameKo").value +
				'",	"photo" : "'+ this.photoTemp +
				'"';
		
		console.log("contactUpdateFinishClick photoTemp ::"+ this.photoTemp);
		this.callDB('{"act" : "U", '+ data +'}',"ADFlowContact");
		
		console.error("contactUpdateFinishClick   contactUpdateFinishClick   contactUpdateFinishClick" + data);
	},
	
	contactAddClick : function() {
		$("#In_NameKo").val('');
		$("#In_NameEn").val('');
		$("#In_Phone").val('');
		$("#In_Email").val('');
		$("#In_Dept").val('');
		$("#In_Sex").val('');
		$("#In_No").val('');
		$("#In_HiredDate").val('');
		$("#In_BirthDate").val('');
		$("#In_Photo").html('<img class="contactInput" alt="" src="" />');
		this.photoTemp =  '';
		$('#Bt_contactUpdate').removeClass('btn-info').removeClass('btn-contactAdd').addClass('btn-success').addClass('btn-contactAddFinish');
		$("#Bt_contactUpdate").html("추 가 완 료");
		$("input.contactInput").css("background-color","#FFF").css("color","#000");
		$("input.contactInput").attr("readonly",false);
		
		console.error("contactUpdateClick   contactUpdateClick   contactUpdateClick");
	},
	
	contactAddFinishClick : function() {
		
		$('#Bt_contactUpdate').removeClass('btn-success').removeClass('btn-contactAddFinish').addClass('btn-info').addClass('btn-contactAdd');
		$("#Bt_contactUpdate").html("추 가  하 기");
		$("input.contactInput").css("background-color","#1B598A").css("color","#FFF");
		$("input.contactInput").attr("readonly",true);
		
		var data = '"nameen" : "'+document.getElementById("In_NameEn").value + 
				'",	"hiredate" : "' +document.getElementById("In_HiredDate").value +
				'",	"sex" : "'+ document.getElementById("In_Sex").selectedIndex +
				'",	"phone" : "'+ document.getElementById("In_Phone").value +
				'",	"email" : "'+ document.getElementById("In_Email").value +
				'",	"no" : "'+ document.getElementById("In_No").value +
				'",	"birthdate" : "'+ document.getElementById("In_BirthDate").value +
				'",	"dept" : "'+ document.getElementById("In_Dept").value +
				'",	"nameko" : "'+ document.getElementById("In_NameKo").value +
				'",	"photo" : "'+ this.photoTemp +
				'"';
		
		console.log("contactAddFinishClick photoTemp ::"+ this.photoTemp);
//		this.callDB('{"act" : "C", '+ data +'}',"ADFlowContact");
		
		console.error("contactUpdateFinishClick   contactUpdateFinishClick   contactUpdateFinishClick" + data);
	},
	
	contactDelFinishClick : function() {
		
		$('#Bt_contactUpdate').removeClass('btn-success').removeClass('btn-contactAddFinish').addClass('btn-info').addClass('btn-contactAdd');
		$("#Bt_contactUpdate").html("추 가  하 기");
		$("input.contactInput").css("background-color","#1B598A").css("color","#FFF");
		$("input.contactInput").attr("readonly",true);
		
		var data = '"no" : "'+ document.getElementById("In_No").value +	'"';
		
		console.log("contactDelFinishClick photoTemp ::"+ this.photoTemp);
//		this.callDB('{"act" : "D", '+ data +'}',"ADFlowContact");
		
		console.error("contactUpdateFinishClick   contactUpdateFinishClick   contactUpdateFinishClick" + data);
	},
	
	contactSet : function(item) {
		console.log(item);
		this.contact = item;
		console.error("contactSet   contactSet   contactSet");
	},
	
	contactDisplay : function() {
		
		console.error("nameKo ::"+this.contact.get('nameKo'));
		$("#In_NameKo").val(this.contact.get('nameKo'));
		$("#In_NameEn").val(this.contact.get('nameEn'));
		$("#In_Phone").val(this.contact.get('phone'));
		$("#In_Email").val(this.contact.get('email'));
		$("#In_Dept").val(this.contact.get('dept'));
		document.getElementById("In_Sex").selectedIndex = parseInt(this.contact.get('sex'));
		$("#In_No").val(this.contact.get('no'));
		$("#In_HiredDate").val(this.contact.get('hiredDate'));
		$("#In_BirthDate").val(this.contact.get('birthDate'));
		$("#In_Photo").html('<img class="contactInput" alt="" src="'
			+ this.contact.get('photo')
			+ '" />');
		this.photoTemp =  this.contact.get('photo');
		console.error("contactDisplay   contactDisplay   contactDisplay");
		
		 $('.contactImg').on({
				
			 click : function(e) {
				 console.log("phoneClick   phoneClick");
				document.location.href = 'tel:' + $(e.currentTarget).attr("id");
							
			 }
							
		 });
		 
		 $('.contactImg').on({
				
			 click : function(e) {
				 console.log("phoneClick   phoneClick");
				document.location.href = 'tel:' + $(e.currentTarget).attr("id");
							
			 }
							
		 });
	
	},
	
	callDB : function(param, orchestrationName) {

		console.log("param  ::" + param);
		var invocationData = {
			adapter : 'CastIronAdapter', // adapter name
			procedure : 'startOrchestration_post',
			parameters : [ param, orchestrationName ]
		// parameters if any
		};
		console.log("..............try. to...something like that");
		WL.Client.invokeProcedure(invocationData, {
			onSuccess : this.callDBSuccess,
			onFailure : this.callDBFailure
		});
	},
	
	callDBSuccess : function(result) {

		console.error("Retrieve Success");
	},
	
	callDBFailure : function(result) {

		console.error("Retrieve failure");
	},
	
	addFlagOn : function(addFlag) {

		console.error("addFlag ::"+ addFlag);
		this.addFlag = addFlag;
	},

});