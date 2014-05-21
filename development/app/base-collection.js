// base-collection.js
// --------------
// Requires define
// Return Backbone Base Collection {Object}

define([
	"backbone",
	"core/components/endpoints/endpoints"
	], function(
	Backbone,
	EndPoint
	) {
	return Backbone.Collection.extend({
		// get the url
		getUrl: function(name, params) {
			return EndPoint.getUrl(name, params);
		}
	});
});
