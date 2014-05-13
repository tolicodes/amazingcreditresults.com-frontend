// home.js
// --------------
// Requires define
// Return Backbone View {Object}

define(["require", "backbone","hbs!templates/home/home"], function(require, Backbone, viewTemplate) {

	return Backbone.View.extend({

		events : {

		},
		
		el: 'body',
		
		// main initialize function
		initialize : function(options) {
		},
		
		render: function() {
			this.$el.html(viewTemplate());
		}
		
	});
});
