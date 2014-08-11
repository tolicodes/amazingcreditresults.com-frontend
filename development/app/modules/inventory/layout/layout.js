// inventory layout.js
// --------------
// Requires define
// Return Backbone View {Object}


define([
	"baseLayout",
	"hbs!../templates/layout",
	"../views/inventory",
	"../views/tradelines",
	"cart/layout/cart"
], function(
	BaseLayout,
	viewTemplate,
	inventoryView,
	tradelinesView,
	cartView
) {

	return BaseLayout.extend({
		template: viewTemplate,
		
		initializeAfter: function(options) {
			this.setViewInLayout('.cart-area', new cartView(options), true);
			this.setViewInLayout('.tradelines', new tradelinesView(options), true);
			this.setViewInLayout('.inventory', new inventoryView(options), true);
		}
	});
});
