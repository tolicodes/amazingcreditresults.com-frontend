// relational-model.js
// --------------
// Requires define
// Return Backbone Relational Model {Object}

define([
	"backbone",
	"backboneRelational"
	], function(
	Backbone
	) {

	return Backbone.RelationalModel.extend({
		apiUrl: "/api/v1/",
		relations: [],
		
	});
});
