ADF.view.Scheduler = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing element.

	initialize : function() {
		_.bindAll(this, 'render'); // fixes loss of context for 'this' within
		// methods

		// this.render(); // not all views are self-rendering. This
		// one is.
	},
	render : function() {
		// load SchedulerView view
		console.log("SchedulerView " + this);
		navigation.load('views/schedulerBoard.html', function() {
			// loadscheduler
			$('.back').on('click', function() {
				if (!ADF.view.scheduler) {
					ADF.view.scheduler = new ADF.view.Scheduler;
				}
				navigation.pushView(ADF.view.scheduler, 'typeA');
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