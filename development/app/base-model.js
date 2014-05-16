// base-model.js
// --------------
// Requires define
// Return Backbone Base Model {Object}

define([
	"backbone"
	], function(
	Backbone
	) {

	return Backbone.Model.extend({
		apiUrl: "/api/v1/"
	});
});
