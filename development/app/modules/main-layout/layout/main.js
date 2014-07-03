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
		
		data: {
			loggedIn: false
		},
		
		initializeBefore: function(options) {
			
			if(sessionStorage.getItem("huntKey")){
				this.data.loggedIn = true;
			}
			
			if(options.options.pageType == "admin") {
				this.template = adminLayout;
			} else if(options.options.pageType == "default") {
				this.template = defaultLayout;
			}
			this.setViewInLayout('.main-view', new options.page(options.options));
		}
	});
});
