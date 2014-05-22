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
		    password: {
		      required: true,
		      msg: 'Please enter a password.'
		    },
		    apiKey: {
		      required: true,
		      msg: 'Apikey is required.'
		    }
		}
		
		
	});
});