// dashboard.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!../templates/layout",
	"../views/list",
	"../views/create-owner"
], function(
	BaseLayout,
	templateView,
	listView,
	createOwnerView
) {
	return BaseLayout.extend({
		template: templateView,
		initializeAfter: function(options) {
			this.setViewInLayout('.create-buyer', new createOwnerView(options));
		}
	});
});
