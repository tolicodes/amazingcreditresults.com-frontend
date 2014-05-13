// info.js
// --------------
// Requires define
// Return Backbone Model {Object}

define(["backbone"], function(Backbone, viewTemplate) {

	return Backbone.Model.extend({
		apiUrl: "/",
		id: undefined,
		url : function() {
			return this.apiUrl + "buyer/setPassword";
		}
	});
});
