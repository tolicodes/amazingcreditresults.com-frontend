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
			password : [{
				required : true,
				msg : 'Please enter password.'
			}, {
				rangeLength: [8, 20],
				pattern : 'passwordValidation',
				msg : 'Please enter a password between 8-20 characters include atleast one number, special character and capital letter.'
			}],
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
