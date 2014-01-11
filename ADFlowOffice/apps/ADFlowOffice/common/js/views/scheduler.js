
ADF.view.Scheduler = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing element.

	initialize : function() {
	console.log("SchedulerView init................. ");
	this.collection = new ADF.collection.SchedulerCollection();	
//	this.model = new ADF.model.SchedulerModel();
	
//	console.log(this.model);
//	console.log(this.model.toJSON());
	this.collection.bind('add', function() {
	    console.log('this.collection.bind...............new object in the collection');
	});
	
	_.bindAll(this, 'render', 'fetchDB','loadSchedulerSuccess','loadSchedulerFailure','appendSchedulerList'); // fixes loss of context for 'this' within
	
	    	
	},
	render : function() {
		// load SchedulerView view
		
		
		// it's loading....error...more thinking about this..
		window.beforeload = new Date().getTime();
		window.busy.show();
		
		console.log("SchedulerView " + this);
		var window_width = $(window).width();   
		var window_height = $(window).height();   
		console.log("window_width :: "+window_width);
		console.log("window_height :: "+window_height);
		//call async
		navigation.loadBefore('views/schedulerBoard.html', this.fetchDB);
		//navigation.load('views/schedulerBoard.html', this.fetchDB);
		WL.App.overrideBackButton(backFunc);
		function backFunc() {
			if (!ADF.view.dashBoard) {
				ADF.view.dashBoard = new ADF.view.DashBoard;
			}
			navigation.pushView(ADF.view.dashBoard, 'typeB');
		}
	
		
	},

	
	fetchDB : function(){		
		//startOrchestration_post
//		var invocationData = {
//                adapter : 'CastIronAdapter', // adapter name
//                procedure : 'startOrchestration',
//                parameters : ['ADFlowSchedule']
        // parameters if any
//        };
		
		var jsonData = '{"act":"R"}';
		console.log("jsonData :: "+jsonData);
		
		
		
		var invocationData = {
                adapter : 'CastIronAdapter', // adapter name
                procedure : 'startOrchestration_post',
                parameters : [jsonData,'ADFlowSchedule']

        };
        console.log(".........TestScheduler.....try. to...something like that");

       
        WL.Client.invokeProcedure(invocationData, {
                onSuccess : this.loadSchedulerSuccess,
                onFailure : this.loadSchedulerFailure
        });
	},/*fetchDB  end*/
       
	
	loadSchedulerSuccess : function(result){
		console.log("loadSchedulerSuccess" + JSON.stringify(result));
    	console.log("say hello");
		console.log(result.invocationResult.resultSet);
		console.log("say hello  one...........");
//		console.log(result);
//		console.log(result.invocationResult);
//		var hello = result.invocationResult;
//		console.log("say hello  hello...........");
//		console.log(result.invocationResult.Result);
//		console.log(result.invocationResult.Result[0]);
//		console.log(result.invocationResult.Result.length);
//		console.log("hello :: "+hello);
//		console.log("say hello  two...........");

		
//		this.appendSchedulerList(result.invocationResult.array);
		this.appendSchedulerList(result.invocationResult.Result);
	},/*loadSchedulerSuccess  end*/
	loadSchedulerFailure : function(result){
		  console.log("loadSchedulerFailure" + JSON.stringify(result));
		  window.busy.hide();
			WL.SimpleDialog.show("에러메시지", result.errorMsg, [ {
				text : "확인",
				handler : function() {
					WL.App.overrideBackButton(function() {
						window.beforeload = new Date().getTime();
						if (!ADF.view.login) {
							ADF.view.login = new ADF.view.Login;
						}
						navigation.pushView(ADF.view.login, 'typeB');
					});
					WL.Logger.debug("error button pressed");
				}
			} ]);
	},/*loadSchedulerSuccess  end*/
	appendSchedulerList :function(items){
	  	console.log("hello appendSchedulerList :: ");
	  	console.log(items);
		console.log(items.length);
		console.log("say..");
		console.log("..............  this.collection............." + this.collection);
		var str1 = "";
		var str2 = "";
		
		var str3 ="";
		
//		header append today..is 

		var currentTime = new Date();
		var month = currentTime.getMonth() + 1;
		var day = currentTime.getDate();
		var year = currentTime.getFullYear();

		var weekday=new Array(7);
		weekday[0]="Sun";
		weekday[1]="Mon";
		weekday[2]="Tues";
		weekday[3]="Wed";
		weekday[4]="Thur";
		weekday[5]="Fri";
		weekday[6]="Sat";
		var myDay  =weekday[currentTime.getDay()];		
//		<i class="icon-calendar"><div>Mon, Dec 23</div></i>		
		
		var myheader ='<i class="icon-calendar">';
		myheader += myDay;
		myheader +=', ';
		myheader += month;
		myheader +=' ';
		myheader += day;
		myheader +='</i>';		
		$('.header_today').append(myheader);
		
	   for ( var i = 0; i < items.length; i++) {
		   this.collection.add(new ADF.model.SchedulerModel(
//		   this.collection.add(this.model.set(
					{
						owner : items[i].owner ,
						ctgr : items[i].ctgr,
						strdate : items[i].strdate,
						enddate : items[i].enddate ,						
						detail :  items[i].detail }));
		 
			console.log("say..");
		
			console.log(this.collection.models);
			console.log(this.collection.toJSON());

			if( items[i].ctgr=='workoutside'){
				str1 +='<li class="workoutside_li">' + items[i].strdate + items[i].owner + items[i].detail + '</li>';				
			}
			if(items[i].ctgr=='dayoff'){
				str2 +='<li class="dayoff_li">' +  items[i].strdate + items[i].owner  + '</li>';				
			}
			if(items[i].ctgr=='longproject'){
				str3 += '<li class="longproject_li">' + items[i].strdate +' ~ ' + items[i].enddate +items[i].owner + '</li>';				
			}

		}  // end of for loop
	 
	   if(str1!=""){
		   $('#workoutside_first').after(str1);
	   }
	   if(str2!=""){
		   $('#dayoff_first').after(str2);
	   }
	   if(str3!=""){
		   $('#longproject_first').after(str3);
	   }
	   
	   
	   //call async
//	   navigation.loadAsync(function(){console.log('call after()')});
	   navigation.loadAsync(function(){ADF.view.scheduler.elapsedTime();window.busy.hide();});
//	   ADF.view.scheduler.elapsedTime();
		
		$('.btn_inputScheduler').on('click', function() {		
			console.log("btn_inputScheduler event changed.........."+this);
			ADF.view.scheduler.inputScheduler();
			
		});
		$('#backbtnOnscheduler').on(
		{
			click : function(e) {
				console.log("back button click");
				if (!ADF.view.dashBoard) {
					ADF.view.dashBoard = new ADF.view.DashBoard;
				}
				navigation.pushView(ADF.view.dashBoard, 'typeB');
			}

		});
	   
//
	}, /*appendSchedulerList  end*/

	/*
	events:{
		'click .btn_inputScheduler':'inputScheduler'
	},
	*/
	inputScheduler:function(){
		
			console.log("inputScheduler....lalalal...................... "
					+ this);
			if (!ADF.view.addscheduler) {
				ADF.view.addscheduler = new ADF.view.AddScheduler;
			}
			navigation.pushView(ADF.view.addscheduler, 'typeA');
		

	},  // end of inputScheduler 
	elapsedTime : function() {
		var aftrload = new Date().getTime();
		// Time calculating in seconds
		var time = (aftrload - window.beforeload) / 1000;
		document.getElementById("schedulerElapsedTime").innerHTML = "Your Page took <font color='red'><b>"
				+ time + "</b></font> Seconds to Load";
		window.beforeload = 0;
	}  // end of elaspsedTime
	
});


ADF.model.SchedulerModel = Backbone.Model.extend({
	initialize: function(){
	console.log("SchedulerModel initialize........................");	
	},
	 defaults: function(){
		 return {
			 owner:'',
			 ctgr:'',
			 strdate :'',
			 enddate:'',
			 detail:''
			 };
	 }
	 
});


ADF.collection.SchedulerCollection = Backbone.Collection.extend({
	initialize: function(){
		console.log("SchedulerCollection initialize.....................");
	},
	model:ADF.model.SchedulerModel
});
