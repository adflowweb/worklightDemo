ADF.view.Detail = Backbone.View
		.extend({
			el : $('.panel-content'), // attaches `this.el` to an existing
			// element.

			initialize : function() {
				// _.bindAll(this, 'render'); // fixes loss of context for
				// 'this' within
				// methods
				// this.render(); // not all views are self-rendering. This
				// one is.
			},
			render : function() {
				// load dashBoard view
				navigation.load('views/detail.html', function() {
					$('.detailBtn').on('click', function() {

						window.beforeload = new Date().getTime();
						window.busy.show();

						if (!ADF.view.iscroll) {
							ADF.view.iscroll = new ADF.view.Iscroll;
						}
						navigation.pushView(ADF.view.iscroll, 'typeA');
					});
					ADF.view.detail.elapsedTime();
				});
				WL.App.overrideBackButton(backFunc);
				function backFunc() {

					window.beforeload = new Date().getTime();

					if (!ADF.view.dashBoard) {
						ADF.view.dashBoard = new ADF.view.DashBoard;
					}
					navigation.pushView(ADF.view.dashBoard, 'typeB');
				}
			},
			elapsedTime : function() {
				console.log('elapsedTime called')
				var aftrload = new Date().getTime();
				// Time calculating in seconds
				var time = (aftrload - window.beforeload) / 1000;
				document.getElementById("detailElapsedTime").innerHTML = "Your Page took <font color='red'><b>"
						+ time + "</b></font> Seconds to Load";
				window.beforeload = 0;
			}
		});