// home.js
// --------------
// Requires define
// Return Backbone View {Object}


// , "text!templates/buyer/info.html"

define([
	"backbone", 
	'hbs!buyer/templates/info', 
	"buyer/models/info"
], function(
	Backbone, 
	viewTemplate, 
	smodel
) {

	return Backbone.View.extend({

		events : {

		},
		
		// main initialize function
		initialize : function(options) {
			var _self = this;
			_self.model = new model;
			_self.model.id = options.userDetail.id;
			_self.model.fetch({
				success: function() {
					_self.render();
				},
				error: function() {
					alert("Some error occured");
				}
			});
		},
		
		render: function() {
			$("body").html(viewTemplate({data: this.model.toJSON()}));
		}
		
	});
});
