console.log("contactDetail.js load");

ADF.view.ContactDetail = Backbone.View.extend({
	el : $('.panel-content'), 
	photoTemp : 'aaa',
	callDBType : '',
	contactNameKo : '',
	addFlag : false,

	initialize : function() {
		_.bindAll(this, 'render','contactSet','contactDisplay','contactUpdateFinishClick','contactAddFinishClick','readURL', 'callDBSuccess'); 
//		this.contactDisplay();
		
		
	},

	events : {
	 'click button.btn-contactUpdate' : 'contactUpdateClick',
	 'click button.btn-contactUpdateFinish' : 'contactUpdateFinishClick',
	 'click button.btn-contactAdd' : 'contactAddClick',
	 'click button.btn-contactAddFinish' : 'contactAddFinishClick',
	 'click i.icon-contactDel-click' : 'contactDelFinishClick',
	 'click #back_contactDetail' : 'contactDetailBackClick',
	},

	render : function() {
		// load dashBoard view
		var that = this;
		console.error(" contactDetail render  addFlag ::" + that.addFlag );
		navigation.load('views/contactDetail.html', function() {
			
			if (that.addFlag) {
				
				$('#Bt_contactUpdate').removeClass('btn-info').removeClass('btn-contactUpdate').addClass('btn-success').addClass('btn-contactAddFinish');
				$("#Bt_contactUpdate").html("추 가 완 료");
				$("input.contactInput").css("background-color","#FFF").css("color","#000");
				$("input.contactInput").attr("readonly",false);
				$("select.contactInputSel").attr("disabled",false);
				$("i.icon-contactDel-click").hide();
				this.photoTemp =  '';
				
				that.addFlag = false;
				
				
			} else {
				
				that.contactDisplay();

			}
			 
			console.error("render2   render2   render2");
		});
		
		$("#In_imgFile").on({
		      change : function() {
		    	  alert(this.value); //선택한 이미지 경로 표시
		    	  console.log(this);
		    	  that.readURL(this);
		      }
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
		$("#In_imgFile").show();
		console.error("contactUpdateClick   contactUpdateClick   contactUpdateClick");
		$("i.icon-contactDel-click").hide();
	},
	
	contactUpdateFinishClick : function() {
		
		var inNo = parseInt(document.getElementById("In_No").value);
		
		if( isNaN(inNo) ||inNo > 99999 || inNo < 0 ){
			alert('사번은 숫자 5자리 이하로 입력 하세요!');
			document.getElementById("In_No").focus();
			
			return; //함수 종료.
		};
		
//	console.log("In_NameKo ::"+ document.getElementById("In_NameKo").value + " len ::" + document.getElementById("In_NameKo").value.length);
		
		if( document.getElementById("In_NameKo").value == '' ){
			alert('이름은 꼭 입력 해야 합니다!');
			document.getElementById("In_NameKo").focus();
			
			return; //함수 종료.
		};
		
		if( document.getElementById("In_NameEn").value == '' ){
			alert('영문 이름은 꼭 입력 해야 합니다!');
			document.getElementById("In_NameEn").focus();
			
			return; //함수 종료.
		}
		
		$('#Bt_contactUpdate').removeClass('btn-success').removeClass('btn-contactUpdateFinish').addClass('btn-info').addClass('btn-contactUpdate');
		$("#Bt_contactUpdate").html("수 정  하 기");
		$("input.contactInput").css("background-color","#1B598A").css("color","#FFF");
		$("input.contactInput").attr("readonly",true);
		$("select.contactInputSel").attr("disabled",true);
		$("#In_imgFile").hide();
		$("i.icon-contactDel-click").show();
		this.contactNameKo = document.getElementById("In_NameKo").value;
		
		var data = '"nameen" : "'+document.getElementById("In_NameEn").value + 
				'",	"hiredate" : "' +document.getElementById("In_HiredDate").value +
				'",	"sex" : "'+ document.getElementById("In_Sex").selectedIndex +
				'",	"phone" : "'+ document.getElementById("In_Phone").value +
				'",	"email" : "'+ document.getElementById("In_Email").value +
				'",	"no" : "'+ document.getElementById("In_No").value +
				'",	"birthdate" : "'+ document.getElementById("In_BirthDate").value +
				'",	"dept" : "'+ document.getElementById("In_Dept").value +
				'",	"nameko" : "'+ document.getElementById("In_NameKo").value +
				'",	"title" : "'+ document.getElementById("In_Title").value +
				'",	"photo" : "'+ this.photoTemp +
				'"';
		
		this.callDBType = "U";
		this.callDB('{"act" : "U", '+ data +'}',"ADFlowContact");
		console.error("contactUpdateFinishClick  ::" + data);
	},
	
	contactAddClick : function() {
		$("#In_NameKo").val('');
		$("#In_NameEn").val('');
		$("#In_Phone").val('');
		$("#In_Email").val('');
		$("#In_Dept").val('');
		$("#In_Sex").val('');
		$("#In_No").val('');
		$("#In_Title").val('');
		$("#In_HiredDate").val('');
		$("#In_BirthDate").val('');
		$("#In_Photo").html('<img class="contactInput" alt="" src="" />');
		this.photoTemp =  '';
		$('#Bt_contactUpdate').removeClass('btn-info').removeClass('btn-contactAdd').addClass('btn-success').addClass('btn-contactAddFinish');
		$("#Bt_contactUpdate").html("추 가 완 료");
		$("input.contactInput").css("background-color","#FFF").css("color","#000");
		$("input.contactInput").attr("readonly",false);
		$("select.contactInputSel").attr("disabled",false);
		$("#In_imgFile").show();
		this.contactNameKo = '';
		
		console.error("contactAddClick ");
	},
	
	contactAddFinishClick : function() {
		
		var inNo = parseInt(document.getElementById("In_No").value);
		
//		if( isNaN(inNo) ||inNo > 99999 || inNo < 0 ){
//			alert('사번은 숫자 5자리 이하로 입력 하세요!');
//			document.getElementById("In_No").focus();
//			
//			return; //함수 종료.
//		};
		
//	console.log("In_NameKo ::"+ document.getElementById("In_NameKo").value + " len ::" + document.getElementById("In_NameKo").value.length);
		
		if( document.getElementById("In_NameKo").value == '' ){
			alert('이름은 꼭 입력 해야 합니다!');
			document.getElementById("In_NameKo").focus();
			
			return; //함수 종료.
		};
		
		if( document.getElementById("In_NameEn").value == '' ){
			alert('영문 이름은 꼭 입력 해야 합니다!');
			document.getElementById("In_NameEn").focus();
			
			return; //함수 종료.
		}
		
		this.contactNameKo = document.getElementById("In_NameKo").value;
		$('#Bt_contactUpdate').removeClass('btn-success').removeClass('btn-contactAddFinish').addClass('btn-info').addClass('btn-contactAdd');
		$("#Bt_contactUpdate").html("추 가  하 기");
		$("input.contactInput").css("background-color","#1B598A").css("color","#FFF");
		$("input.contactInput").attr("readonly",true);
		$("select.contactInputSel").attr("disabled",true);
		$("#In_imgFile").hide();
		
		var data = '"nameen" : "'+document.getElementById("In_NameEn").value + 
				'",	"hiredate" : "' +document.getElementById("In_HiredDate").value +
				'",	"sex" : "'+ document.getElementById("In_Sex").selectedIndex +
				'",	"phone" : "'+ document.getElementById("In_Phone").value +
				'",	"email" : "'+ document.getElementById("In_Email").value +
				'",	"no" : "'+ document.getElementById("In_No").value +
				'",	"birthdate" : "'+ document.getElementById("In_BirthDate").value +
				'",	"dept" : "'+ document.getElementById("In_Dept").value +
				'",	"nameko" : "'+ document.getElementById("In_NameKo").value +
				'",	"title" : "'+ document.getElementById("In_Title").value +
				'",	"photo" : "'+ this.photoTemp +
				'"';
		this.callDBType = "C";
		this.callDB('{"act" : "C", '+ data +'}',"ADFlowContact");
		console.error("contactAddFinishClick   ::" + data);
	},
	
	contactDelFinishClick : function() {
		
		var r=confirm("정말 삭제 하시겠습니까?");
		if (r==true)
		  {
			this.contactNameKo = document.getElementById("In_NameKo").value;
			$('#Bt_contactUpdate').removeClass('btn-success').removeClass('btn-contactAddFinish').addClass('btn-info').addClass('btn-contactAdd');
			$("#Bt_contactUpdate").html("추 가  하 기");
			$("input.contactInput").css("background-color","#1B598A").css("color","#FFF");
			$("input.contactInput").attr("readonly",true);
			
			var data = '"no" : "'+ document.getElementById("In_No").value +	'"';
			
			this.callDBType = "D";
//			this.callDB('{"act" : "D", '+ data +'}',"ADFlowContact");
			
			console.error("contactDelFinishClick OK  ::");
			console.error("contactDelFinishClick  ::" + data);
		  }
		else
		  {
			console.error("contactDelFinishClick Cancel ::");
		  }
		
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
		$("#In_Title").val(this.contact.get('title'));
		$("#In_HiredDate").val(this.contact.get('hiredDate'));
		$("#In_BirthDate").val(this.contact.get('birthDate'));
		$("#In_Photo").html('<img width=100 height=100 class="contactInput" alt="" src="'
			+ this.contact.get('photo')
			+ '" />');
		$("#In_imgFile").hide();
		this.photoTemp =  this.contact.get('photo');
		console.error("contactDisplay   contactDisplay   contactDisplay");
		
	},
	
	readURL : function(inUrl){
		var that = this;
		if (inUrl.files && inUrl.files[0]) {
			
			console.log("readURL  photoTemp  ::" + that.photoTemp);
			
            var reader = new FileReader(); //파일을 읽기 위한 FileReader객체 생성
            reader.onload = function (e) { 
            //파일 읽어들이기를 성공했을때 호출되는 이벤트 핸들러
            	
            	console.log("e.target.result  ::" + e.target.result);
            	that.photoTemp = e.target.result;
            	console.log("readURL  photoTemp22  ::" + that.photoTemp);
            	$("#In_Photo").html('<img width=100 height=100 class="contactInput" alt="" src="'
            			+ e.target.result
            			+ '" />');
                //이미지 Tag의 SRC속성에 읽어들인 File내용을 지정
                //(아래 코드에서 읽어들인 dataURL형식)
            };                    
            reader.readAsDataURL(inUrl.files[0]);
            //File내용을 읽어 dataURL형식의 문자열로 저장
        }

	},
	
	callDB : function(param, orchestrationName) {
		window.busy.show();
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
	
	contactDetailBackClick : function() {

		if (!ADF.view.contactList) {
			ADF.view.contactList = new ADF.view.ContactList;
		}
		navigation.pushView(ADF.view.contactList, 'typeB');
	},
	
	callDBSuccess : function(result) {
		window.busy.hide();
		var that = this;

		console.error("Retrieve Success");
		console.error(result);
		var errorOk = result.invocationResult.error;

		console.log(errorOk);
		
		if(errorOk){
//			alert('Error :' + JSON.stringify(errorOk));
			WL.SimpleDialog.show("오류", JSON.stringify(errorOk));
			
		} else {
			
			var msg;
			switch (this.callDBType) {
			case 'C':
				msg = this.contactNameKo + '님의 \n 추가 완료 되었습니다.';
				break;
			case 'U':
				msg = this.contactNameKo + '님의 \n 수정이 완료 되었습니다.';
				break;
			case 'D':
				msg = this.contactNameKo + '님의 \n 삭제가 완료 되었습니다.';
				break;
			

			default:
				msg = '';
				break;
			}
			
//			alert(msg);
		}
		
		WL.SimpleDialog.show("성공", msg);
		
		
	},
	
	callDBFailure : function(result) {

		console.error("Retrieve failure");
		window.busy.hide();
		WL.SimpleDialog.show("장애", result.errorMsg, [ {
			text : "확인",
			handler : function() {
				// clean garbage
				console.log('panelContentSecond::'
						+ $('.page')[1].remove());
				WL.Logger.debug("error button pressed");
			}
		} ]);
	},
	
	addFlagOn : function(addFlag) {

		console.error("addFlag ::"+ addFlag);
		this.addFlag = addFlag;
	},
	
	load_url : function(url) {
		var req = new XMLHttpRequest();
		req.open('GET', url, false);
		req.overrideMimeType('text/plain; charset=x-user-defined');
		req.send(null);
		if(req.status !=200) return '';
	    
		var filestream = req.responseText;
		var bytes = [];
		for(var i=0; i < filestream.length; i++){
			bytes[i] = filestream.charCodeAt(i) & 0xff;
		}
		
		var imgSrc = 'data:image/jpeg;base64,'+ base64.encode(String.fromCharCode.apply(String, bytes));
	}

});