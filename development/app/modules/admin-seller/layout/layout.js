// dashboard.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!../templates/layout",
	"hbs!../templates/create",
	"../views/list",
	"../views/create"
], function(
	BaseLayout,
	templateView,
	createLayout,
	listSellers,
	addSeller
) {
	return BaseLayout.extend({
		pageType: 'admin',
		
		events: {
			'click .add-seller-h' : 'addSeller'
		},
		
		addSeller: function(e) {
			e.preventDefault();
			App.routing.navigate("admin/seller/add", {
				trigger : true
			});	

		},

		initializeBefore: function(options) {
			if(options && options.page) {
				this.template = createLayout;
			} else {
				this.template = templateView;
			}
		},
		
		initializeAfter: function(options) {
			if(options && options.page) {
				this.setViewInLayout('.create', new addSeller(options));
			} else { 	
				this.setViewInLayout('.list-seller', new listSellers(options));			
			}
		}
	});
});
