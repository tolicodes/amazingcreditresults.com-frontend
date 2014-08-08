// info.js
// --------------
// Requires define
// Return Backbone View {Object}


define([
	"baseLayout",
	"hbs!../templates/payment",
	"../views/credit",
	"../views/card",
	"../views/bank",	
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
