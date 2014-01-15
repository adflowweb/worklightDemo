
ADF.view.Scheduler = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing element.
	callDBType : '',
	initialize : function() {
	console.log("SchedulerView init................. ");
	this.collection = new ADF.collection.SchedulerCollection();	
//	this.model = new ADF.model.SchedulerModel();
	
//	console.log(this.model);
//	console.log(this.model.toJSON());
	this.collection.bind('add', function() {
	    console.log('this.collection.bind...............new object in the collection');
	});
	
//	_.bindAll(this, 'render', 'fetchDB','loadSchedulerSuccess','loadSchedulerFailure','appendSchedulerList', 'fetchDBforModify','loadSchedulerbypersonSuccess','loadSchedulerbypersonFailure','popupModifyList','fetchDBbySidforM','loadSchedulerbySidSuccess','loadSchedulerbySidFailure','modifyMyScheduler','fetchDBforDelList','loadSchedulerbypersonDSuccess','loadSchedulerbypersonDFailure','popupDeleteList','fetchDeleteDB','fetchDeleteDBSuccess','fetchDeleteDBFailure'); 
	_.bindAll(this, 'render', 'fetchDB','loadSchedulerSuccess','loadSchedulerFailure','appendSchedulerList', 'popupModifyList','modifyMyScheduler','popupDeleteList','delAftershowsclist');
	    	
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
		var jsonData = '{"act":"R"}';
		console.log("jsonData :: "+jsonData);
		
		navigation.loadBefore('views/schedulerBoard.html', this.fetchDB(jsonData));
		this.callDBType = "RList";
		
		//navigation.load('views/schedulerBoard.html', this.fetchDB);
		WL.App.overrideBackButton(backFunc);
		function backFunc() {
			if (!ADF.view.dashBoard) {
				ADF.view.dashBoard = new ADF.view.DashBoard;
			}
			navigation.pushView(ADF.view.dashBoard, 'typeB');
		}
	
		
	},

	
	fetchDB : function(jsonData){		
		//startOrchestration_post
//		var invocationData = {
//                adapter : 'CastIronAdapter', // adapter name
//                procedure : 'startOrchestration',
//                parameters : ['ADFlowSchedule']
        // parameters if any
//        };
		
		
		/* eylee  */
//		var jsonData = '{"act":"R"}';
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
//		console.log(result.invocationResult.Result[0]);
//		console.log(result.invocationResult.Result.length);


		var errorOk = result.invocationResult.error;

		console.log(errorOk);
		
		if(errorOk){
//			alert('Error :' + JSON.stringify(errorOk));
			WL.SimpleDialog.show("오류", JSON.stringify(errorOk));
			
		} else {
			
			var msg;
			switch (this.callDBType) {
			case 'RList':
//				msg = this.contactNameKo + '님의 \n 추가 완료 되었습니다.';
				msg = 'RList';
				console.log("db sucess case RList *********************************************");
				this.appendSchedulerList(result.invocationResult.Result);
				break;
			case 'RPopM':
//				msg = this.contactNameKo + '님의 \n 수정이 완료 되었습니다.';
				msg = 'RPopM';
				console.log("db sucess case RPopM *********************************************");
				this.popupModifyList(result.invocationResult.Result);
				break;
			case 'UBySid':
//				msg = this.contactNameKo + '님의 \n 삭제가 완료 되었습니다.';
				msg = 'UBySid';
				console.log("db sucess case UBySid *********************************************");
				this.modifyMyScheduler(result.invocationResult.Result);
				break;
			case 'RPopD':
//				msg = this.contactNameKo + '님의 \n 삭제가 완료 되었습니다.';
				msg = 'RPopD';
				console.log("db sucess case RPopD *********************************************");
				this.popupDeleteList(result.invocationResult.Result);
				break;
			case 'DByS':
//				msg = this.contactNameKo + '님의 \n 삭제가 완료 되었습니다.';
				msg = 'RList';
				console.DByS("db sucess case DByS *********************************************");
				this.delAftershowsclist(result.invocationResult.Result);
				break;
			default:
				msg = 'default';
				console.log("db sucess case default *********************************************");
				msg = '';
				break;
			}
		}
		WL.SimpleDialog.show("성공", msg);
//		this.appendSchedulerList(result.invocationResult.array);
		
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
		weekday[0]="일요일";
		weekday[1]="월요일";
		weekday[2]="화요일";
		weekday[3]="수요일";
		weekday[4]="목요일";
		weekday[5]="금요일";
		weekday[6]="토요일";
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
//		   this.collection.add(this.model.set(
		   this.collection.add(new ADF.model.SchedulerModel(
					{
						 sid: items[i].sid,
						owner : items[i].owner ,
						nameko : items[i].nameko,
						ctgr : items[i].ctgr,
						strdate : items[i].strdate,
						enddate : items[i].enddate ,						
						detail :  items[i].detail,
						 nameko: items[i].nameko		
					}));
		 
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
						ADF.view.scheduler.callDBType = "RPopM";
						 console.log("callDBType :: "+ADF.view.scheduler.callDBType);
						
						 $("#popUpDivModify").show();						
						
						 var jsonData =  '{"act":"R", "owner":"78322"}';
						 console.log("jsonData :: "+jsonData);
						 ADF.view.scheduler.fetchDB(jsonData);
						
					}

		});  // end btn_modifyScheduler
		
		$('.btn_modifyScheduler_ok').on(
				{
					click : function() {
						console.log("btn_modifyScheduler_ok click");
						// db query..part I need
						
						  $("#popUpDivModify").hide();
						
						
					}

		});  // end btn_modifyScheduler
		
		
		$('.btn_deleteScheduler').on(
				{
					click : function() {
						console.log("btn_deleteScheduler click");
						$('#popUpDivDelete').show();
						 console.log("btn_deleteScheduler show");
						 
						ADF.view.scheduler.callDBType = "RPopD";
					    console.log("callDBType :: "+ADF.view.scheduler.callDBType);
							 
					
						 var jsonData =  '{"act":"R", "owner":"78322"}';
						 console.log("jsonData :: "+jsonData);
						 ADF.view.scheduler.fetchDB(jsonData);				 
						
//						 ADF.view.scheduler.fetchDBforDelList();
						
					}

		});  // end btn_deleteScheduler
		$('.btn_deleteScheduler_ok').on(
				{
					click : function() {
						console.log("btn_deleteScheduler_ok click");
						$('#popUpDivDelete').hide();
						
						
					}

		});  // end btn_deleteScheduler_ok
		
		
		
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
			ADF.view.addscheduler.nowUser('78322');
			ADF.view.addscheduler.cleanupinputform("false");
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
                
                       str1 +='<li class="workoutside_popupli modifyLiforscheduler" id="'+items[i].sid+'"><i class="icon-lightbulb"></i>' + items[i].detail   + '</li>';
                }
			   if(items[i].ctgr=='dayoff'){
			           str2 +='<li class="dayoff_poopupli modifyLiforscheduler" id="'+items[i].sid+'"><i class="icon-coffee"></i>'+ items[i].detail  +  '</li>';                
			                                  
			   }
			 if(items[i].ctgr=='longproject'){
                  str3 += '<li class="longproject_popupli modifyLiforscheduler" id="'+items[i].sid+'"><i class="icon-paper-clip"></i>' +items[i].detail   + '</li>';                                
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
							console.log("id :: "+e.currentTarget);
							console.log("id :: "+id);
//							ADF.view.scheduler.fetchDBbySidforM(id);
							
							ADF.view.scheduler.callDBType = "UBySid";
						    console.log("callDBType :: "+ADF.view.scheduler.callDBType);
							
					
							var sid = id;
							console.log("sid :: "+sid);							
//							   '{"act":"R","sid":"142"}','ADFlowSchedule'
//							var jsonData = '{"act":"R"}';
							var jsonData =  '{"act":"R", "sid":"'+sid+'"}';
							console.log("jsonData :: "+jsonData);
							ADF.view.scheduler.fetchDB(jsonData);
							
							
							
//								$('#Bt_contactUpdate').removeClass('btn-info').removeClass('btn-contactUpdate').addClass('btn-success').addClass('btn-contactAddFinish');
//						

						},
						mouseover : function(e){
							var id = $(e.currentTarget).attr("id");
							console.log("id :: "+id);
//							 $(e.currentTarget).addClass('mymouseoverLi');
							 //need mouseover event color
						},
						mouseout : function(e){
							var id = $(e.currentTarget).attr("id");
							console.log("id :: "+id);
//							 $(e.currentTarget).removeClass('mouseout');
							 //need mouseover event color
						}

			});
		 
	},/* end of popupModifyList */	
	modifyMyScheduler :function(items){
	 	console.log("hello modifyMyScheduler :: "); 
	  	console.log(items);
		console.log(items.length);
			 
		 var mdmodel =new ADF.model.SchedulerModel(
					{
						 sid: items[0].sid,
						owner : items[0].owner ,
						nameko : items[0].nameko,
						ctgr : items[0].ctgr,
						strdate : items[0].strdate,
						enddate : items[0].enddate ,						
						detail :  items[0].detail,
						 nameko: items[0].nameko	
			});
			console.log("mdmodel :: "+ mdmodel.toJSON());
			console.log("mdmodel :: "+ mdmodel);	

		 
			if (!ADF.view.addscheduler) {
				ADF.view.addscheduler = new ADF.view.AddScheduler;
			}			
		
			ADF.view.addscheduler.addFlagOn(true);
			ADF.view.addscheduler.SetschedulerDetailItem(mdmodel);
			navigation.pushView(ADF.view.addscheduler, 'typeA');
			   
	},	
	popupDeleteList :function(items){
		
	  	console.log("hello popupDeleteList :: ");
	  	$('.popupdellistUl').empty();
	  	console.log(items);
		console.log(items.length);
		var str1 ="";
		var str2 ="";
		var str3 ="";
		var str = "";
		 for ( var i = 0; i < items.length; i++) {
			 if( items[i].ctgr=='workoutside'){
                
                  str1 +='<li class="workoutside_popupli deleteLiforscheduler" id="li_'+items[i].sid+'"><label for="'+items[i].sid+'"><input type="checkbox" class="delsid" id="'+items[i].sid+'"><i class="icon-lightbulb"></i>' + items[i].detail   + '</label></li>';
                
				}
			   if(items[i].ctgr=='dayoff'){
			               
	             str2 +='<li class="dayoff_poopupli deleteLiforscheduler" id="li_'+items[i].sid+'"><label for="'+items[i].sid+'"><input type="checkbox" class="delsid" id="'+items[i].sid+'"><i class="icon-coffee"></i>'+ items[i].detail  +  '</label></li>';			               
			                                  
			   }
			 if(items[i].ctgr=='longproject'){
                 str3 += '<li class="longproject_popupli deleteLiforscheduler" id="li_'+items[i].sid+'"><label for="'+items[i].sid+'"><input type="checkbox" class="delsid" id="'+items[i].sid+'"><i class="icon-paper-clip"></i>' + items[i].detail   + '</label></li>';                                
			 }
		 }// end of for loop


		   if(str1!=""){
			   str += '<li id="popupmodilistUl_workoutside" class="workoutside_popupli">외근</li>';	    	
		       str += str1;
			   str += '<li id="popupmodilistUl_dayoff" class="dayoff_poopupli">휴가</li>';
			   str += str2;
			   str += '<li id="popupmodilistUl_longproject" class="longproject_popupli">장기프로젝트</li>';
			   str += str3;
			   $('.popupdellistUl').append(str);
		   }
		   
//		   $(".delsid").change( function(e){
//	 
//			   var id = $(e.currentTarget).attr("id");
//			   alert("state changed" +id);		
//			   var myidArray = id.split("_");
//			   var myid = myidArray[0];
//			   alert("state changed" +myid);	
//			  document.getElementById(myid).setAttribute('checked', 'checked');
//
//			 });

		   $('.deleteLiforscheduler')
			.on(
					{

						click : function(e) {
							
							var id = $(e.currentTarget).attr("id");
							console.log("id :: "+e.currentTarget);
							console.log("id :: "+id);
								
//								$('#Bt_contactUpdate').removeClass('btn-info').removeClass('btn-contactUpdate').addClass('btn-success').addClass('btn-contactAddFinish');
//						

						},
						mouseover : function(e){
							var id = $(e.currentTarget).attr("id");
							console.log("id :: "+id);
//							 $(e.currentTarget).addClass('mymouseoverLi');
//							 console.log($(e.currentTarget));
							 //need mouseover event color
						},
						mouseout : function(e){
							var id = $(e.currentTarget).attr("id");
							console.log("id :: "+id);
//							 $(e.currentTarget).removeClass('mouseout');
							 //need mouseover event color
						}

			});
		   
		   $('.btn_alldel_pop').on(
				{

					click : function(e) {
						console.log("btn_alldel_pop :: "+this);
					
						
						 $('.deleteLiforscheduler').each(function() {
							 var id =  this.id;
							 var myidArray =  id.split("_");
							 var myid = myidArray[1];		
							
							 document.getElementById(myid).checked=true;
							console.log( document.getElementById(myid).checked); 					 
						   
						  });
						
						
					
					}

			});
		   $('.btn_allunselected_pop').on(
					{

						click : function(e) {
							console.log("btn_allunselected_pop");
							
							$('.deleteLiforscheduler').each(function() {
								 var id =  this.id;
								 var myidArray =  id.split("_");
								 var myid = myidArray[1];		
								 console.log("myid"+myid);
								 document.getElementById(myid).checked=false;
								 console.log( document.getElementById(myid).checked); 					 
							   
							  });
							
							
							
						}

			});
		    $('.btn_selecteddel_pop').on(
					{

						click : function(e) {
							console.log("btn_selecteddel_pop :: ");
							 $('.deleteLiforscheduler').each(function() {
								 var id =  this.id;
								 var myidArray =  id.split("_");
								 var myid = myidArray[1];							
								 var checked = document.getElementById(myid).checked;
//								 var checked = document.getElementById(this.id).is(':checked');
								 if(checked==true){
							       alert("checkbox id =" + myid + " checked status " + checked);
							    
//							      { “act” : “D”, “sid” : “1” }
							     ADF.view.scheduler.callDBType = "DByS";
							     console.log("callDBType :: "+ADF.view.scheduler.callDBType);						       
							     
							       var jsonData = '{ "act" : "D", "sid" : "'+myid+'" }';
									console.log("jsonData :: "+jsonData);									
//									navigation.loadBefore('views/schedulerBoard.html', ADF.view.scheduler.fetchDeleteDB(jsonData));
									navigation.loadBefore('views/schedulerBoard.html', ADF.view.scheduler.fetchDB(jsonData));
								 }
							  });
						}

			 });
		 
	},/* end of popupDeleteList */
	delAftershowsclist : function(items){
		console.log("delAftershowsclist :: "+items);		
		
	

	},  // end of delAftershowsclist 
	
	
});


ADF.model.SchedulerModel = Backbone.Model.extend({
	initialize: function(){
	console.log("SchedulerModel initialize........................");	
	},
	 defaults: function(){
		 return {
			 sid:'',
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
