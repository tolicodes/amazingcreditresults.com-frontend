define([
	"core/mvc/collection"
], function(
	BaseCollection
) {
	return BaseCollection.extend({	
		url: "app/common/data/json/states.json",
		model: Backbone.Model.extend({
			toString: function() {
				return this.get('label')
			},
			idAttribute: 'val'
		})
	});
});
