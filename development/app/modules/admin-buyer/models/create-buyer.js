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
			"name.givenName" : {
				required : true,
				msg : 'Please enter first name.'
			},

			"name.familyName" : {
				required : true,
				msg : 'Please enter last name.'
			},

			city : {
				required : true,
				msg : 'Please enter city name.'
			},
			
			// state : {
				// required : true,
				// msg : 'Please select state.'
			// },

			// state: {
				// required: function(value, attr, computedState) {
					// console.log(value, attr, computedState);
			        // return (value !== "Select")?true:false;
			    // }
			// },

			zip : {
				required : true,
				msg : 'Please enter zip code.'
			},

			telefone : {
				required : true,
				msg : 'Please enter phone number.'
			},


			localAddress : {
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