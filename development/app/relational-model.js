// relational-model.js
// --------------
// Requires define
// Return Backbone Relational Model {Object}

define([
	"backbone",
	"core/components/endpoints/endpoints",
	"backboneRelational",
	"backboneValidator"
	], function(
	Backbone,
	EndPoint
	) {

	return Backbone.RelationalModel.extend({
		apiUrl: "/api/v1/",
		relations: [],
		
		// get the url
		getUrl: function(name, params) {
			return EndPoint.getUrl(name, params);
		}
		
	});
});
