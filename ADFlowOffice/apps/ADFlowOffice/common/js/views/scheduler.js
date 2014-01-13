
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
	
	_.bindAll(this, 'render', 'fetchDB','loadSchedulerSuccess','loadSchedulerFailure','appendSchedulerList', 'fetchDBforModify','loadSchedulerbypersonSuccess','loadSchedulerbypersonFailure','popupModifyList','fetchDBbySidforM','loadSchedulerbySidSuccess','loadSchedulerbySidFailure'); // fixes loss of context for 'this' within
	
	    	
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
						nameko : items[i].nameko,
						ctgr : items[i].ctgr,
						strdate : items[i].strdate,
						enddate : items[i].enddate ,						
						detail :  items[i].detail }));
		 
			console.log("say..");
		
			console.log(this.collection.models);
			console.log(this.collection.toJSON());

			if( items[i].ctgr=='workoutside'){
				if(items[i].strdate==items[i].enddate){
					str1 +='<li class="workoutside_li">' + items[i].strdate + items[i].nameko + items[i].detail + '</li>';
				}else{
					str1 +='<li class="workoutside_li">' + items[i].strdate +' ~ ' + items[i].enddate + items[i].nameko + items[i].detail + '</li>';
				}
			}
			if(items[i].ctgr=='dayoff'){
				if(items[i].strdate==items[i].enddate){
					str2 +='<li class="dayoff_li">'+ items[i].strdate + items[i].nameko + items[i].detail + '</li>';
				}else{
					str2 +='<li class="dayoff_li">' + items[i].strdate +' ~ ' + items[i].enddate + items[i].nameko + items[i].detail + '</li>';
				}
						
			}
			if(items[i].ctgr=='longproject'){
				str3 += '<li class="longproject_li">' + items[i].strdate +' ~ ' + items[i].enddate +items[i].nameko + '</li>';				
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
	   navigation.loadAsync(function(){
		   /*
			var myScroll = new iScroll('iscrolldiv', {
				hScrollbar : false,
				vScrollbar : false
			});
		   */		   
		   ADF.view.scheduler.elapsedTime();window.busy.hide();
		   });
//	   ADF.view.scheduler.elapsedTime();
		
	 
	  
		$('.btn_inputScheduler').on('click', function() {		
			console.log("btn_inputScheduler event changed.........."+this);
			ADF.view.scheduler.inputScheduler();
			
		});
		$('#backbtnOnscheduler').on(
		{
			click : function() {
				console.log("back button click");
				if (!ADF.view.dashBoard) {
					ADF.view.dashBoard = new ADF.view.DashBoard;
				}
				navigation.pushView(ADF.view.dashBoard, 'typeB');
			}

		});
		
		$('.btn_modifyScheduler').on(
				{
					click : function() {
						console.log("btn_modifyScheduler click");
						// db query..part 권차장님. ㅜㅠ
						
						 $("#popUpDiv").show();
						 ADF.view.scheduler.fetchDBforModify();
					
						
						
					}

		});  // end btn_modifyScheduler
		
		$('.btn_modifyScheduler_ok').on(
				{
					click : function() {
						console.log("btn_modifyScheduler_ok click");
						// db query..part I need
						
						  $("#popUpDiv").hide();
						
						
					}

		});  // end btn_modifyScheduler
		
		
		$('.btn_deleteScheduler').on(
				{
					click : function() {
						console.log("btn_deleteScheduler click");
						
					}

		});  // end btn_deleteScheduler
	   
		
		
		
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
	},  // end of elaspsedTime
	fetchDBforModify : function(){		
		
		
//		var jsonData = '{"act":"R"}';
		var jsonData =  '{"act":"R", "owner":"78322"}';
		console.log("jsonData :: "+jsonData);
		
		
		
		var invocationData = {
                adapter : 'CastIronAdapter', // adapter name
                procedure : 'startOrchestration_post',
                parameters : [jsonData,'ADFlowSchedule']

        };
        console.log(".........TestScheduler.....try. to...something like that");

       
        WL.Client.invokeProcedure(invocationData, {
                onSuccess : this.loadSchedulerbypersonSuccess,
                onFailure : this.loadSchedulerbypersonFailure
        });
	},/*fetchDB  end*/
	loadSchedulerbypersonSuccess : function(result){
		console.log("loadSchedulerbypersonSuccess" + JSON.stringify(result));    
		console.log(result.invocationResult.resultSet);		
//		this.appendSchedulerList(result.invocationResult.array);
		this.popupModifyList(result.invocationResult.Result);
	},/*loadSchedulerbypersonSuccess  end*/
	loadSchedulerbypersonFailure: function(result){
		  console.log("loadSchedulerbypersonFailure" + JSON.stringify(result));
		  window.busy.hide();
			WL.SimpleDialog.show("에러메시지", result.errorMsg, [ {
				text : "확인",
				handler : function() {
					
					WL.Logger.debug("error button pressed");
				}
			} ]);
	},/*loadSchedulerbypersonFailure  end*/
	popupModifyList :function(items){
		
	  	console.log("hello popupModifyList :: ");
	  	$('.popupmodilistUl').empty();
	  	console.log(items);
		console.log(items.length);
		var str1 ="";
		var str2 ="";
		var str3 ="";
		var str = "";
		 for ( var i = 0; i < items.length; i++) {
			 if( items[i].ctgr=='workoutside'){
					if(items[i].strdate==items[i].enddate){
						str1 +='<li class="workoutside_popupli modifyLiforscheduler" id="'+items[i].sid+'"><i class="icon-coffee"></i>' + items[i].strdate  + '</li>';
					}else{
						str1 +='<li class="workoutside_popupli modifyLiforscheduler" id="'+items[i].sid+'"><i class="icon-coffee"></i>' + items[i].strdate +' ~ ' + items[i].enddate  + '</li>';
					}
			 }
			 if(items[i].ctgr=='dayoff'){
					if(items[i].strdate==items[i].enddate){
						str2 +='<li class="dayoff_poopupli modifyLiforscheduler" id="'+items[i].sid+'"><i class="icon-lightbulb"></i>'+ items[i].strdate +  '</li>';
					}else{
						str2 +='<li class="dayoff_poopupli modifyLiforscheduler" id="'+items[i].sid+'"><i class="icon-lightbulb"></i>' + items[i].strdate +' ~ ' + items[i].enddate + '</li>';
					}
							
				}
				if(items[i].ctgr=='longproject'){
					str3 += '<li class="longproject_popupli modifyLiforscheduler" id="'+items[i].sid+'"><i class="icon-paper-clip"></i>' + items[i].strdate +' ~ ' + items[i].enddate  + '</li>';				
				}
		 }// end of for loop


		   if(str1!=""){
			   str += '<li id="popupmodilistUl_workoutside" class="workoutside_popupli">외근</li>';	    	
		       str += str1;
			   str += '<li id="popupmodilistUl_dayoff" class="dayoff_poopupli">휴가</li>';
			   str += str2;
			   str += '<li id="popupmodilistUl_longproject" class="longproject_popupli">장기프로젝트</li>';
			   str += str3;
			   $('.popupmodilistUl').append(str);
		   }
		   
		   

		   $('.modifyLiforscheduler')
			.on(
					{

						click : function(e) {
							if (!ADF.view.addscheduler) {
								console.log("modifyLiforscheduler addscheduler view if ");
								ADF.view.addscheduler = new ADF.view.AddScheduler;							
							}
							var id = $(e.currentTarget).attr("id");
							console.log("id :: "+id);
							ADF.view.scheduler.fetchDBbySidforM(id);					

						}

			});
		 
	},/* end of popupModifyList */
	
	fetchDBbySidforM : function(id){
		var sid = id;
		console.log("sid :: "+sid);
		
//		   '{"act":"R","sid":"142"}','ADFlowSchedule'
//		var jsonData = '{"act":"R"}';
		var jsonData =  '{"act":"R", "sid":"'+sid+'"}';
		console.log("jsonData :: "+jsonData);
		
		
		
		var invocationData = {
                adapter : 'CastIronAdapter', // adapter name
                procedure : 'startOrchestration_post',
                parameters : [jsonData,'ADFlowSchedule']

        };
        console.log(".........TestScheduler.....try. to...something like that");

       
        WL.Client.invokeProcedure(invocationData, {
                onSuccess : this.loadSchedulerbySidSuccess,
                onFailure : this.loadSchedulerbySidFailure
        });
	},/*fetchDBbySidforM  end*/
	
	loadSchedulerbySidSuccess : function(result){
		console.log("loadSchedulerbySidSuccess" + JSON.stringify(result));
    	console.log("say loadSchedulerbySidSuccess");
		console.log(result.invocationResult.resultSet);
		
		if (!ADF.view.addscheduler) {
			ADF.view.addscheduler = new ADF.view.AddScheduler;
		}
		navigation.pushView(ADF.view.addscheduler, 'typeA');
		
	},/*loadSchedulerbySidSuccess  end*/
	loadSchedulerbySidFailure : function(result){
		  console.log("loadSchedulerbySidFailure" + JSON.stringify(result));
		  window.busy.hide();
			WL.SimpleDialog.show("에러메시지", result.errorMsg, [ {
				text : "확인",
				handler : function() {
					
					WL.Logger.debug("error button pressed");
				}
			} ]);
	},/*loadSchedulerbySidFailure  end*/
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
			 detail:'',
			 nameko:''
			 };
	 }
	 
});


ADF.collection.SchedulerCollection = Backbone.Collection.extend({
	initialize: function(){
		console.log("SchedulerCollection initialize.....................");
	},
	model:ADF.model.SchedulerModel
});
