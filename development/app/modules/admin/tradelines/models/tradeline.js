// create-tradelines
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
			return this.getUrl("adminTradelines", {id: this.id});
		},
		
		parse: function(result) {
			return result.data;
		},
		
		validation : {
			totalAus : {
				required : true,
				msg : 'Please enter Total.'
			},

			usedAus : {
				required : true,
				msg : 'Please enter used.'
			},
			seller : {
				required : true,
				msg : 'Please select seller.'
			},
			product : {
				required : true,
				msg : 'Please select product.'
			},
			
		}

	});
}); 