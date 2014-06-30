// inventory layout.js
// --------------
// Requires define
// Return Backbone View {Object}


define([
	"baseLayout",
	"hbs!inventory/templates/layout",
	"inventory/views/inventory",
	"inventory/views/tradelines",
	"cart/views/cart"
], function(
	BaseLayout,
	viewTemplate,
	inventoryView,
	tradelinesView,
	cartView
) {

	return BaseLayout.extend({
		template: viewTemplate,
		
		events: {
			'click .checkout': 'checkout'
		},
		
		checkout: function(e) {
			e.preventDefault();
			App.routing.navigate("checkout", {
				trigger : true
			});
		},
		
		initializeAfter: function(options) {
			var cart = new cartView(options);
			this.setViewInLayout('.cart', cart);
			this.setViewInLayout('.tradelines', new tradelinesView(options, cart));
			this.setViewInLayout('.inventory', new inventoryView(options));
		}
	});
});
