// info.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"buyer/views/buyer-form", 
	"buyer/models/info"
], function(
	BuyerFormView, 
	model
) {

	return BuyerFormView.extend({
		el : undefined,
		addSchema : {
		},

		initializeBefore : function(options) {
			if (options && options[0] && options[0].userDetail) {
				this.model = new model();
				this.model.set(options[0].userDetail);
			}
		}
	});
});
