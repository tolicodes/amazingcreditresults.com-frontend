// home.js
// --------------
// Requires define
// Return Backbone View {Object}


define([
	"base", 
	'hbs!buyer/templates/info', 
	"buyer/models/info"
], function(
	Base, 
	viewTemplate, 
	smodel
) {

	return Base.extend({

		
		// main initialize function
		init : function(options) {
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
		}
		
		
	});
});
