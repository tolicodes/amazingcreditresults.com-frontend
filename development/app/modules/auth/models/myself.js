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
		autoFetch: true,
		url : function() {
			return this.getUrl("authSelf");			
		}
	});
});
