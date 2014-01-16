/**
 * 
 */


ADF.view.AddScheduler = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing element.
	addFlag : false,	
	userid : "",
	initialize : function() {
	
		console.log("AddScheduler view  init................. ");		
		_.bindAll(this, 'render','fetchDB','loadaddSchedulerSuccess','loadaddSchedulerFailure','appendaddSchedulerList','SetschedulerDetailItem','addFlagOn','displaydetail','updateScheduler','nowUser','cleanupinputform'); 
		
		// fixes loss of context for 'this' within	
	},
	
	render : function() {
	
		window.beforeload = new Date().getTime();
		window.busy.show();
		console.log("SchedulerView " + this);
		var window_width = $(window).width();   
		console.log("window_width :: "+window_width);		
		navigation.loadBefore('views/addschedulerForm.html', this.displaydetail);
		
		WL.App.overrideBackButton(backFunc);
		function backFunc() {
			 $( "#datepicker1" ).datepicker("hide");
			 $( "#datepicker2" ).datepicker("hide");
			if (!ADF.view.scheduler) {			
				ADF.view.scheduler = new ADF.view.Scheduler;
			}
			navigation.pushView(ADF.view.scheduler, 'typeB');
		}
		
		
	 },
	 displaydetail: function(){
		   navigation.loadAsync(function(){ADF.view.addscheduler.elapsedTime();window.busy.hide();});
		   
		   $('#backbtnOnaddscheduler').on(
					{
						click : function(e) {
							 $( "#datepicker1" ).datepicker("hide");
							 $( "#datepicker2" ).datepicker("hide");
							console.log("back button click");
							if (!ADF.view.scheduler) {
								ADF.view.scheduler = new ADF.view.Scheduler;
							}
							navigation.pushView(ADF.view.scheduler, 'typeB');							
						}

					});
		   
		   
		   var flag = this.addFlag;
		   
		   console.log(" displaydetail   addFlag ::" + flag );
		   
		   
		   $('.btn_addschedulerbtn').on('click', function() {		
				console.log("press btn_addschedulerbtn..................");

				ADF.view.addscheduler.addSchedulerForm();
			});
		   
		   
		
		   
		
		   $(function() {
//			   alert("Device Ready");		
			    $('#datepicker1').on(
			    		
						{
							click : function(e) {
//								document.addEventListener("showkeyboard", function(){ alert("Keyboard is ON");}, false);
//								document.addEventListener("hidekeyboard", function(){ alert("Keyboard is OFF");}, false);
//								$(document.activeElement).filter(':input:focus').blur();		
								 $(this).filter(':input:focus').blur();	
//								 $(this).off('blur');
								 
//								 $( "#datepicker1" ).datepicker({
//								    dateFormat: 'yy-mm-dd'
//								   });						
							}

				});  // end of datepicker1
			    
			    $('#datepicker2').on(
						{
                            
							click : function(e) {
//								document.addEventListener("showkeyboard", function(){ alert("Keyboard is ON");}, false);
//								document.addEventListener("hidekeyboard", function(){ alert("Keyboard is OFF");}, false);
								 $(this).filter(':input:focus').blur();	
//								$(document.activeElement).filter(':input:focus').blur();								
//								 $( "#datepicker2" ).datepicker({
//									    dateFormat: 'yy-mm-dd'
//								   });		
											
							}

				});  // end of datepicker2
			   
			
				  $( "#datepicker1" ).datepicker({					  
				    dateFormat: 'yy-mm-dd'
				  });
				  $( "#datepicker2" ).datepicker({
					    dateFormat: 'yy-mm-dd'
					  });
				  
			});
		   
		   
		   // 수정하기 일때 input 필드에 값 입력
		   if(flag==true){
			   console.log("flag .................lololo..."+flag);
//			    $('#Bt_contactUpdate').removeClass('btn-info').removeClass('btn-contactUpdate').addClass('btn-success').addClass('btn-contactAddFinish');
			   $(".scheduler_textHeader").html('<h4>이벤트 수정</h4>');
				$("#footerOneli_full").html('<a href="#" class="btn btn-success btn_modifyschedulerbtn" id="footerOnea_full"><i class="icon-edit"></i>수정하기</a>');
				$("#footerOneli_full").css("background-color","#1B598A").css("color","#FFF");

				console.log("this.scModel :: "+this.scModel);
				$("#scheduler_mduser").val(this.scModel.get('nameko'));
				$("#scheduler_mduser").attr("readonly",true);
				$("#as_categoryfield").val(this.scModel.get('ctgr'));
				$(".sc_addevent").val(this.scModel.get('detail'));
				$("#datepicker1").val(this.scModel.get('strdate'));
				$("#datepicker2").val(this.scModel.get('enddate'));				
		   }else{
			   console.log("flag .................false..input form..jsut new event..."+flag);
			   console.log("  this.userid  "+  this.userid);
			   
			   $("#scheduler_mduser").val(this.userid);
			   $("#scheduler_mduser").attr("readonly",true);
//			   $("#as_categoryfield").empty();
			   $(".sc_addevent").empty();
				$("#datepicker1").empty();
				$("#datepicker2").empty();
		   }				
		  
		  
		   $('.btn_modifyschedulerbtn').on('click', function() {		
				console.log("press btn_modifyschedulerbtn..................");
				this.addFlag = false;
				ADF.view.addscheduler.updateScheduler();
			});
		   
			
//		   var catdiv = document.getElementById("addscheduler_footer");  
//		   $('.picka_one').on('click', function() {	
//			   console.log("picka_one  clickasdfasdf");
//			   datepicker();
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
			  
//		   });
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

		
		
		
		if(scheduler_calendar1=='' || scheduler_calendar2==''|| sc_addevent ==''){			
			var dialogTitle = "";
    		var dialogText = "";
    		if(scheduler_calendar1=='' || scheduler_calendar2==''){
    			dialogTitle = "날짜입력";
    			dialogText = "날짜를 입력해 주세요";
    		}
    		if(sc_addevent=='' ){
    			dialogTitle = "이벤트입력";
    			dialogText = "이벤트를 입력해 주세요";
    		}
    		WL.SimpleDialog.show(dialogTitle, dialogText, [ {
    			text : '확인',
    			handler : function() {
    				console.log("확인버튼 click");				
    			}
    		}

    		]);   // end of WL.SimpleDialog.show
        
						
		}  // end of if(scheduler_calendar1=='' || scheduler_calendar2=='' )

		
		
		if(scheduler_calendar1!='' &&scheduler_calendar2!='' && sc_addevent!='' ){
			 $( "#datepicker1" ).datepicker("hide");
			 $( "#datepicker2" ).datepicker("hide");
			 
			 var jsonData = '{"act" : "C", "sid" : "", "owner" : "'+user +'", "ctgr" : "'+strCategory+'" ,"strdate" : "'+scheduler_calendar1+'", "enddate" : "'+scheduler_calendar2+'","detail":"'+sc_addevent+'"}';
			 console.log("jsonData   :: "+jsonData);
			 this.fetchDB(jsonData);
//			this.fetchDB(user,strCategory,sc_addevent,scheduler_calendar1,scheduler_calendar2);
		}
//		this.fetchDB(user,strCategory,sc_addevent,scheduler_calendar1,scheduler_calendar2);
		
		
		
	},
	updateScheduler :function(){

	    console.log("updateScheduler...........................");
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
		if(scheduler_calendar1==''){
			alert("날짜입력");
		}
		if(scheduler_calendar2==''){
			alert("날짜입력");
		}
		if(scheduler_calendar1!='' &&scheduler_calendar2!='' ){
			 $( "#datepicker1" ).datepicker("hide");
			 $( "#datepicker2" ).datepicker("hide");
//			 { “act” : “U”, “sid”, “1”, “owner” : “아 무 개 ”, “ctgr” : “Category”, …}
			 var sid =  this.scModel.get('sid');
			 var owner = this.scModel.get('owner');
			 console.log("sid............."+sid + "owner............."+owner);
			 var jsonData = '{"act" : "U", "sid" : "'+sid+'", "owner" : "'+owner +'", "ctgr" : "'+strCategory+'" ,"strdate" : "'+scheduler_calendar1+'", "enddate" : "'+scheduler_calendar2+'","detail":"'+sc_addevent+'"}';
			 console.log("jsonData   :: "+jsonData);
			 
			
			 
			 this.fetchDB(jsonData);
		}
//		this.fetchDB(user,strCategory,sc_addevent,scheduler_calendar1,scheduler_calendar2);
		
		
		
	},
//	fetchDB : function(user,strCategory,sc_addevent,scheduler_calendar1,scheduler_calendar2){		
	fetchDB : function(jsonData){
				
//		var jsonData = '{"act" : "C", "sid" : "", "owner" : "'+user +'", "ctgr" : "'+strCategory+'" ,"strdate" : "'+scheduler_calendar1+'", "enddate" : "'+scheduler_calendar2+'","detail":"'+sc_addevent+'"}';
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
	}, /* end of loadaddSchedulerFailure  */
	appendaddSchedulerList: function(items){
		  console.log("appendaddSchedulerList" +items);
		 
				console.log("loadscheduler loadschedulerloadscheduler "
						+ this);
				if (!ADF.view.scheduler) {
					ADF.view.scheduler = new ADF.view.Scheduler;
				}
				navigation.pushView(ADF.view.scheduler, 'typeA');
			
				
		  
	}, /* end of appendaddSchedulerList */	
	SetschedulerDetailItem : function(item) {
		console.log("SetschedulerDetailItem init..............................");
		console.log(item);
		this.scModel = item;
		console.log("SetschedulerDetailItem   SetschedulerDetailItem........"+this.scModel);
	},  /* end of SetschedulerDetailItem */
	addFlagOn : function(flag) {

		console.log("addFlag ::"+ flag);
		this.addFlag = flag;
		console.log("addFlag ::"+ this.addFlag);
	}, /* end of addFlagOn  */
	nowUser : function(userid) {

		console.log("userid ::"+ userid);
		this.userid = userid;
		console.log("userid ::"+ this.userid);
	}, /* end of nowUser */
	cleanupinputform :function(flag){
		console.log("cleanupinputform ::"+ flag);
		 
		  this.addFlag = flag;
		  var cleanflag = this.addFlag;
		   console.log(" displaydetail   cleanflag ::" + cleanflag );
		   
		if(!cleanflag){
			   console.log("flag .................false..input form..jsut new event..."+cleanflag);
			   console.log("  this.userid  "+  this.userid);
			   
			   $("#scheduler_mduser").val(this.userid);
			   $("#scheduler_mduser").attr("readonly",true);
//			   $("#as_categoryfield").empty();
			   $(".sc_addevent").empty();
				$("#datepicker1").empty();
				$("#datepicker2").empty();
		}
	} /* end of cleanupinputform */
});