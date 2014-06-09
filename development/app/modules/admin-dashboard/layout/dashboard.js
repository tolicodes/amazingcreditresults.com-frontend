// dashboard.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!adminDashboard/templates/layout",
	"adminDashboard/views/list",
	"adminProduct/layout/layout"
], function(
	BaseLayout,
	templateView,
	listView,
	adminProductLayout
) {
	return BaseLayout.extend({
		
		template: templateView,
		
		initializeAfter: function(options) {
			this.setViewInLayout('.list-view', new listView(options));
			this.setViewInLayout('.product-view', new adminProductLayout(options));
		}
	});
});
