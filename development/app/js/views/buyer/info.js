// home.js
// --------------
// Requires define
// Return Backbone View {Object}

define(["require", "backbone","text!templates/buyer/info.html", "models/buyer/info"], function(require, Backbone, viewTemplate, model) {

	return Backbone.View.extend({

		events : {

		},
		
		// main initialize function
		initialize : function(options) {
			var _self = this;
			_self.model = new model;
			_self.model.id = "536cfc8a886fcbba14d07dd6";
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
			$("body").html(_.template(viewTemplate, {data: this.model.toJSON()}));
		}
		
	});
});
