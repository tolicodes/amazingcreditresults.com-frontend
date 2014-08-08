// tradelines layout.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!../templates/layout",
	"hbs!../templates/edit",
	"../views/list",
	"../layout/layout",
	"../views/add"
], function(
	BaseLayout,
	templateView,
	editLayout,
	listView,
	adminProductLayout,
	addView
) {
	return BaseLayout.extend({

		events: {
			'click .delete-selected': 'deleteSelected'
		},
		
		deleteSelected: function() {
			this.listView.deleteRecords();
		},
		
		initializeBefore: function(options) {
			this.template = (options.tradelineId || options.pageName == "create")?editLayout:templateView;
		},

		initializeAfter: function(options) {
			if(options.tradelineId || options.pageName == "create") {
				this.setViewInLayout('.list-view', new addView(options), true);
			} else {
				this.listView = new listView(options);
				this.setViewInLayout('.list-view', this.listView, true);
			}
		}
	});
});
