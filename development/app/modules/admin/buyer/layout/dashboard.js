// dashboard.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!../templates/layout",
	"hbs!../templates/edit-layout",
	"../views/create-buyer",
	"../views/edit-user",
	"../views/import",
		"../views/buyer-list"
], function(
	BaseLayout,
	templateView,
	editLayout,
	createBuyerView,
	editUserView,
	importBuyerView,
		buyerListView
) {
	return BaseLayout.extend({
		pageType: 'admin',
		initializeBefore: function(options) {
			if(options && options.page) {
				this.template = editLayout;
			} else {
				this.template = templateView;
			}
		},
		
		initializeAfter: function(options) {
			if(options && options.page) {
				this.setViewInLayout('.edit-buyer', new editUserView(options));
			} else { 	
				this.setViewInLayout('.create-buyer', new createBuyerView(options));
				this.setViewInLayout('.import-buyer', new importBuyerView(options));							
			}
			this.setViewInLayout('.buyer-list', new buyerListView(options));			
		}
		
	});
});
