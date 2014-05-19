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
			
			var myView = new infoView(), myView1 = new infoView();

			this.setViewInLayout( '.one', myView);
			this.setViewInLayout( '.two', myView1);

		}			

	});
});
