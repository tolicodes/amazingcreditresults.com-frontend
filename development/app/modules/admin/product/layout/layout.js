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
	editLayout,
	listProducts,
	createProductView
) {
	return BaseLayout.extend({
		
		pageType: "admin",
		
		events: {
			'click .add-new-card': 'addNewCard',
			'click .delete-selected': 'deleteSelected'
		},
		
		deleteSelected: function() {
			this.productList.deleteRecords();
		},
		
		addNewCard: function(e) {
			e.preventDefault();
			App.routing.navigate("admin/product/create", {
				trigger : true
			});
		},
		
		initializeBefore: function(options) {
			console.log(options);
			this.template = (options && options.page == "create")?editLayout:templateView;
		},
		
		initializeAfter: function(options) {
			if(options && options.id) {
				this.setViewInLayout('.create', new createProductView(options));
			} else {
				this.productList = new listProducts(options);
				this.setViewInLayout('.list-product', this.productList);											
			}
		}
	});
});
