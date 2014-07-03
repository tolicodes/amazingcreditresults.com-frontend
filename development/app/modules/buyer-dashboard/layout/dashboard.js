// dashboard.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!buyerDashboard/templates/layout",
	"video/views/video",
	"cart/views/cart",
	"questionnaire/views/questionnaire"
], function(
	BaseLayout,
	templateView,
	videoView,
	cartView,
	questionnaireView
) {
	return BaseLayout.extend({
		template: templateView,
		initializeAfter: function(options) {
			this.setViewInLayout('.video-area', new videoView(options));
			this.setViewInLayout('.questionnaire-area', new questionnaireView(options));
			this.setViewInLayout('.cart-area', new cartView());
		}
	});
});
