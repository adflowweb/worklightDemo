ADF.view.ContactDetail = Backbone.View.extend({
			el : $('.panel-content'), // attaches `this.el` to an existing
										// element.

			initialize : function() {
				 _.bindAll(this, 'render'); // fixes loss of context for
				// 'this' within
				// methods
				// this.render(); // not all views are self-rendering. This
				// one is.
			},
			
			events : {
//				'click button#searchBtn' : 'searchBtn',
//				'click li' : 'liClick',
			},
			
			render : function() {
				// load dashBoard view
				var that = this;
				navigation.load('views/contactDetail.html', function() {
//					// iscorell 초기화
//					that.iscrollInit();
//
//					// 서버 주소록 변경 상황 체크
//
//					// JSONStore 에서 model read
//					that.ContactModelLoadClick();
//
//					// model 에서 address read
//					that.loadList();
				});
			},

		
			
		});