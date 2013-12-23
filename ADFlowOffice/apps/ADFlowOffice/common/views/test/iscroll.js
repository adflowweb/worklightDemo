var lists = [ 'amy_jones', 'eugene_lee', 'gary_donovan', 'james_king',
		'john_williams', 'julie_taylor', 'kathleen_byrne', 'lisa_wong',
		'paul_jones', 'paula_gates', 'ray_moore', 'steven_wells' ];

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
			render : function() {
				// load dashBoard view
				navigation
						.load(
								'views/test/iscroll.html',
								function() {

									var str = '';
									for (i = 0; i < 100; i++) {
										str += '<li id="'
												+ i
												+ '" style="border-color:black;border-style:solid none none none;border-width:1px;height:81px;background-color:white;"><div style="color:black;"><img width=80 height=80 src="images/'
												+ lists[Math.floor(Math
														.random() * 10)]
												+ '.jpg">'
												+ '<span style="align:top;">phone : +1040269329</span>'
												+ '</div></li>';
									}
									$('#thelist').append(str);
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

									// $('.back').on('click', function() {
									// if (!window.detailView) {
									// window.detailView = new
									// window.DetailView;
									// }
									// navigation.pushView(window.detailView,
									// 'typeA');
									// });
								});
			}
		});