// states.js
// --------------
// Requires define
// Return Backbone Collection {Object}

define([
	"baseCollection",
	"backbone"
	], function(
	BaseCollection,
	Backbone
) {

	return BaseCollection.extend({
		
		model: Backbone.Model.extend({ 
			toString: function() {
				return this.get("label");
			}
		}),

		url: function() {
			return "app/common/data/json/states.json";
		}
	});
});
