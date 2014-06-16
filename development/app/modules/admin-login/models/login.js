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
			return this.getUrl("adminLogin");
		},
		
		validation: {
		    username: {
		      required: true,
		      msg: 'Please enter a username.'
		    },
		    
		    password: {
		      required: true,
		      msg: 'Please enter a password.'
		    }
		    
		  //  card: 'validateCard'
		},
		
		// validateCard: function(value, attr, computedState) {
		    // if(value !== 'something') {
		      // return 'Card is invalid';
		    // }
	    // }
		
	});
});