define([
	"core/router/router",

	"common/layouts/login",
	"modules/admin/login/loginView",
	"common/views/logout",

	"common/layouts/admin",
	"modules/admin/manage-buyers/manage-buyers",
	"modules/admin/manage-sellers/manage-sellers",
	"modules/admin/manage-owners/manage-owners",

	"modules/admin/manage-products/manage-products",
 
	"less!common/css/style"
], function(
	Router,

	loginLayout,
	adminLoginView,
	logoutView,

	adminLayout,
	adminManageBuyers,
	adminManageSellers,
	adminManageOwners,

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

			},
			login: {
				'admin/login': adminLoginView,
				'logout': logoutView
			}
		},

		layouts: {
			login: loginLayout,
			admin: adminLayout
		},

		navigateLogout: function(){
			this.navigate('#/logout', {trigger: true});
		}
	});
});