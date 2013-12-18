
/* JavaScript content from views/dashBoard.js in folder common */
window.DashBoardView = Backbone.View.extend({
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
				if (!window.detailView) {
					window.detailView = new window.DetailView;
				}
				navigation.pushView(window.detailView, 'typeA');
			});
		});
	},

	loadDetailView : function() {
		console.log('loadDetailView');
		if (detailView) {
			detailView.render();
		} else {
			detailView = new window.DetailView;
			detailView.render();
		}
	}
});