ADF.view.Login = Backbone.View
		.extend({
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
						window.beforeload = new Date().getTime();
						window.busy.show();

						// loadDummy();
						console.log("callDBTest ::");
						var invocationData = {
							adapter : 'CastIronAdapter', // adapter
							// name
							procedure : 'getDummy',
							parameters : []
						// parameters if any
						};
						console.log("call login adapter");
						WL.Client.invokeProcedure(invocationData, {
							onSuccess : function() {
								console.log("login success==============");
							},
							onFailure : function() {
								console.log("login fail==============");
							}
						});

						if (!ADF.view.dashBoard) {
							ADF.view.dashBoard = new ADF.view.DashBoard;
						}
						navigation.pushView(ADF.view.dashBoard, 'typeA');
					});

					ADF.view.login.elapsedTime();

				});
				WL.App.overrideBackButton(backFunc);
				function backFunc() {
				}
			},
			elapsedTime : function() {
				var aftrload = new Date().getTime();
				// Time calculating in seconds
				var time = (aftrload - window.beforeload) / 1000;
				document.getElementById("loginElapsedTime").innerHTML = "Your Page took <font color='red'><b>"
						+ time + "</b></font> Seconds to Load";
				window.beforeload = 0;
			}
		});