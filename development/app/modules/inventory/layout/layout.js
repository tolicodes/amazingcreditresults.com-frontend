// inventory layout.js
// --------------
// Requires define
// Return Backbone View {Object}


define([
	"baseLayout",
	"hbs!inventory/templates/layout",
	"inventory/views/inventory",
	"inventory/views/tradelines"
], function(
	BaseLayout,
	viewTemplate,
	inventoryView,
	tradelinesView
) {

	return BaseLayout.extend({
		template: viewTemplate,
		initializeAfter: function(options) {
			this.setViewInLayout('.tradelines', new tradelinesView(options));
			this.setViewInLayout('.inventory', new inventoryView(options));
		}
	});
});
