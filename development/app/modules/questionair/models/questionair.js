// info.js
// --------------
// Requires define
// Return Backbone Model {Object}

define(["backbone"], function( Backbone, viewTemplate) {

	return Backbone.Model.extend({
		apiUrl: "/api/v1/",
		id: undefined,
		url : function() {
			return this.apiUrl + "admin/clients/"+ this.id;
		}
	});
});
