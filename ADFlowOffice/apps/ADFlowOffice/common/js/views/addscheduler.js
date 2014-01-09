/**
 * 
 */


ADF.view.AddScheduler = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing element.

	initialize : function() {
	console.log("AddScheduler view  init................. ");
	
	_.bindAll(this, 'render','fetchDB','loadaddSchedulerSuccess','loadaddSchedulerFailure','appendaddSchedulerList'); 
	// fixes loss of context for 'this' within
	
	
	},
/*
	events:{
		'click .btn_addschedulerbtn':'addSchedulerForm'
	},
	*/
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
		   $('.btn_addschedulerbtn').on('click', function() {		
				console.log("press btn_addschedulerbtn..................");

				ADF.view.addscheduler.addSchedulerForm();
			});
		  
		   
		   //  calling differently............ I need..
//		   $(document).ready(function () {
//			    $(":input[data-datepicker]").pickadate();
//			    
//			});
		    
		   $(function() {
				  $( "#datepicker1" ).datepicker({
				    dateFormat: 'yy-mm-dd'
				  });
				  
				});
		   
//		   var catdiv = document.getElementById("addscheduler_footer");  
		   $('.picka_one').on('click', function() {	
			   console.log("picka_one  clickasdfasdf");
			   datepicker();
//			   var footerdisplay = document.getElementById("addscheduler_footer").style.display;
			   /*
			   document.getElementById("addscheduler_footer").style.display = 'block';
			   var footerdisplay = document.getElementById("addscheduler_footer").style.display; 
			   console.log("footerdisplay:: "+footerdisplay);
			   if(footerdisplay  == 'block'){ 
				   console.log("picka_one  block");
				   console.log("picka_one  footerdisplay :: "+footerdisplay);
				   document.getElementById("addscheduler_footer").style.display = "none";  
				   $(":input[data-datepicker]").pickadate();
			   } else {  
				   footerdisplay = "block";  
				   document.getElementById("addscheduler_footer").style.display = "block";
			   } 
			   */ 
			  
		   });
//		   $(":input[data-datepicker]").pickadate();
		 
		   /////////////////////////////////////////////////////
		 
	        ///////////////////////////////////////////////
		   
		   
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
		this.fetchDB(user,strCategory,sc_addevent,scheduler_calendar1,scheduler_calendar2);
		
	},
	fetchDB : function(user,strCategory,sc_addevent,scheduler_calendar1,scheduler_calendar2){		
				
		var jsonData = '{"act" : "C", "sid" : "", "owner" : "'+user +'", "ctgr" : "'+strCategory+'" ,"strdate" : "'+scheduler_calendar1+'", "enddate" : "'+scheduler_calendar2+'","detail":"'+sc_addevent+'"}';
		console.log("jsonData :: "+jsonData);
		
		
		
		var invocationData = {
                adapter : 'CastIronAdapter', // adapter name
                procedure : 'startOrchestration_post',
                parameters : [jsonData,'ADFlowSchedule']

        };
        console.log(".........TestScheduler.....try. to...something like that");

       
        WL.Client.invokeProcedure(invocationData, {
                onSuccess : this.loadaddSchedulerSuccess,
                onFailure : this.loadaddSchedulerFailure
        });
	},/*fetchDB  end*/
       
	
	loadaddSchedulerSuccess : function(result){
		console.log("loadaddSchedulerSuccess" + JSON.stringify(result));
    	console.log("say hello");
		console.log(result.invocationResult.resultSet);
		console.log("say hello  one...........");
		console.log(result);
		console.log(result.invocationResult);
		var hello = result.invocationResult.isSuccessful;
		if(hello){
			console.log("say hello  hello...........");
			console.log(result.invocationResult.Status);
		}
		
		console.log("hello :: "+hello);
		console.log("say hello  two...........");

		
//		this.appendSchedulerList(result.invocationResult.array);
		this.appendaddSchedulerList(result.invocationResult);
	},/*loadSchedulerSuccess  end*/
	loadaddSchedulerFailure : function(result){
		  console.log("loadaddSchedulerFailure" + JSON.stringify(result));
	},
	appendaddSchedulerList: function(items){
		  console.log("appendaddSchedulerList" +items);
		 
				console.log("loadscheduler loadschedulerloadscheduler "
						+ this);
				if (!ADF.view.scheduler) {
					ADF.view.scheduler = new ADF.view.Scheduler;
				}
				navigation.pushView(ADF.view.scheduler, 'typeA');
			
				
		  
	}
});