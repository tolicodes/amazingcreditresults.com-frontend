// info.js
// --------------
// Requires define
// Return Backbone Model {Object}

define([
	"baseModel"
	], function(
	BaseModel
	) {

	return BaseModel.extend({
		id: undefined,
		url : function() {
			return this.apiUrl + "buyer/setPassword";
		}
	});
});
