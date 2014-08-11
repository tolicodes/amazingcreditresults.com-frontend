// dashboard.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!../templates/layout",
	"../views/create-owner"
], function(
	BaseLayout,
	templateView,
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
