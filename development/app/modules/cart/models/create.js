// create cart
// --------------
// Requires define
// Return Backbone Model {Object}

define([
	"baseModel"
	], function(
	BaseModel
	) {

	return BaseModel.extend({
		idAttribute: "_id",
		url : function() {
			return this.getUrl("cart");		
		}
	});
});
