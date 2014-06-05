// main layout.js
// --------------
// Requires define
// Return Backbone Layout {Object}

define([
	"baseLayout",
	"hbs!mainLayout/templates/buyer-layout",
	"hbs!mainLayout/templates/admin-layout",
	"hbs!mainLayout/templates/default-layout"
], function(
	BaseLayout,
	templateView,
	adminLayout,
	defaultLayout
) {
	return BaseLayout.extend({
		el: ".main-container",
		template: templateView,
		initializeBefore: function(options) {
			
			if(options[0].options.pageType == "admin") {
				this.template = adminLayout;
			} else if(options[0].options.pageType == "default") {
				this.template = defaultLayout;
			}
				
			this.setViewInLayout('.main-view', new options[0].page(options[0].options));
		}
	});
});
