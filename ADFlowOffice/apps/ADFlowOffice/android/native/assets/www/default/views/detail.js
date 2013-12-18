
/* JavaScript content from views/detail.js in folder common */
window.DetailView = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing element.

	initialize : function() {
		// _.bindAll(this, 'render'); // fixes loss of context for 'this' within
		// methods
		// this.render(); // not all views are self-rendering. This
		// one is.
	},
	render : function() {
		// load dashBoard view
		navigation.load('views/detail.html', function() {
			$('.detailBtn').on('click', function() {
				if (!window.iscrollView) {
					window.iscrollView = new window.IscrollView;
				}
				navigation.pushView(window.iscrollView, 'typeA');
			});
		});
	},
	loadLoginView : function() {

		if (window.loginView) {
			loginView.render();
		} else {
			window.loginView = new LoginView;
			loginView.render();
		}

	}
});