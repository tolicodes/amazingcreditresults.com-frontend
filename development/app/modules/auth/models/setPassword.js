// setPassword.js
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
			return this.getUrl("buyerSetPassword");
		},
		
		validation : {
			password : {
				required : true,
				msg : 'Please enter a password.'
			},
			confirmPassword : [{
				required : true,
				msg : 'Please confirm password.'
			}, {
				fn : function(value, attr, computedState) {
					if (computedState.password != computedState.confirmPassword) {
						return 'Please confirm password.';
					}
				}
			}]
		}
	});
});
