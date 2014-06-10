// dashboard.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!adminSeller/templates/layout",
	"adminSeller/views/list"
], function(
	BaseLayout,
	templateView,
	listSellers
) {
	return BaseLayout.extend({
		template: templateView,
		
		initializeAfter: function(options) {
			this.setViewInLayout('.list-seller', new listSellers(options));							
		}
	});
});
