// info.js
// --------------
// Requires define
// Return Backbone View {Object}


define([
	"baseLayout",
	"hbs!buyer/templates/payment",
	"buyer/views/credit",
	"buyer/views/card",
	"buyer/views/bank",	
], function(
	BaseLayout,
	viewTemplate,
	creditView,
	cardView,
	bankView
) {

	return BaseLayout.extend({
		
		template: viewTemplate,
		
		initializeAfter: function(options) {
			this.setViewInLayout('.credit', new creditView(options));
			this.setViewInLayout('.card', new cardView(options));
			this.setViewInLayout('.bank', new bankView(options));
		}			
	});
});
