// base-collection.js
// --------------
// Requires define
// Return Backbone Base Collection {Object}

define([
	"backbone",
	"core/components/endpoints/endpoints",
	"baseModel"
], function(
	Backbone,
	EndPoint,
	BaseModel
) {
	return Backbone.Collection.extend({
		//model: BaseModel,
		
		// fetch the model automatically if set to true
		autoFetch: false,

		initialize: function() {
			if (this.autoFetch) this.fetch();
		},

		// get the url
		getUrl: function(name, params) {
			return EndPoint.getUrl(name, params);
		}
	});
});