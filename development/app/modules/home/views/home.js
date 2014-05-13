// home.js
// --------------
// Requires define
// Return Backbone View {Object}

define(["backbone","hbs!home/templates/home"], function(Backbone, viewTemplate) {

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
