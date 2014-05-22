// info.js
// --------------
// Requires define
// Return Backbone View {Object}


define([
	"baseLayout",
	"buyer/views/info"
], function(
	BaseLayout,
	infoView
) {

	return BaseLayout.extend({
		
		initializeAfter: function(options) {
			
			this.render();
			
			var myView = new infoView(options);

			this.setViewInLayout('.one', myView);

		}			

	});
});
