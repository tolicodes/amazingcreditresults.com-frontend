// dashboard.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!adminDashboard/templates/layout",
	"adminDashboard/views/list",
	"adminDashboard/views/create-buyer"
], function(
	BaseLayout,
	templateView,
	listView,
	createBuyerView
) {
	return BaseLayout.extend({
		el: ".main-container",
		template: templateView,
		initializeAfter: function(options) {
			this.setViewInLayout('.list-view', new listView(options));
			this.setViewInLayout('.create-buyer', new createBuyerView(options));
		}
	});
});
