
/* JavaScript content from js/navigation.js in folder common */
////////////////////
// author: nadir93
// date: 2013.12.18
////////////////////
var Navigation = function() {
	this.aniType = 'typeA';
	this.$page1 = '';
	this.$page2 = '';
};

Navigation.prototype.pushView = function(view, aniType) {
	this.aniType = aniType;
	this.$page1 = $(".page");
	this.$page2 = $("<div class='page'>");
	$('.panel-content').append(this.$page2);
	view.render(this.updateView);
};

Navigation.prototype.getAniType = function() {
	return this.aniType;
};

Navigation.prototype.load = function(page, callback) {
	this.$page2.load(page, function() {
		navigation.updateView();
		callback();
	});
};

Navigation.prototype.updateView = function() {

	var effectA, effectB;
	if (this.aniType == 'typeA') {
		effectA = 'right';
		effectB = 'left';
	} else {
		effectA = 'left';
		effectB = 'right';
	}

	// Position the page at the starting position of the animation
	this.$page2.attr("class", "page " + effectA);

	this.$page1.one('webkitTransitionEnd', function(e) {
		navigation.$page1.remove();
		// console.log(e.target);
		// $(e.target).remove();
	});
	// Force reflow. More information here:
	// http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
	$('.panel-content')[0].offsetWidth;
	// Position the new page and the current page at the ending position
	// of their animation with a transition class indicating the
	// duration of the animation
	this.$page2.attr("class", "page transition center");
	this.$page1.attr("class", "page transition " + effectB);
};

window.navigation = new Navigation();