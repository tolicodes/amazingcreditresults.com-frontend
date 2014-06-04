// info.js
// --------------
// Requires define
// Return Backbone View {Object}


define([
	"baseLayout",
	"hbs!buyer/templates/layout",
	"buyer/views/info"
], function(
	BaseLayout,
	viewTemplate,
	infoView
) {

	return BaseLayout.extend({
		
		template: viewTemplate,
		
		initializeAfter: function(options) {
			this.render();
			this.setViewInLayout('.buyer-info', new infoView(options));
			//this.setViewInLayout('.inventory', new inventoryView(options));
		}			
	});
});
