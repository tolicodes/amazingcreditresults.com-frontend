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
			console.log(options.options.userDetail.email);
			if(sessionStorage.getItem("huntKey")){
				this.data.loggedIn = true;
			}
			
			if(options.options.pageType == "admin") {
				this.template = adminLayout;
			} else if(options.options.pageType == "default") {
				this.template = defaultLayout;
			}
			
			this.setViewInLayout('.main-view', new options.page(options.options));
		},
		
		initializeAfter: function(options) {
						// set mail To
			if(options.options.userDetail && options.options.userDetail.email) {
				var message = encodeURIComponent("Amazing Credit Results-Reset Password Request for "+ options.options.userDetail.email);
				$(".mail-to-h").prop("href", "mailto:sales@amazingcreditresults.com?subject="+ message);
			}

		}
		
		
	});
});
