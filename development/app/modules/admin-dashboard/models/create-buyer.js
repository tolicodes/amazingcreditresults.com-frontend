// create-buyer.js
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
			return this.getUrl("adminClients");
		},
		
		validation : {
			givenName : {
				required : true,
				msg : 'Please enter last name.'
			},

			familyName : {
				required : true,
				msg : 'Please enter first name.'
			},
			email : [{
				msg : 'Please enter valid email.',
				pattern : 'email',
			}, {
				required : true,
				msg : 'Please enter email.'
			}]
		}

	});
}); 