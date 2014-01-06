/**
 * 
 */


ADF.view.AddScheduler = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing element.

	initialize : function() {
	console.log("SchedulerView init................. ");
	
	_.bindAll(this, 'render'); 
	// fixes loss of context for 'this' within
	
	
	},
	events:{
		'click .btn_addschedulerbtn':'addSchedulerForm'
	},
	render : function() {
		window.beforeload = new Date().getTime();
		window.busy.show();
		console.log("SchedulerView " + this);
		var window_width = $(window).width();   
		console.log("window_width :: "+window_width);
//		navigation.load('views/addschedulerForm.html', this.hello);  
		navigation.loadBefore('views/addschedulerForm.html', this.hello);
		
		WL.App.overrideBackButton(backFunc);
		function backFunc() {
			if (!ADF.view.dashBoard) {
				ADF.view.dashBoard = new ADF.view.DashBoard;
			}
			navigation.pushView(ADF.view.dashBoard, 'typeB');
		}
		
	},
	hello: function(){
		   navigation.loadAsync(function(){ADF.view.addscheduler.elapsedTime();window.busy.hide();});
	},
	elapsedTime : function() {
		var aftrload = new Date().getTime();
		// Time calculating in seconds
		var time = (aftrload - window.beforeload) / 1000;
		document.getElementById("addschedulerElapsedTime").innerHTML = "Your Page took <font color='red'><b>"
				+ time + "</b></font> Seconds to Load";
		window.beforeload = 0;
	},  // end of elaspsedTime
	addSchedulerForm : function(){
//		var user =$('input[name="user"]').val();
		var user = document.getElementsByClassName('username')[0].value;		
		console.log("user :: "+user);
		
		var e = document.getElementById("as_categoryfield");
		var strCategory = e.options[e.selectedIndex].value;
		console.log("strCategory :: "+strCategory);
	
		var sc_addevent = document.getElementsByClassName('sc_addevent')[0].value;		
		console.log("sc_addevent :: "+sc_addevent);
		
		var scheduler_calendar1 = document.getElementsByClassName('scheduler_calendar')[0].value;		
		console.log("scheduler_calendar1 :: "+scheduler_calendar1);
		
		var scheduler_calendar2 = document.getElementsByClassName('scheduler_calendar')[1].value;		
		console.log("scheduler_calendar2 :: "+scheduler_calendar2);
		
	}
});