
ADF.view.Scheduler = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing element.
	callDBType : '',
	sidArray :  [],
	sidarraySize : 0,
	removeSid : '',	
	koName : '',
	initialize : function() {
	console.log("SchedulerView init................. ");
	this.collection = new ADF.collection.SchedulerCollection();	
//	this.model = new ADF.model.SchedulerModel();
	
//	console.log(this.model);
//	console.log(this.model.toJSON());
	this.collection.bind('add', function() {
	    console.log('this.collection.bind...............new object in the collection');
	});	
 
	_.bindAll(this, 'render', 'fetchDB','loadSchedulerSuccess','loadSchedulerFailure','appendSchedulerList', 'popupModifyList','modifyMyScheduler','popupDeleteList','delAftershowsclist','emptySchedulerList');
	    	
	},
	render : function() {
		// load SchedulerView view
		var that = this;
		
	
		
		console.log("SchedulerView " + this);
        var window_width = $(window).width();   
        var window_height = $(window).height();   
        console.log("window_width :: "+window_width);
        console.log("window_height :: "+window_height);
        //call async
    	ADF.view.scheduler.callDBType = "RList";
    	/////////////////////////////////////////////////////
    	
//    
			this.koName = ADF.user.nameko;
			console.log("koName :: "+ this.koName);
//    
    	
    	///////////////////////////////////////////////
        var jsonData = '{"act":"R"}';
        console.log("jsonData :: "+jsonData);        
      
        
        navigation.loadBefore('views/schedulerBoard.html', function() {
//			that.getContactList();
        	
        	that.fetchDB(jsonData);
		});
		WL.App.overrideBackButton(this.backFunc);
        

        
		},
		
		fetchDB : function(jsonData){		

		
		
		/* eylee  */
//		var jsonData = '{"act":"R"}';
		console.log("jsonData :: "+jsonData);
		
		
		
		var invocationData = {
                adapter : 'CastIronAdapter', // adapter name
                procedure : 'startOrchestration_post',
                parameters : [jsonData,'ADFlowSchedule']

        };
        console.log(".........TestScheduler.....try. to...something like that");

    	window.startProc = new Date().getTime();
        WL.Client.invokeProcedure(invocationData, {
                onSuccess : this.loadSchedulerSuccess,
                onFailure : this.loadSchedulerFailure
        });
	},/*fetchDB  end*/
       
	
	loadSchedulerSuccess : function(result){
		this.procElapsedTime();
		console.log("loadSchedulerSuccess" + JSON.stringify(result));
    	console.log("say hello");
		console.log(result.invocationResult.resultSet);
		console.log("say hello  one...........");
//		console.log(result);
//		console.log(result.invocationResult);
//		console.log(result.invocationResult.Result[0]);
//		console.log(result.invocationResult.Result.length);


		var errorOk = result.invocationResult.error;

	
		
		if(errorOk){
			
			console.log(errorOk);
			var dialogTitle = "에러메시지";
			var dialogText = JSON.stringify(errorOk);
//			alert('Error :' + JSON.stringify(errorOk));
			WL.SimpleDialog.show(dialogTitle, dialogText, [ {
    			text : '확인',
    			handler : function() {
    				console.log("확인버튼  click");				
    			}
    		}

    		]);   // end of WL.SimpleDialog.show
			
		} else {
			
			switch (this.callDBType) {
			case 'RList':

				console.log("db sucess case RList *********************************************");
				console.log(result);

				if(result.invocationResult.Count==0){
					console.log("............00000000000000000");
					console.log(result.invocationResult.Count);
					this.emptySchedulerList();
				}else{
					this.appendSchedulerList(result.invocationResult.Result);
				}
				break;
			case 'RPopM':
				console.log("db sucess case RPopM *********************************************");
				this.popupModifyList(result.invocationResult.Result);
				break;
			case 'UBySid':
//				msg = this.contactNameKo + '님의 \n 삭제가 완료 되었습니다.';
				console.log("db sucess case UBySid *********************************************");
				this.modifyMyScheduler(result.invocationResult.Result);
				break;
			case 'RPopD':
				console.log("db sucess case RPopD *********************************************");
				this.popupDeleteList(result.invocationResult.Result);
				break;
			case 'DByS':			
				console.log("db sucess case DByS *********************************************");				
				this.delAftershowsclist(result.invocationResult.Result);
				break;
			default:				
				console.log("db sucess case default *********************************************");				
				break;
			}
		}
		
//		this.appendSchedulerList(result.invocationResult.array);
		
	},/*loadSchedulerSuccess  end*/
	loadSchedulerFailure : function(result){
		  console.log("loadSchedulerFailure" + JSON.stringify(result));		
			window.busy.hide();
			WL.SimpleDialog.show("에러", result.errorMsg, [ {
				text : "확인",
				handler : function() {
					// clean garbage
					console.log('panelContentSecond::'
							+ $('.page')[1].remove());

					// console.log('panelContent::'
					// + $('.panel-content').html());

					// backBtn override
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
		var that = this;
	  	console.log("hello appendSchedulerList :: ");
//	  	console.log(items);
//		console.log(items.length);
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
		var myDay  = weekday[currentTime.getDay()];		
//		<i class="icon-calendar"><div>Mon, Dec 23</div></i>		
		
		var myheader ='<i class="icon-calendar">';
		myheader +=' ';
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
					str1 +='<li class="workoutside_li" id= "liSid_'+items[i].sid +'">' + items[i].strdate + items[i].nameko + items[i].detail + '</li>';
				}else{
					str1 +='<li class="workoutside_li" id= "liSid_'+items[i].sid +'">'  + items[i].strdate +' ~ ' + items[i].enddate + items[i].nameko + items[i].detail + '</li>';
				}
			}
			if(items[i].ctgr=='dayoff'){
				if(items[i].strdate==items[i].enddate){
					str2 +='<li class="dayoff_li" id= "liSid_'+items[i].sid +'">' + items[i].strdate + items[i].nameko + items[i].detail + '</li>';
				}else{
					str2 +='<li class="dayoff_li" id= "liSid_'+items[i].sid +'">'  + items[i].strdate +' ~ ' + items[i].enddate + items[i].nameko + items[i].detail + '</li>';
				}
						
			}
			if(items[i].ctgr=='longproject'){
				str3 += '<li class="longproject_li" id= "liSid_'+items[i].sid +'">'  + items[i].strdate +' ~ ' + items[i].enddate  +' ' +items[i].nameko  +'<br/>        ' + items[i].detail + '</li>';				
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

       //call async
//       navigation.loadAsync(function(){console.log('call after()')});
       navigation.loadAsync(function(){
    	   console.log(" navigation.loadAsync scheduler..................");
    	 
               /*
                    var myScroll = new iScroll('iscrolldiv', {
                            hScrollbar : false,
                            vScrollbar : false
                    });
               */ 		
		     that.viewElapsedTime();
	    	 window.busy.hide();
			

       });    // end of navigation.loadAsync

       $('.btn_inputScheduler').on('click', function() {		
			console.log("btn_inputScheduler event changed.........."+this);
			ADF.view.scheduler.inputScheduler();
			
		}); // end of btn_inputScheduler
		
		$('#backbtnOnscheduler').on(
		{
			click : function() {
				console.log("back button click");
				
				console.log('backBtnClicked!!!!!!!!!!!!!!!!!');
				window.beforeload = new Date().getTime();
				if (!ADF.view.dashBoard) {
					ADF.view.dashBoard = new ADF.view.DashBoard;
				}
				navigation.pushView(ADF.view.dashBoard, 'typeB');
//				if (!ADF.view.dashBoard) {
//					ADF.view.dashBoard = new ADF.view.DashBoard;
//				}
//				navigation.pushView(ADF.view.dashBoard, 'typeB');
			}

		});  // end of backbtnOnscheduler
		
		$('.btn_modifyScheduler').on(
				{
					click : function() {
						console.log("btn_modifyScheduler click");
						ADF.view.scheduler.callDBType = "RPopM";
						 console.log("callDBType :: "+ADF.view.scheduler.callDBType);
						
						 $("#popUpDivModify").show();						

						 ///////////////////////////////////////////////////////////
						 
						 if(ADF.user.no!=""||ADF.user.no!=null||ADF.user.no!='undefined'){
							var employeeNo = ADF.user.no;
							 console.log("employeeNo :: "+employeeNo);						 
							 //////////////////////////////////////////////////////
							 var jsonData =  '{"act":"R", "owner":"'+employeeNo+'"}';
							 console.log("jsonData :: "+jsonData);
							 ADF.view.scheduler.fetchDB(jsonData);
						 }
						
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
					    
						 var employeeNo = ADF.user.no;
						 console.log("employeeNo :: "+employeeNo);						 
						 //////////////////////////////////////////////////////
											
						 var jsonData =  '{"act":"R", "owner":"'+employeeNo+'"}';
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
	emptySchedulerList : function(){
		var that = this;
    	 navigation.loadAsync(function(){
      	   console.log(" navigation.loadAsync scheduler..................");
      	 
                 /*
                      var myScroll = new iScroll('iscrolldiv', {
                              hScrollbar : false,
                              vScrollbar : false
                      });
                 */ 		
  		     that.viewElapsedTime();
  	    	 window.busy.hide();
  			

         });   // end of navigation.loadAsync

         $('.btn_inputScheduler').on('click', function() {		
  			console.log("btn_inputScheduler event changed.........."+this);
  			ADF.view.scheduler.inputScheduler();
  			
  		}); // end of btn_inputScheduler
  		
  		$('#backbtnOnscheduler').on(
  		{
  			click : function() {
  				console.log("back button click");
  				
  				console.log('backBtnClicked!!!!!!!!!!!!!!!!!');
  				window.beforeload = new Date().getTime();
  				if (!ADF.view.dashBoard) {
  					ADF.view.dashBoard = new ADF.view.DashBoard;
  				}
  				navigation.pushView(ADF.view.dashBoard, 'typeB');
//  				if (!ADF.view.dashBoard) {
//  					ADF.view.dashBoard = new ADF.view.DashBoard;
//  				}
//  				navigation.pushView(ADF.view.dashBoard, 'typeB');
  			}

  		});  // end of backbtnOnscheduler
  		
  		$('.btn_modifyScheduler').on(
  				{
  					click : function() {
  						console.log("btn_modifyScheduler click");
  						ADF.view.scheduler.callDBType = "RPopM";
  						 console.log("callDBType :: "+ADF.view.scheduler.callDBType);
  						
  						 $("#popUpDivModify").show();						

  						 ///////////////////////////////////////////////////////////
  						 
  						 if(ADF.user.no!=""||ADF.user.no!=null||ADF.user.no!='undefined'){
  							var employeeNo = ADF.user.no;
  							 console.log("employeeNo :: "+employeeNo);						 
  							 //////////////////////////////////////////////////////
  							 var jsonData =  '{"act":"R", "owner":"'+employeeNo+'"}';
  							 console.log("jsonData :: "+jsonData);
  							 ADF.view.scheduler.fetchDB(jsonData);
  						 }
  						
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
  					    
  						 var employeeNo = ADF.user.no;
  						 console.log("employeeNo :: "+employeeNo);						 
  						 //////////////////////////////////////////////////////
  											
  						 var jsonData =  '{"act":"R", "owner":"'+employeeNo+'"}';
  						 console.log("jsonData :: "+jsonData);
  						 ADF.view.scheduler.fetchDB(jsonData);				 
  						
//  						 ADF.view.scheduler.fetchDBforDelList();
  						
  					}

  		});  // end btn_deleteScheduler
  		$('.btn_deleteScheduler_ok').on(
  				{
  					click : function() {
  						console.log("btn_deleteScheduler_ok click");
  						$('#popUpDivDelete').hide();
  						
  						
  					}

  		});  // end btn_deleteScheduler_ok
  		
    	
    },  /* end of emptySchedulerList */
	
	
	/*
	events:{
		'click .btn_inputScheduler':'inputScheduler'
	},
	*/
	inputScheduler:function(){
		
			console.log("inputScheduler....lalalal...................... "
					+ this);
			
//			console.log("ADF.user.no :: "+ADF.user.no);
//			console.log('ADF.user.nameen::' + ADF.user.nameen);
//			var employeeNumber = ADF.user.no;
			 var employeeName = '';
			 var employeeNo = '';
			 if(ADF.user.no!=""||ADF.user.no!=null||ADF.user.no!='undefined'){
				employeeNo = ADF.user.no;
				console.log("employeeNo :: "+employeeNo);	
				employeeName = ADF.user.nameko;
			 }
////////////////////////////////
//			 need busy logic
			 
			 
			 
			 
			 
			 
			if (!ADF.view.addscheduler) {
				ADF.view.addscheduler = new ADF.view.AddScheduler;
			}
			
		
			ADF.view.addscheduler.cleanupinputform("false");
			ADF.view.addscheduler.nowUser(employeeNo,employeeName);
			navigation.pushView(ADF.view.addscheduler, 'typeA');
		

	},  // end of inputScheduler 
	/*
	elapsedTime : function() {
		var aftrload = new Date().getTime();
		// Time calculating in seconds
		var time = (aftrload - window.beforeload) / 1000;
		document.getElementById("schedulerElapsedTime").innerHTML = "Your Page took <font color='red'><b>"
				+ time + "</b></font> Seconds to Load";
		window.beforeload = 0;
	},  // end of elaspsedTime
	*/	
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

//		 현황 없음
		   if(str1!=""){
			   str += '<li id="popupmodilistUl_workoutside" class="workoutside_popupli">외근</li>';	    	
		       str += str1;
		   }else{
//			   str += '<li id="popupmodilistUl_workoutside" class="workoutside_popupli">외근 현황 없음</li>';	 
		   }
		   if(str2!=""){
			   str += '<li id="popupmodilistUl_dayoff" class="dayoff_poopupli">휴가</li>';
			   str += str2;
		   }else{
//			   str += '<li id="popupmodilistUl_dayoff" class="dayoff_poopupli">휴가 현황 없음</li>';
		   }
		   if(str3!=""){
			   str += '<li id="popupmodilistUl_longproject" class="longproject_popupli">장기프로젝트</li>';
			   str += str3;
		   }else{
//			   str += '<li id="popupmodilistUl_longproject" class="longproject_popupli">장기프로젝트 현황 없음</li>';
		   }
			  
			 $('.popupmodilistUl').append(str);
		   
		   
		   

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
			   
	},	// end of modifyMyScheduler
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
		   }else{
//			   str += '<li id="popupmodilistUl_workoutside" class="workoutside_popupli">외근 현황 없음</li>';	    	
		       
		   }
		   if(str2!=""){
			   str += '<li id="popupmodilistUl_dayoff" class="dayoff_poopupli">휴가</li>';
			   str += str2;
		   }else{
//			   str += '<li id="popupmodilistUl_dayoff" class="dayoff_poopupli">휴가 현황 없음</li>';
		   }
		   if(str3!=""){
			   str += '<li id="popupmodilistUl_longproject" class="longproject_popupli">장기프로젝트</li>';
			   str += str3;
		   }else{
//			   str += '<li id="popupmodilistUl_longproject" class="longproject_popupli">장기프로젝트 현황 없음</li>';
		   }
	       $('.popupdellistUl').append(str);
		
		   
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

	       /*
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

			});  // end of deleteLiforscheduler
		   
		   */
	       
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

			});  // end of btn_alldel_pop
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

			});  // end of btn_allunselected_pop
		   
		    $('.btn_selecteddel_pop').on(
					{

						click : function(e) {
							console.log("btn_selecteddel_pop :: ");
                            $('.deleteLiforscheduler').each(function() {
                                    var id =  this.id;
                                    var myidArray =  id.split("_");
                                    var myid = myidArray[1];                                                        
                                    var checked = document.getElementById(myid).checked;
//                                    var checked = document.getElementById(this.id).is(':checked');
                                    if(checked==true){
//                                    	alert("checkbox id =" + myid + " checked status " + checked);      
                                    	ADF.view.scheduler.callDBType = "DByS";
                                    	console.log("callDBType :: "+ADF.view.scheduler.callDBType);                                                       
                                    	ADF.view.scheduler.removeSid = myid;
                                    	ADF.view.scheduler.sidArray.push(myid);
                                    	var jsonData = '{ "act" : "D", "sid" : "'+myid+'" }';
                                        console.log("jsonData :: "+jsonData);                                                                        
//                                       navigation.loadBefore('views/schedulerBoard.html', ADF.view.scheduler.fetchDeleteDB(jsonData));
//                                       navigation.loadBefore('views/schedulerBoard.html', ADF.view.scheduler.fetchDB(jsonData));
                                                                                                  
//                                        ADF.view.scheduler.delAftershowsclist();
                                        ADF.view.scheduler.fetchDB(jsonData);
                                    } // end of checked
                             });  // end of deleteLiforscheduler
                            
                            for (var i=0; i < ADF.view.scheduler.sidArray.length; i++) {
                            	  console.log("end of deleteLiforscheduler ADF.view.scheduler.sidArray[i] "+ADF.view.scheduler.sidArray[i]);
                            	   console.log("ADF.view.scheduler.sidArray "+ADF.view.scheduler.sidArray.length);
                            }
                         
                            if(ADF.view.scheduler.sidArray.length==0){	
                            	
                            
                        		var dialogTitle = "스케줄러";
                        		var dialogText = "체크박스를 선택해 주세요";

                        		WL.SimpleDialog.show(dialogTitle, dialogText, [ {
                        			text : '확인',
                        			handler : function() {

                        				console.log("확인버튼 click");
                					
                        			}
                        		}

                        		]);
                            
                            	
                            	
                            }
                            
                            if(ADF.view.scheduler.sidarraySize == 0){
                                console.log("equal..............0    :: "+ADF.view.scheduler.sidarraySize);
                                ADF.view.scheduler.sidarraySize = ADF.view.scheduler.sidArray.length;
                                console.log("ADF.view.scheduler.sidarraySize :: "+ADF.view.scheduler.sidarraySize);
                            }
                            console.log("after if ADF.view.scheduler.sidarraySize :: "+ADF.view.scheduler.sidarraySize);
						}

			 });  // end of btn_selecteddel_pop
		 
	},/* end of popupDeleteList */
	delAftershowsclist : function(items){	
	
		
		
		 console.log("mine............................. :: ");
		 if( this.sidarraySize > 0 ){
			 console.log(" this.sidarraySize > 0 :: "+ this.sidarraySize);
			 this.sidarraySize -= 1;
			 console.log("- 1 after :: "+ this.sidarraySize);
			 
			 if(this.sidarraySize == 0){
				 for (var i=0; i < ADF.view.scheduler.sidArray.length; i++) {
					 console.log("for.....................hi............................");
			       	 console.log("end of deleteLiforscheduler ADF.view.scheduler.sidArray[i] "+ADF.view.scheduler.sidArray[i]);
			         var removeid =  "liSid_"+ ADF.view.scheduler.sidArray[i];
			         var removepopliid =  "li_"+ ADF.view.scheduler.sidArray[i];
			         console.log("removeid :: "+removeid);
			         rid = "'#" +removeid +"'";  
			     	$('#'+removeid).remove();
			     	$('#'+removepopliid).remove();
			     	
			       	 console.log("ADF.view.scheduler.sidArray "+ADF.view.scheduler.sidArray.length);
			       } // end of for
				 ADF.view.scheduler.sidArray = [];
				 var dialogTitle = "알림";
		    	var dialogText =  this.koName + '님의 \n 삭제가 완료 되었습니다.';				
					WL.SimpleDialog.show(dialogTitle, dialogText, [ {
		    			text : '확인',
		    			handler : function() {
		    				console.log("확인버튼 click");			
		    			
		    				$('#popUpDivDelete').hide();
							
		    			}
		    		}

		    		]);   // end of WL.SimpleDialog.show
			 } /// end of  if(this.sidarraySize == 0){
		 
		 }  // end of  if( this.sidarraySize > 0 )
		 
	       console.log("ADF.view.scheduler.sidarraySize this.sidarraySize :: "+this.sidarraySize);
	       console.log("ADF.view.scheduler.sidarraySize :: "+this.sidArray.length);
		 
//		 for (var i=0; i < ADF.view.scheduler.sidArray.length; i++) {
//       	  console.log("end of deleteLiforscheduler ADF.view.scheduler.sidArray[i] "+ADF.view.scheduler.sidArray[i]);
//       	   console.log("ADF.view.scheduler.sidArray "+ADF.view.scheduler.sidArray.length);
//       }
    
      
       
		 
		 
		 
	}, // end of delAftershowsclist
	
	viewElapsedTime : function() {
		// Time calculating in seconds
		var time = (new Date().getTime() - window.beforeload) / 1000;
		console.log('viewElapsedTime::' + time);
		var gap = time - window.procTime;
		document.getElementById("schedulerElapsedTime").innerHTML = document
				.getElementById("schedulerElapsedTime").innerHTML
				+ " page : <font color='red'><b>"
				+ time
				+ "</b></font> ms gap : <font color='red'><b>"
				+ gap.toFixed(3) + "</b></font> ms";
		window.beforeload = 0;
	},
	procElapsedTime : function() {
		// Time calculating in seconds
		window.procTime = (new Date().getTime() - window.startProc) / 1000;
		console.log('procedureElapsedTime::' + window.procTime);
		document.getElementById("schedulerElapsedTime").innerHTML = "procedure : <font color='red'><b>"
				+ window.procTime + "</b></font> ms";
		window.startProc = 0;
	},
	backFunc : function() {
		window.beforeload = new Date().getTime();

		if (!ADF.view.dashBoard) {
			ADF.view.dashBoard = new ADF.view.DashBoard;
		}
		navigation.pushView(ADF.view.dashBoard, 'typeB');
	}
	
	
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
