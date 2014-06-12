// dashboard.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!adminManageBuyer/templates/layout",
	"hbs!adminManageBuyer/templates/edit-layout",
	"adminManageBuyer/views/create-buyer",
	"adminManageBuyer/views/edit-user"
], function(
	BaseLayout,
	templateView,
	editLayout,
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
				this.setViewInLayout('.create-buyer', new createBuyerView(options));							
			}
		}
		
	});
});
