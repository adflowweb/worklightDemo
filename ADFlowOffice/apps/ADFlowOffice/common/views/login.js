ADF.view.Login = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing
	// element.

	initialize : function() {
		_.bindAll(this, 'render'); // fixes loss of context for 'this'
		// within
		// methods
	},
	render : function() {
		// load dashBoard view
		navigation.load('views/login.html', function() {
			$('#loginBtn').on('click', function() {
				// console.log('this::' + this);
				// console.log('WL::' + WL);

				if (!ADF.view.dashBoard) {
					ADF.view.dashBoard = new ADF.view.DashBoard;
				}
				navigation.pushView(ADF.view.dashBoard, 'typeA');
			});
		});
		WL.App.overrideBackButton(backFunc);
		function backFunc() {
		}
	}
});