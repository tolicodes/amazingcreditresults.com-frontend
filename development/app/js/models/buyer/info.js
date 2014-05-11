// info.js
// --------------
// Requires define
// Return Backbone Model {Object}

define(["require", "backbone"], function(require, Backbone, viewTemplate) {

	return Backbone.Model.extend({
		apiUrl: "http://54.86.168.135/",
		id: undefined,
		url : function() {
			return this.apiUrl + "admin/clients/"+ this.id;
		}
	});
});
