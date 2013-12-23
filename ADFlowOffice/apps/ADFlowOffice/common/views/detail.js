ADF.view.Detail = Backbone.View.extend({
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
				if (!ADF.view.iscroll) {
					ADF.view.iscroll = new ADF.view.Iscroll;
				}
				navigation.pushView(ADF.view.iscroll, 'typeA');
			});
		});
		WL.App.overrideBackButton(backFunc);
		function backFunc() {
			if (!ADF.view.dashBoard) {
				ADF.view.dashBoard = new ADF.view.DashBoard;
			}
			navigation.pushView(ADF.view.dashBoard, 'typeB');
		}
	}
});