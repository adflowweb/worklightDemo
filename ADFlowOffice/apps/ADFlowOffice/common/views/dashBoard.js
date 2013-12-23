ADF.view.DashBoard = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing element.

	initialize : function() {
		_.bindAll(this, 'render'); // fixes loss of context for 'this' within
		// methods

		// this.render(); // not all views are self-rendering. This
		// one is.
	},
	render : function() {
		// load dashBoard view
		navigation.load('views/dashBoard.html', function() {
			$('.back').on('click', function() {
				if (!ADF.view.detail) {
					ADF.view.detail = new ADF.view.Detail;
				}
				navigation.pushView(ADF.view.detail, 'typeA');
			});
			$('.loadscheduler').on(
					'click',
					function() {
						console.log("loadscheduler loadschedulerloadscheduler "
								+ this);
						if (!ADF.view.scheduler) {
							ADF.view.scheduler = new ADF.view.Scheduler;
						}
						navigation.pushView(ADF.view.scheduler, 'typeA');
					});
			$('.contantsList').on('click', function() {
				
				if (!ADF.view.contantList) {
					console.log("contantList contantList ");
					ADF.view.contantList = new ADF.view.ContantList;
//					ADF.view.contantList = new ADF.view.Scheduler;
				}
				navigation.pushView(ADF.view.contantList, 'typeA');
			});
		});
		WL.App.overrideBackButton(backFunc);
		function backFunc() {
			if (!ADF.view.login) {
				ADF.view.login = new ADF.view.Login;
			}
			navigation.pushView(ADF.view.login, 'typeB');
		}
	}
});