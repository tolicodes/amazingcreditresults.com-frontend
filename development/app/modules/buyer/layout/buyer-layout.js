// info.js
// --------------
// Requires define
// Return Backbone View {Object}


define([
	"baseLayout",
	"hbs!buyer/templates/layout",
	"buyer/views/info",
	"buyer/layout/payment"
], function(
	BaseLayout,
	viewTemplate,
	infoView,
	paymentInfolayout
) {

	return BaseLayout.extend({
		
		template: viewTemplate,
		
		initializeAfter: function(options) {
			this.setViewInLayout('.buyer-info', new infoView(options), true);
			this.setViewInLayout('.payment-info', new paymentInfolayout(options), true);
		}			
	});
});
