// login.js
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
			return this.getUrl("buyerLogin");
		},
		
		validation: {
		    routingNumber: {
		      required: true,
		      msg: 'Please enter a routing number.'
		    },
		    accountNumber: {
		      required: true,
		      msg: 'Please enter account number'
		    }
		}
	});
});