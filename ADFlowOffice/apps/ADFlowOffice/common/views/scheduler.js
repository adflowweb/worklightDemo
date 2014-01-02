
ADF.view.Scheduler = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing element.

	initialize : function() {
	console.log("SchedulerView init................. ");
	this.collection = new ADF.collection.SchedulerCollection();	
//	this.model = new ADF.model.SchedulerModel();
	console.log(this);
	console.log(this.collection.models);
	console.log(this.collection.toJSON());
//	console.log(this.model);
//	console.log(this.model.toJSON());
	this.collection.bind('add', function() {
	    console.log('this.collection.bind...............new object in the collection');
	});
	
	_.bindAll(this, 'render', 'fetchDB','loadSchedulerSuccess','loadSchedulerFailure','appendSchedulerList'); // fixes loss of context for 'this' within
	
	    	
	},
	render : function() {
		// load SchedulerView view
		console.log("SchedulerView " + this);
		var window_width = $(window).width();   
		console.log("window_width :: "+window_width);
		//call async
		navigation.loadBefore('views/schedulerBoard.html', this.fetchDB);
		//navigation.load('views/schedulerBoard.html', this.fetchDB);
		
       
		
	},

	
	fetchDB : function(){		
		var invocationData = {
                adapter : 'CastIronAdapter', // adapter name
                procedure : 'startOrchestration',
                parameters : ['ADFlowSchedule']
        // parameters if any
        };
        console.log(".........TestScheduler.....try. to...something like that");

       
        WL.Client.invokeProcedure(invocationData, {
                onSuccess : this.loadSchedulerSuccess,
                onFailure : this.loadSchedulerFailure
        });
	},/*fetchDB  end*/
       
	
	loadSchedulerSuccess : function(result){
		console.log("loadSchedulerSuccess" + JSON.stringify(result));
    	console.log("say hello");
		console.log(result.invocationResult.resultSet);
		console.log(result);
		console.log(result.invocationResult);
		console.log(result.invocationResult.array);
		this.appendSchedulerList(result.invocationResult.array);
	},/*loadSchedulerSuccess  end*/
	loadSchedulerFailure : function(result){
		  console.log("loadSchedulerFailure" + JSON.stringify(result));
	},/*loadSchedulerSuccess  end*/
	appendSchedulerList :function(items){
	  	console.log("hello appendSchedulerList :: ");
		console.log(items.length);
		console.log("say..");
		console.log("..............  this.collection............." + this.collection);
		
	   for ( var i = 0; i < items.length; i++) {
		   this.collection.add(new ADF.model.SchedulerModel(
//		   this.collection.add(this.model.set(
					{
						owner : items[i].owner ,
						ctgr : items[i].ctgr,
						strdate : items[i].strdate,
						enddate : items[i].enddate ,						
						detail :  items[i].detail }));
		 
			console.log("say..");
		
			console.log(this.collection.models);
			console.log(this.collection.toJSON());
//			console.log(this.model);
//			console.log(this.model.toJSON());
			
			if( items[i].ctgr=='workoutside'){
				var str ='<li class="workoutside_li">' + items[i].strdate + items[i].owner + items[i].detail + '</li>';
				$('#workoutside_first').after(str);
			}
			if(items[i].ctgr=='dayoff'){
					var str ='<li class="dayoff_li">' +  items[i].strdate + items[i].owner  + '</li>';
				$('#dayoff_first').after(str);
			}
			if(items[i].ctgr=='longproject'){
					var str = '<li class="longproject_li">' + items[i].strdate +' ~ ' + items[i].enddate +items[i].owner + '</li>';
				$('#longproject_first').after(str);
			}

		}
	   
	   //call async
	   navigation.loadAsync(function(){console.log('call after()')});
//
	}, /*appendSchedulerList  end*/

	events:{
		'click .btn_inputScheduler':'inputScheduler'
	},
	inputScheduler:function(){
		
			console.log("inputScheduler.......................... "
					+ this);
			if (!ADF.view.addscheduler) {
				ADF.view.addscheduler = new ADF.view.AddScheduler;
			}
			navigation.pushView(ADF.view.addscheduler, 'typeA');
		

	}
	
});


ADF.model.SchedulerModel = Backbone.Model.extend({
	initialize: function(){
	console.log("SchedulerModel initialize........................");	
	},
	 defaults: function(){
		 return {
			 owner:'',
			 ctgr:'',
			 strdate :'',
			 enddate:'',
			 detail:''
			 };
	 }
	 
});


ADF.collection.SchedulerCollection = Backbone.Collection.extend({
	initialize: function(){
		console.log("SchedulerCollection initialize.....................");
	},
	model:ADF.model.SchedulerModel
});
