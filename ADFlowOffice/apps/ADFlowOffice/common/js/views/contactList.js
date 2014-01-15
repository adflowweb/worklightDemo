//JSONStore start

//JSONStore end

ADF.model.ContactItem = Backbone.Model.extend({
	defaults : {
		nameEn : '',
		hiredDate : '',
		sex : '',
		phone : '',
		email : '',
		no : '',
		birthDate : '',
		dept : '',
		nameKo : '',
		title : '',
		photo : ''
	}

});

ADF.collection.ContactList = Backbone.Collection.extend({
	model : ADF.model.ContactItem
});

ADF.view.ContactList = Backbone.View
		.extend({
			el : $('.panel-content'),

			constant1 : '<li style="overflow: hidden;border-color:grey;border-style:solid none none none;border-width:1px;height:81px;background-color:white;"><div style="color:grey;float:left"><img class="contactImgClick" width=80 height=80 id="',
			constant2 : '</p></div><div style="position:absolute;right:10px;color:grey;float:right;margin-top:16px;font-size: 44px;"><i class="icon-circle-arrow-right icon-contactDetail-click" id="',

			initialize : function() {
				_.bindAll(this, 'render', 'loadContactList', 'loadList',
						'loadContactListSuccess', 'removeCollectionJSONStore',
						'initJSONStore2', 'allAddJSONStore'); // fixes

				// this.initJSONStore2();

			},

			render : function() {
				// load dashBoard view
				var that = this;
				navigation.loadBefore('views/contactList.html', function() {

					that.loadContactList('{"act" : "R"}', "ADFlowContact");
					
					// 관리자 및 본일 일때 버튼 표시여부
					// adminID => 관리자 ID
					// loginID => 로그인 id
					//추가버튼 관리자 일때 표시
					if (window.group != 'admin') {
						$('#contactAdd_icon').hide();
					};

				});

				
			},

			loadListDisplay : function() {
				
				console.log("======= loadListDisplay start =========");

				$('ul', this.el).html(this.liSrc);
				// call async
				navigation.loadAsync(function() {
					console.log('call after()');
				});

			},

			loadList : function() {

				console.log("======= loadList start =========");
				var that = this;
				var liSrc = '';
				// console.error(this.collection);
				for (var i = 0; i < this.collection.length; i++) {

					liSrc += this.constant1
							+ this.collection.models[i].get('phone')
							+ '" src="'
							+ this.collection.models[i].get('photo')
							+ '" /></div>'
							+ '<div style="color:grey;float:left"><h3 style="padding-left:10px;">'
							+ this.collection.models[i].get('nameKo')
							+ '<font style="font-size:15px">&nbsp;&nbsp;'
							+ this.collection.models[i].get('title')
							+ '</font>' + '</h3><p style="padding-left:12px;">'
							+ this.collection.models[i].get('dept')
							+ this.constant2 + i + '" /></div></li>';
				}
				;
				$('#listUL', this.el).html(liSrc);
				// myScroll.refresh();

				// call async
				navigation.loadAsync(function() {
					
					window.busy.hide();
					var myScroll = new iScroll('ulDiv', {
						hScrollbar : false,
						vScrollbar : false
					});
					
					WL.App.overrideBackButton(backFunc);
					function backFunc() {
						window.last_click_time = new Date().getTime();
						window.busy.show();
						if (!ADF.view.dashBoard) {
							ADF.view.dashBoard = new ADF.view.DashBoard;
						}
						navigation.pushView(ADF.view.dashBoard, 'typeB');
					}
					
					console.log('call after()');
				});

				$('.icon-contactDetail-click')
						.on(
								{

									click : function(e) {
										window.last_click_time = new Date().getTime();
										window.busy.show();
										if (!ADF.view.contantDetail) {
											console
													.log("contantDetail view Call");
											ADF.view.contantDetail = new ADF.view.ContactDetail;
										}
										ADF.view.contantDetail
												.contactSet(that.collection.models[$(
														e.currentTarget).attr(
														"id")]);
										navigation
												.pushView(
														ADF.view.contantDetail,
														'typeA');

										// that.findAllJSONStore();
										// that.findJSONStore('85100');

									}

								});
				
				$('.icon-contactAdd-click')
				.on(
						{

							click : function(e) {
								window.last_click_time = new Date().getTime();
								if (!ADF.view.contantDetail) {
									console
											.log("contantDetail view Call");
									ADF.view.contantDetail = new ADF.view.ContactDetail;
								}
								ADF.view.contantDetail
										.addFlagOn(true);
								navigation
										.pushView(
												ADF.view.contantDetail,
												'typeA');

								// that.findAllJSONStore();
								// that.findJSONStore('85100');

							}

						});

				$('.contactImgClick').on(
						{

							click : function(e) {
								window.last_click_time = new Date().getTime();
								console.log("phoneClick   phoneClick");
								document.location.href = 'tel:'
										+ $(e.currentTarget).attr("id");

							}

						});
				
				$('#back_contactList').on(
						{
							click : function(e) {
								window.last_click_time = new Date().getTime();
								window.busy.show();
								console.log("back_contactDetail   back_contactDetail");
								if (!ADF.view.dashBoard) {
									ADF.view.dashBoard = new ADF.view.DashBoard;
								}
								navigation.pushView(ADF.view.dashBoard, 'typeB');
							}

						});

				// $('#listUL').on({
				//						
				// click : function(e) {
				// if (!ADF.view.contantDetail) {
				// console.log("contantDetail view Call");
				// ADF.view.contantDetail = new ADF.view.ContactDetail;
				// }
				// ADF.view.contantDetail.contactSet(that.collection.models[$(
				// e.currentTarget).attr("id")]);
				// navigation.pushView(ADF.view.contantDetail, 'typeA');
				//									
				// }
				//									
				// }, 'li');

				console.log("address list End=======");

			},

			iscrollInit : function() {
				myScroll = new iScroll('ulDiv', {
					hScrollbar : false,
					vScrollbar : false
				});

			},

			ContactModelLoadClick : function() {

				this.collection = new ADF.collection.ContactList;

				for (var i = 0; i < 20; i++) {
					this.collection
							.add(new ADF.model.ContactItem(
									{
										nameEn : 'test',
										hiredDate : '',
										sex : '',
										phone : '010010101010',
										email : '',
										no : i,
										birthDate : '',
										dept : '',
										nameKo : '테스트',
										title : '대리',
										photo : 'data:image/jpeg;base64,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%3D%3D'

									}));

				}

				// this.loadContactList("ADFlowContact");

				console.log("Address Model Load End=======");
			},

			loadContactListSuccess : function(result) {

				// console.log("Retrieve success" + JSON.stringify(result));

				if (result.invocationResult.isSuccessful) {

					// displayloadDeliveryList(result.invocationResult.array);
					this.collection = new ADF.collection.ContactList();

					var items = result.invocationResult.Result;
					var data = '';
					console
							.log("===============   this.collection =============="
									+ this.collection);
					console.log("===============   items[0].no =============="
							+ items[0].no);
					for (var i = 0; i < items.length; i++) {
						this.collection.add(new ADF.model.ContactItem({
							nameEn : items[i].nameen,
							hiredDate : items[i].hiredate,
							sex : items[i].sex,
							phone : items[i].phone,
							email : items[i].email,
							no : items[i].no,
							birthDate : items[i].birthdate,
							dept : items[i].dept,
							nameKo : items[i].nameko,
							title : items[i].title,
							photo : items[i].photo
						// photo : 'data:image/jpeg;base64,' + items[i].photo

						}));
					}
					;

					// var len = items.length;
					// this.allAddJSONStore(items, len);

					console
							.log("===============   this.collection.models[j].get('no') =============="
									+ this.collection.models[0].get('no'));

					this.loadList();

				} else {

				}
				console.log("Address Model Load End=======");
			},

			loadContactListFailure : function(result) {

				console.error("Retrieve failure");
				window.busy.hide();
				WL.SimpleDialog.show("장애", result.errorMsg, [ {
					text : "확인",
					handler : function() {
						// clean garbage
						console.log('panelContentSecond::'
								+ $('.page')[1].remove());
						// console.log('panelContent::'
						// + $('.panel-content').html());

						WL.Logger.debug("error button pressed");
					}
				} ]);
			},

			loadContactList : function(param, orchestrationName) {

				console.log("..............try. to...something like that::"
						+ orchestrationName);
				var invocationData = {
					adapter : 'CastIronAdapter', // adapter name
					procedure : 'startOrchestration_post',
					parameters : [ param, orchestrationName ]
				// parameters if any
				};
				console.log("..............try. to...something like that");
				WL.Client.invokeProcedure(invocationData, {
					onSuccess : this.loadContactListSuccess,
					onFailure : this.loadContactListFailure
				});
			},

			// JSONStore init
			initJSONStore : function() {

				var collectionName = 'contact';
				// Object that defines all the collections
				var collections = {};
				// Object that defines the 'people' collection
				collections[collectionName] = {};
				// Object that defines the Search Fields for the 'people'
				// collection
				collections[collectionName].searchFields = {
					no : 'string'
				};

				WL.JSONStore.init(collections).then(function() {
					// handle success
					console.log("WL.JSONStore.init success");
				}).fail(function(errorObject) {
					// handle failure
					console.log("WL.JSONStore.init failure");
				});
			},

			// JSONStore init
			initJSONStore2 : function() {

				var that = this;

				var collectionName = 'contact';
				// Object that defines all the collections
				var collections = {};
				// Object that defines the 'people' collection
				collections[collectionName] = {};
				// Object that defines the Search Fields for the 'people'
				// collection
				collections[collectionName].searchFields = {
					no : 'string'
				};

				WL.JSONStore.init(collections).then(function() {
					// handle success
					console.log("WL.JSONStore.init2 success");
					that.removeCollectionJSONStore();
				}).fail(function(errorObject) {
					// handle failure
					console.log("WL.JSONStore.init2 failure");
				});
			},

			// JSONStore add
			allAddJSONStore : function(items, i) {

				var that = this;
				console.log("data i ::" + i);
				if (i > 0) {
					i--;

					var data = {
						nameEn : items[i].nameen,
						hiredDate : items[i].hiredate,
						sex : items[i].sex,
						phone : items[i].phone,
						email : items[i].email,
						no : items[i].no,
						birthDate : items[i].birthdate,
						dept : items[i].dept,
						nameKo : items[i].nameko,
						title : items[i].title,
						photo : 'data:image/jpeg;base64,' + items[i].photo
					};

					var collectionName = 'contact';
					var options = {}; // default
					WL.JSONStore.get(collectionName).add(data, options).then(
							function() {
								// handle success
								console.log("WL.JSONStore.add success");
								console.log("data i2 ::" + i);
								that.allAddJSONStore(items, i);
							}).fail(function(errorObject) {
						// handle failure
						console.log("WL.JSONStore.add failure");
					});

				}

			},

			// JSONStore FindAll
			findAllJSONStore : function() {

				var collectionName = 'contact';
				var options = {
					exact : false, // default
					// limit: 10 //returns a maximum of 10 documents, default:
					// return every match
				};
				WL.JSONStore.get(collectionName).findAll(options).then(
						function(arrayResults) {
							// arrayResults = [{_id: 1, json: {name: 'carlos',
							// age: 99}}]
							console.log("findAll success ::");
							console.log(arrayResults);
						}).fail(function(errorObject) {
					// handle failure
					console.log("findAll failure ");
				});
			},

			// JSONStore Find
			findJSONStore : function(contact_no) {

				var query = {
					no : contact_no
				};
				var collectionName = 'contact';
				var options = {
				// exact: false, //default
				// limit: 10 //returns a maximum of 10 documents, default:
				// return every match
				};
				WL.JSONStore.get(collectionName).find(query, options).then(
						function(arrayResults) {
							// arrayResults = [{_id: 1, json: {name: 'carlos',
							// age: 99}}]
							console.log("find success ::");
							console.log(arrayResults);
						}).fail(function(errorObject) {
					// handle failure
					console.log("find failure ");
				});
			},

			// JSONStore Remove Collection
			removeCollectionJSONStore : function() {
				var that = this;
				var collectionName = 'contact';

				WL.JSONStore.get(collectionName).removeCollection().then(
						function() {
							// handle success
							console.log("Remove Collection success ");
							that.initJSONStore();

						}).fail(function(errorObject) {
					// handle failure
					console.log("Remove Collection failure ");
				});
			}

		});
