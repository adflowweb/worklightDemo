var detailView;

window.DashBoardView = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing element.

	events : {
		"click .dashBtn" : "loadDetailView",
	},

	initialize : function() {
		_.bindAll(this, 'render'); // fixes loss of context for
		// 'this' within methods
		// this.render(); // not all views are self-rendering. This
		// one is.
	},
	render : function() {
		// load dashBoard
		$(".panel-content").load("views/dashBoard.html", function() {
			console.log('dashBoard page is loaded');
			// PageTransitions();
			// setTimeout(test,50);
			// test();

			// attach click event
			// $('.dashBtn').on('click', function() {
			// if (detailView) {
			// detailView.render();
			// } else {
			// detailView = new window.DetailView;
			// detailView.render();
			// }
			//
			// });
			// document.body.focus();
		});
		// this.el.html(ich.bbViewUserDetail(this.model.toJSON()));
		// this.el.show();
	},

	loadDetailView : function() {

		if (detailView) {
			detailView.render();
		} else {
			detailView = new window.DetailView;
			detailView.render();
		}
	}
});