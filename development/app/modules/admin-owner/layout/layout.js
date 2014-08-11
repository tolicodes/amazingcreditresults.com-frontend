// dashboard.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!adminManageOwner/templates/layout",
	"adminManageOwner/views/list",
	"adminManageOwner/views/create-owner"
], function(
	BaseLayout,
	templateView,
	listView,
	createOwnerView
) {
	return BaseLayout.extend({
		pageType: 'admin',
		template: templateView,
		initializeAfter: function(options) {
			this.setViewInLayout('.create-buyer', new createOwnerView(options));
		}
	});
});
