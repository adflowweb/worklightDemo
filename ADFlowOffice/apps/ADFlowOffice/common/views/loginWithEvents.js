var dashBoardView;
window.LoginView = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing element.

	events : {
		"click #loginBtn" : "loadDashBoardView"
	},

	initialize : function() {
		_.bindAll(this, 'render'); // fixes loss of context for
		// 'this' within methods
	},
	render : function() {
		// load dash_board page
		$(".panel-content").load("views/login.html", function() {
			console.log('login page is loaded');

			// attach click event
			// $('#loginBtn').on('click', function() {
			// if (dashBoardView) {
			// dashBoardView.render();
			// } else {
			// dashBoardView = new window.DashBoardView;
			// dashBoardView.render();
			// }
			// });

			/*
			 * $('#loginBtn').on('click', function() { if (dashBoardView) {
			 * dashBoardView.render(); } else { dashBoardView = new
			 * window.DashBoardView; dashBoardView.render(); } });
			 */
			// document.body.focus();
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