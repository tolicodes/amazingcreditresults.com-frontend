// dashboard.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!../templates/cart",
	"../views/cart"
], function(
	BaseLayout,
	templateView,
	cartView
) {
	return BaseLayout.extend({
		
		events: {
			'click .checkout-btn': 'checkout'
		},
		
		checkout: function(e) {
			e.preventDefault();
			App.routing.navigate("checkout", {
				trigger : true
			});
		},
		
		template: templateView,
		initializeAfter: function(options) {
			this.setViewInLayout('.cart', new cartView());
		}
	});
});
