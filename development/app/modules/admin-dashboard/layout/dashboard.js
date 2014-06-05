// dashboard.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!adminDashboard/templates/layout",
	"hbs!adminDashboard/templates/edit-layout",
	"adminDashboard/views/list",
	"adminDashboard/views/create-buyer",
	"adminDashboard/views/edit-user"
], function(
	BaseLayout,
	templateView,
	editLayout,
	listView,
	createBuyerView,
	editUserView
) {
	return BaseLayout.extend({
		initializeBefore: function(options) {
			if(options && options[0] && options[0].page) {
				this.template = editLayout;
			} else {
				this.template = templateView;
			}
		},
		
		initializeAfter: function(options) {
			if(options && options[0] && options[0].page) {
				this.setViewInLayout('.edit-buyer', new editUserView(options));
			} else { 	
				this.setViewInLayout('.list-view', new listView(options));
				this.setViewInLayout('.create-buyer', new createBuyerView(options));							
			}
		}
		
	});
});
