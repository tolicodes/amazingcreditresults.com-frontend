// create-owner.js
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
			return this.getUrl("createOwner");
		},

		validation : {
			'password' : [{
				required : true,
				msg : 'Please enter password.'
			}, {
				rangeLength: [8, 20],
				pattern : 'passwordValdition',
				msg : 'Please enter a password between 8-20 characters include atleast one number, special character and capital letter.'
			}],
			'username' : [{
				msg : 'Please enter valid email.',
				pattern : 'email',
			}, {
				required : true,
				msg : 'Please enter email.'
			}]
		}

	});
}); 