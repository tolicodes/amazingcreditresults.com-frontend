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
			 "expiry.month" : {
				required : true,
				msg : 'Please select month.'
			},

			"expiry.year" : {
				required : true,
				msg : 'Please select year.'
			},
			
			cardNumber: function(value, attr, customValue, model) {
				
				if(value == "") return "Please enter credit card.";
				
			    var mc = /^(?:5[1-5][0-9]{14})$/,
			    vc = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/,
			    ae = /^(?:3[47][0-9]{13})$/,
			    dc = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/,
			    dic = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/,
			    jc  = /^(?:(?:2131|1800|35\d{3})\d{11})$/;
			    
			    if (!mc.test(value) && !ae.test(value) && !vc.test(value) && !dc.test(value) && !dic.test(value) && !jc.test(value)) {
			      return 'Please ener valid card number.';
			    }
			  },
			
		    cvv: {
		      required: true,
		      msg: 'Please enter cvv number.'
		    }
		}
	});
});