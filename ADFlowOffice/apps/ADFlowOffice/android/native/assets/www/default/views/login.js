
/* JavaScript content from views/login.js in folder common */
window.LoginView = Backbone.View.extend({
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

				if (!window.dashBoardView) {
					window.dashBoardView = new window.DashBoardView;
				}
				navigation.pushView(window.dashBoardView, 'typeA');
			});
		});
	},

	loadDashBoardView : function() {
		if (dashBoardView) {
			dashBoardView.render();
		} else {
			dashBoardView = new window.DashBoardView;
			dashBoardView.render();
		}
	}
});