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
			'password' : {
				required : true,
				msg : 'Please enter password.'
			},
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