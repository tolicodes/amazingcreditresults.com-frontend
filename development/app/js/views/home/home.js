// home.js
// --------------
// Requires define
// Return Backbone View {Object}

define(["require", "backbone","text!templates/home/home.html"], function(require, Backbone, viewTemplate) {

	return Backbone.View.extend({

		events : {

		},
		
		// main initialize function
		initialize : function(options) {
		},
		
		render: function() {
			$("body").html(_.template(viewTemplate, {}));
		}
		
	});
});
