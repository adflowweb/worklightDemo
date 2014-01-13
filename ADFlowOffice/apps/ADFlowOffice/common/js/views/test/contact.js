ADF.view.Contact = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing
	// element.

	initialize : function() {
		_.bindAll(this, 'render'); // fixes loss of context for
		// 'this' within
		// methods
		// this.render(); // not all views are self-rendering. This
		// one is.
	},
	render : function() {
		var that = this;
		navigation.loadBefore('views/test/contact.html', function() {
			// that.getContactList();
			console.log('contact.html loaded');
			navigation.loadAsync(function() {
				that.elapsedTime();
				window.busy.hide();
				console.log('loadAsync called');
				console.log('test::' + $('#backContactList'));
				$('#backContactList').on('click', function() {
					window.busy.show();
					window.beforeload = new Date().getTime();

					if (!ADF.view.iscroll) {
						ADF.view.iscroll = new ADF.view.Iscroll;
					}
					navigation.pushView(ADF.view.iscroll, 'typeB');
				});

				WL.App.overrideBackButton(that.backFunc);
			});
		});

	},
	elapsedTime : function() {
		console.log('elapsedTime called');
		var aftrload = new Date().getTime();
		// Time calculating in seconds
		var time = (aftrload - window.beforeload) / 1000;
		// document.getElementById("detailElapsedTime").innerHTML = "Your Page
		// took <font color='red'><b>"
		// + time + "</b></font> Seconds to Load";
		window.beforeload = 0;
	},
	backFunc : function() {
		window.busy.show();
		window.beforeload = new Date().getTime();
		if (!ADF.view.iscroll) {
			ADF.view.iscroll = new ADF.view.Iscroll;
		}
		navigation.pushView(ADF.view.iscroll, 'typeB');
	}
});