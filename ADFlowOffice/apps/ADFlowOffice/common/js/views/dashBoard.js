ADF.view.DashBoard = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing
	// element.

	initialize : function() {
		_.bindAll(this, 'render'); // fixes loss of context for 'this'
		// within
		// methods

		// this.render(); // not all views are self-rendering. This
		// one is.
	},
	render : function() {
		var that = this;
		// load dashBoard view
		navigation.loadBefore('views/dashBoard.html', function() {
			$('.test').on('click', function() {

				// testCode
				window.last_click_time = new Date().getTime();
				// testCodeEnd
				window.beforeload = new Date().getTime();
				window.busy.show();
				/*
				 * if (!ADF.view.detail) { ADF.view.detail = new
				 * ADF.view.Detail; } navigation.pushView(ADF.view.detail,
				 * 'typeA');
				 */
				if (!ADF.view.iscroll) {
					ADF.view.iscroll = new ADF.view.Iscroll;
				}
				navigation.pushView(ADF.view.iscroll, 'typeA');
			});
			$('.loadscheduler').on('click', function() {
				
				window.last_click_time = new Date().getTime();
				window.beforeload = new Date().getTime();
				window.busy.show();
				
				if (!ADF.view.scheduler) {
					ADF.view.scheduler = new ADF.view.Scheduler;
				}
				navigation.pushView(ADF.view.scheduler, 'typeA');

			});
			$('.contantsList').on('click', function() {

				window.last_click_time = new Date().getTime();
				window.busy.show();
				if (!ADF.view.contantList) {
					console.log("contantList contantList ");
					ADF.view.contactList = new ADF.view.ContactList;

					// ADF.view.contantList = new ADF.view.Scheduler;
				}
				navigation.pushView(ADF.view.contactList, 'typeA');
			});

			navigation.loadAsync(function() {
				that.elapsedTime();
				window.busy.hide();
				new iScroll('menuList', {
					hScrollbar : false,
					vScrollbar : false
				});
			});
		});
		WL.App.overrideBackButton(backFunc);
		function backFunc() {

			WL.SimpleDialog.show("알림", "앱을 종료하시려면 종료버튼을 눌러주세요", [ {
				text : "종료",
				handler : function() {
					WL.App.close();
				}
			}, {
				text : "취소",
				handler : function() {
					WL.Logger.debug("cancel button pressed");
				}
			} ]);

			// window.beforeload = new Date().getTime();
			//
			// if (!ADF.view.login) {
			// ADF.view.login = new ADF.view.Login;
			// }
			// navigation.pushView(ADF.view.login, 'typeB');
		}
	},
	elapsedTime : function() {
		console.log('elapsedTime called')
		var aftrload = new Date().getTime();
		// Time calculating in seconds
		var time = (aftrload - window.beforeload) / 1000;
		// document.getElementById("dashBoardElapsedTime").innerHTML = "Your
		// Page took <font color='red'><b>"
		// + time + "</b></font> Seconds to Load";
		window.beforeload = 0;
	}
});