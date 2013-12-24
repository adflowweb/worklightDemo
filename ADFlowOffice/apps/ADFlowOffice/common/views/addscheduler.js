/**
 * 
 */


ADF.view.AddScheduler = Backbone.View.extend({
	el : $('.panel-content'), // attaches `this.el` to an existing element.

	initialize : function() {
	console.log("SchedulerView init................. ");
	
	_.bindAll(this, 'render'); 
	// fixes loss of context for 'this' within
	
	
	},
	render : function() {
		console.log("SchedulerView " + this);
		var window_width = $(window).width();   
		console.log("window_width :: "+window_width);
		navigation.load('views/addschedulerForm.html', this.hello);  
		
	},
	hello: function(){
		
	}
});