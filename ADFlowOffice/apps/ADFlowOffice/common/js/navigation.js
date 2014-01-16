////////////////////
// author: nadir93
// date: 2013.12.18
////////////////////
var Navigation = function() {
	this.aniType;
	this.$page1;
	this.$page2;
};

Navigation.prototype.pushView = function(view, aniType) {
	this.aniType = aniType;
	this.$page1 = $(".page");
	this.$page2 = $("<div class='page' style='display:none'>");
	$('.panel-content').append(this.$page2);
	view.render(this.updateView);
};

Navigation.prototype.getAniType = function() {
	return this.aniType;
};

Navigation.prototype.load = function(page, callback) {
	var $page = this.$page2;
	this.$page2.load(page, function() {
		$page.attr("style", "");
		navigation.updateView();
		callback();
	});
};

Navigation.prototype.loadBefore = function(page, before) {
	this.$page2.load(page, function() {
		before();
	});
};

Navigation.prototype.loadAsync = function(after) {
	this.$page2.attr("style", "");
	navigation.updateView();

	if (after) {
		after();
	}
};

Navigation.prototype.updateView = function() {
	try {
		var effectA, effectB;
		if (this.aniType == 'typeA') {
			effectA = 'right';
			effectB = 'left';
		} else {
			effectA = 'left';
			effectB = 'right';
		}
		// console.log('$page1::' + this.$page1.html());
		// console.log('$page2::' + this.$page2.html());

		// Position the page at the starting position of the animation
		this.$page2.attr("class", "page " + effectA);

		this.$page1.one('webkitTransitionEnd', function(e) {
			navigation.$page1.remove();
			console.log('webkitTransitionEndPage1Removed');
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
	} catch (e) {
		console.error(e);
	}
};

window.navigation = new Navigation();