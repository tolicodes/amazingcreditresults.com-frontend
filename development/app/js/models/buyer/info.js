// info.js
// --------------
// Requires define
// Return Backbone Model {Object}

define(["require", "backbone"], function(require, Backbone, viewTemplate) {

	return Backbone.Model.extend({
		apiUrl: "/",
		id: undefined,
		url : function() {
			return this.apiUrl + "admin/clients/"+ this.id;
		}
	});
});
