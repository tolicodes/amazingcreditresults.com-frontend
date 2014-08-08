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
			return this.getUrl((this.buyer)?"authSelf":"adminClients");
		},
		
		defaults: {
			roles: {
				buyer: true
			}
		},

		validation : {
			"name.givenName" : {
				required : true,
				msg : 'Please enter first name.'
			},

			"name.familyName" : {
				required : true,
				msg : 'Please enter last name.'
			},

			phone : {
				required : true,
				msg : 'Please enter phone number.'
			},

			'state' : {
				required : true,
				msg : 'Please select state.'
			},

			'city' : {
				required : true,
				msg : 'Please enter city name.'
			},
			
			'zip' : {
				required : true,
				msg : 'Please enter zip code.'
			},

			street1 : {
				required : true,
				msg : 'Please enter address.'
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