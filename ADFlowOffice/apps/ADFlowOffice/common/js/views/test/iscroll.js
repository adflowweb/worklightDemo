ADF.view.Iscroll = Backbone.View
		.extend({
			constant1 : '" style="overflow: hidden;border-color:grey;border-style:solid none none none;border-width:1px;height:81px;background-color:white;"><div style="color:grey;float:left"><img width=80 height=80 src="images/',
			constant2 : '</p></div><div style="position:absolute;right:10px;color:grey;float:right;margin-top:16px;font-size: 44px;"><i class="icon-circle-arrow-right" /></div></li>',
			el : $('.panel-content'), // attaches `this.el` to an existing
			// element.

			initialize : function() {
				_.bindAll(this, 'render', 'success', 'fail'); // fixes loss of
				// context
				// for 'this'
				// within
				// methods

				// this.render(); // not all views are self-rendering. This
				// one is.
			},
			males : [ 'eugene_lee', 'gary_donovan', 'james_king',
					'john_williams', 'paul_jones', 'ray_moore', 'steven_wells' ],

			females : [ 'amy_jones', 'julie_taylor', 'kathleen_byrne',
					'lisa_wong', 'paula_gates' ],
			getContactList : function() {
				// get contact list
				var invocationData = {
					adapter : 'CastIronAdapter', // adapter
					// name
					procedure : 'startOrchestration_post',
					parameters : [ '{"act" : "R"}', "ADFlowContact" ]
				// parameters if any
				};
				console.log("call invokeProcedure");

				window.startProc = new Date().getTime();
				WL.Client.invokeProcedure(invocationData, {
					onSuccess : this.success,
					onFailure : this.fail
				});
			},
			success : function(result) {
				var that = this;
				this.procElapsedTime();
				console.log("response::" + JSON.stringify(result));
				console.log("isSuccessful::"
						+ result.invocationResult.isSuccessful);
				if (result.invocationResult.isSuccessful) {
					var items = result.invocationResult.Result;
					var str = '';
					for (var i = 0; i < items.length; i++) {

						var imageName;
						if (items[i].sex == '0') {
							imageName = this.males[Math
									.floor(Math.random() * 7)];
						} else {
							imageName = this.females[Math
									.floor(Math.random() * 5)];
						}

						// var name = items[i].nameko;
						// console.log('nameLength::' + items[i].nameko.length);
						// console.log('name1::' + name.charAt(1));
						// if (name.length == 2) {
						// name = name.charAt(0) + '&nbsp;&nbsp;&nbsp;'
						// + name.charAt(1);
						// }

						str += '<li id="'
								+ i
								+ this.constant1
								+ imageName
								+ '.jpg"></div>'
								+ '<div style="color:grey;float:left"><h3 style="padding-left:10px;">'
								+ items[i].nameko
								+ '<font style="font-size:15px">&nbsp;&nbsp;'
								+ items[i].title + '</font>'
								+ '</h3><p style="padding-left:12px;">'
								+ items[i].dept + this.constant2;

					}
					$('#thelist').append(str);
				}

				// $('.back').on('click', function() {
				// if (!window.detailView) {
				// window.detailView = new
				// window.DetailView;
				// }
				// navigation.pushView(window.detailView,
				// 'typeA');
				// });
				navigation.loadAsync(function() {
					var myScroll = new iScroll('wrapper', {
						hScrollbar : false,
						vScrollbar : false
					});

					console.log('this is test' + $('#back'));
					$('#back').on('click', function() {
						if (!ADF.view.dashBoard) {
							ADF.view.dashBoard = new ADF.view.DashBoard;
						}
						navigation.pushView(ADF.view.dashBoard, 'typeB');
					});

					$('#thelist').on({
						click : function() {
							// alert($(this).text());
							console.log($(this));
							console.log($(this).attr("id"));
						}
					}, 'li');
					that.viewElapsedTime();
					window.busy.hide();
				});

			},
			fail : function(result) {
				this.procElapsedTime();
				console.log(JSON.stringify(result));
				window.busy.hide();
				WL.SimpleDialog.show("에러메시지", result.errorMsg, [ {
					text : "확인",
					handler : function() {
						WL.App.overrideBackButton(function() {
							window.beforeload = new Date().getTime();
							if (!ADF.view.login) {
								ADF.view.login = new ADF.view.Login;
							}
							navigation.pushView(ADF.view.login, 'typeB');
						});
						WL.Logger.debug("error button pressed");
					}
				} ]);
			},
			render : function() {
				var that = this;
				// load dashBoard view
				navigation.loadBefore('views/test/iscroll.html', function() {
					that.getContactList();
				});
				WL.App.overrideBackButton(this.backFunc);
			},
			viewElapsedTime : function() {
				// Time calculating in seconds
				var time = (new Date().getTime() - window.beforeload) / 1000;
				console.log('viewElapsedTime::' + time);
				var gap = time - window.procTime;
				document.getElementById("iScrollElapsedTime").innerHTML = document
						.getElementById("iScrollElapsedTime").innerHTML
						+ " page : <font color='red'><b>"
						+ time
						+ "</b></font> ms gap : <font color='red'><b>"
						+ gap.toFixed(3) + "</b></font> ms";
				window.beforeload = 0;
			},
			procElapsedTime : function() {
				// Time calculating in seconds
				window.procTime = (new Date().getTime() - window.startProc) / 1000;
				console.log('procedureElapsedTime::' + window.procTime);
				document.getElementById("iScrollElapsedTime").innerHTML = "procedure : <font color='red'><b>"
						+ window.procTime + "</b></font> ms";
				window.startProc = 0;
			},
			backFunc : function() {
				window.beforeload = new Date().getTime();

				if (!ADF.view.deshBoard) {
					ADF.view.deshBoard = new ADF.view.DashBoard;
				}
				navigation.pushView(ADF.view.deshBoard, 'typeB');
			}
		});