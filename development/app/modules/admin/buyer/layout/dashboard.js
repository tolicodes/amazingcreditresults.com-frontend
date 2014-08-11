// dashboard.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!../templates/layout",
	"hbs!../templates/edit-layout",
	"../views/create-buyer",
	"../views/import",
		"../views/buyer-list"
], function(
	BaseLayout,
	templateView,
	editLayout,
	createBuyerView,
	importBuyerView,
	buyerListView
) {
	return BaseLayout.extend({
		pageType: 'admin',
		initializeBefore: function(options) {
			this.template = (options && options.userId)?editLayout:templateView;
		},
		
		initializeAfter: function(options) {
			if(options && options.userId) {
				this.setViewInLayout('.edit-buyer', new createBuyerView(options));
			} else {
				this.setViewInLayout('.create-buyer', new createBuyerView(options));
				this.setViewInLayout('.import-buyer', new importBuyerView(options));							
			}
			this.setViewInLayout('.buyer-list', new buyerListView(options));			
		}
		
	});
});
