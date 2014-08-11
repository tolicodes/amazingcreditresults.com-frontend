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
		pageType: "admin",
		events: {
			'click .delete-selected': 'deleteSelected'
		},
		
		deleteSelected: function() {
			this.listView.deleteRecords();
		},
		
		initializeBefore: function(options) {
			this.template = (options.id || options.page == "create")?editLayout:templateView;
		},

		initializeAfter: function(options) {
			console.log(options);
			if(options.id || options.page == "create") {
				this.setViewInLayout('.list-view', new addView(options), true);
			} else {
				this.listView = new listView(options);
				this.setViewInLayout('.list-view', this.listView, true);
			}
		}
	});
});
