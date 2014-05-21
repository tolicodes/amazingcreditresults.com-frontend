// password needed.js
// --------------
// Requires define
// Return Backbone Model {Object}

define([
	"baseModel"
	], function(
	BaseModel
	) {
	return BaseModel.extend({
		url : function() {
			return this.getUrl("needToSetPassword", {id: this.id});
		}
	});
});
