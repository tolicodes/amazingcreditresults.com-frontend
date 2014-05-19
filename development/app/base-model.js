// base-model.js
// --------------
// Requires define
// Return Backbone Base Model {Object}

define([
	"backbone",
	"backboneRelational"
	], function(
	Backbone,
	BackboneRelational
	) {

	return Backbone.Model.extend({
		apiUrl: "/api/v1/"
	});
});
