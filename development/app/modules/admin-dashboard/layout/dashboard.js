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

		events: {
			'click .delete-selected': 'deleteSelected'
		},
		
		deleteSelected: function() {
			this.listView.deleteRecords();
		},
		
		template: templateView,
		
		initializeAfter: function(options) {
			this.listView = new listView(options);
			this.setViewInLayout('.list-view', this.listView, true);
			this.setViewInLayout('.product-view', new adminProductLayout(options), true);
		}
	});
});
