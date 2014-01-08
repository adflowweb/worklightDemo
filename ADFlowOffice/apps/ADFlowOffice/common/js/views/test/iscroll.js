var males = [ 'eugene_lee', 'gary_donovan', 'james_king', 'john_williams',
		'paul_jones', 'ray_moore', 'steven_wells' ];

var females = [ 'amy_jones', 'julie_taylor', 'kathleen_byrne', 'lisa_wong',
		'paula_gates' ];

var names = [ '고신규', '권근필', '김은주', '조광일', '박택영', '최순옥', '이찬호', '박수정', '김병상',
		'오형은', '양석모', '박눌' ];

var titles = [ '대표', '차장', '과장', '사원', '대리', '부장', '상무', '전무', '이사' ];

ADF.view.Iscroll = Backbone.View
		.extend({
			el : $('.panel-content'), // attaches `this.el` to an existing
			// element.

			initialize : function() {
				_.bindAll(this, 'render'); // fixes loss of context for 'this'
				// within
				// methods

				// this.render(); // not all views are self-rendering. This
				// one is.
			},
			getContactList : function() {
				// get contact list
				var invocationData = {
					adapter : 'CastIronAdapter', // adapter
					// name
					procedure : 'startOrchestration_post',
					parameters : [ '{"act" : "R"}', "ADFlowContact" ]
				// parameters if any
				};
				console.log("..............try. to...something like that");
				WL.Client.invokeProcedure(invocationData, {
					onSuccess : this.success,
					onFailure : this.fail
				});
			},
			success : function(result) {
				console.log("Retrieve success" + JSON.stringify(result));

				if (result.invocationResult.isSuccessful) {

					var items = result.invocationResult.Result;
					console.log("===============   items[0].no =============="
							+ items[0].no);

					var str = '';
					for (var i = 0; i < items.length; i++) {

						var imageName;
						if (items[i].sex == 'M') {
							imageName = males[Math.floor(Math.random() * 7)];
						} else {
							imageName = females[Math.floor(Math.random() * 5)];
						}

						str += '<li id="'
								+ i
								+ '" style="overflow: hidden;border-color:grey;border-style:solid none none none;border-width:1px;height:81px;background-color:white;"><div style="color:grey;float:left"><img width=80 height=80 src="images/'
								+ imageName
								+ '.jpg"></div>'
								+ '<div style="color:grey;float:left"><h3 style="padding-left:10px;font-family:NanumGothicBold;">'
								+ items[i].nameko
								+ '<font style="font-size:15px">&nbsp;&nbsp;'
								+ items[i].title
								+ '</font>'
								+ '</h3><p style="padding-left:12px;font-family:NanumGothicBold;">'
								+ items[i].dept
								+ '</p></div><div style="position:absolute;right:10px;color:grey;float:right;margin-top:16px;font-size: 44px;"><i class="icon-circle-arrow-right" /></div></li>';

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
						vScrollbar : true
					});

					$('#thelist').on({

						click : function() {
							// alert($(this).text());
							console.log($(this));
							console.log($(this).attr("id"));

						}

					}, 'li');
					ADF.view.iscroll.elapsedTime();
					window.busy.hide();
				});

			},
			fail : function(result) {
				console.log(JSON.stringify(result));
				window.busy.hide();
				WL.SimpleDialog.show("My Title", "My Text", [ {
					text : "확인",
					handler : function() {
						WL.Logger.debug("First button pressed");
					}
				} ])
			},
			render : function() {
				// load dashBoard view
				navigation.loadBefore('views/test/iscroll.html', function() {
					ADF.view.iscroll.getContactList();
				});
				WL.App.overrideBackButton(backFunc);
				function backFunc() {

					window.beforeload = new Date().getTime();

					if (!ADF.view.deshBoard) {
						ADF.view.deshBoard = new ADF.view.DashBoard;
					}
					navigation.pushView(ADF.view.deshBoard, 'typeB');
				}
			},
			elapsedTime : function() {
				console.log('elapsedTime called')
				var aftrload = new Date().getTime();
				// Time calculating in seconds
				var time = (aftrload - window.beforeload) / 1000;
				document.getElementById("iScrollElapsedTime").innerHTML = "Your Page took <font color='red'><b>"
						+ time + "</b></font> Seconds to Load";
				window.beforeload = 0;
			}
		});