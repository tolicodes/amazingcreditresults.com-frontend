// video.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"hbs!video/templates/video", 
	"video/models/video"
], function(
	Base, 
	viewTemplate, 
	videoModel
) {

	return Base.extend({
		
		el: undefined,

		tpl: viewTemplate,

		extraHooks: {
			'intialize:before' : ['showVideo']
		},
		
		events: {
			'click .goto-inventory' : 'goToInventory'
		},
		
		goToInventory: function() {
			App.routing.navigate("buyer", {
				trigger : true
			});
		},
		
		showVideo: function() {
			this.model = new videoModel();
			this.model.set({'videoUrl': '//www.youtube.com/embed/jofNR_WkoCE'});
		}
	});
});
