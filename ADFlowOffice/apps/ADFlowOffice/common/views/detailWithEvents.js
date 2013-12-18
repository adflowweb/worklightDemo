var loginView;
window.DetailView = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing element.

	events : {
		"click .detailBtn" : "loadLoginView"
	},

	initialize : function() {
		_.bindAll(this, 'render'); // fixes loss of context for
		// 'this' within methods
		// this.render(); // not all views are self-rendering. This
		// one is.
	},
	render : function() {
		// load dash_board page
		$(".panel-content").load("views/detail.html", function() {
			console.log('detail page is loaded');

			// attach click event
			// $('.detailBtn').on('click', function() {
			// if (loginView) {
			// loginView.render();
			// } else {
			// loginView = new LoginView;
			// loginView.render();
			// }
			// });
			// document.body.focus();
		});

		/*
		 * $(".panels").load("views/detailMenu.html", function() {
		 * console.log('detail page menu is loaded'); });
		 */
	},

	loadLoginView : function() {
		if (loginView) {
			loginView.render();
		} else {
			loginView = new LoginView;
			loginView.render();
		}
	}
});