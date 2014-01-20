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
				
//				console.log("ADF.user.grp ::" + ADF.user.grp);
//				console.log("ADF.user.no ::" + ADF.user.no);
				
				// load dashBoard view
				var that = this;
				navigation.loadBefore('views/contactList.html', function() {

					that.loadContactList('{"act" : "R"}', "ADFlowContact");
					
					// 관리자 및 본일 일때 버튼 표시여부
					// adminID => 관리자 ID
					// loginID => 로그인 id
					//추가버튼 관리자 일때 표시
					if (ADF.user.grp != '1') {
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

				console.log("address list End=======");

			},

			iscrollInit : function() {
				myScroll = new iScroll('ulDiv', {
					hScrollbar : false,
					vScrollbar : false
				});

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
