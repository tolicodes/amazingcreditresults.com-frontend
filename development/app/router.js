define([
	"core/router/router",

	"common/layouts/login",
	"modules/admin/login/loginView",
	"common/views/logout",

	"common/layouts/buyer",

	"common/layouts/admin",
	"modules/admin/manage-buyers/manage-buyers",
	"modules/admin/manage-sellers/manage-sellers",
	"modules/admin/manage-owners/manage-owners",

	"modules/buyer/login/login-handler",

	"modules/buyer/inventory/inventory",

	"modules/admin/manage-products/manage-products",
 
	"less!common/css/style"
], function(
	Router,

	loginLayout,
	adminLoginView,
	logoutView,
	
	buyerLayout,

	adminLayout,
	adminManageBuyers,
	adminManageSellers,
	adminManageOwners,

	buyerLoginView,

	inventoryView,

	adminManageProducts
) {
	return Router.extend({
		hooks: {
			'M:inactivityTimeout': 'navigateLogout'
		},

		pages: {
			admin: {
				'admin/manage-buyers': adminManageBuyers,
				'admin/manage-sellers': adminManageSellers,
				'admin/manage-owners': adminManageOwners,

				'admin/manage-products': adminManageProducts
			},
			buyer: {
				'inventory/tier-:tier/limit-:limit': inventoryView,
				'inventory': inventoryView
			},
			login: {
				'admin/login': adminLoginView,
				'logout': logoutView,
				'buyer/login/:welcomeKey': buyerLoginView
			}
		},

		layouts: {
			login: loginLayout,
			admin: adminLayout,
			buyer: buyerLayout
		},

		navigateLogout: function(){
			this.navigate('#/logout', {trigger: true});
		}
	});
});