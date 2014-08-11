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
		}),
		
		parse: function(data) {
			console.log(data);
			var result = [];
			_.each(data.data, function(item) {
				result.push({"val": item.id, "label": item.name});
			});
			return result;
		},		

		url: function() {
			return this.getUrl("products");
		}
	});
});
