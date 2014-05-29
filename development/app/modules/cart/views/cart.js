// home.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"hbs!cart/templates/cart", 
	"cart/models/cart"
], function(
	Base, 
	viewTemplate, 
	questionModel
) {

	return Base.extend({
		
		el: undefined,

		tpl: viewTemplate,

		extraHooks: {
			'intialize:before' : ['showCart']
		},
		
		events: {
			'click .checkout-btn' : 'checkout'
		},
		
		checkout: function() {
			
		},

		showCart: function() {
			
		}

	});
});
