// dashboard.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!../templates/layout",
	"video/views/video",
	"cart/layout/cart",
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
			this.setViewInLayout('.video-area', new videoView(options), true);
			this.setViewInLayout('.questionnaire-area', new questionnaireView(options), true);
			this.setViewInLayout('.cart-area', new cartView(options), true);
		}
	});
});
