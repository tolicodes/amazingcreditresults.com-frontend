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
			return this.getUrl("adminProduct");
		},
		
		validation : {
			bank : {
				required : true,
				msg : 'Please enter Issuing Bank.'
			},

			name : {
				required : true,
				msg : 'Please enter name.'
			}
		}

	});
}); 