define([
	"core/router/router",

	"common/layouts/login",
	"modules/admin/login/loginView",
	"common/views/logout",

	"common/layouts/admin",
	"modules/admin/dashboard/dashboardView",
	"modules/admin/manage-buyers/manage-buyers",
 
	"less!common/css/style"
], function(
	Router,

	loginLayout,
	adminLoginView,
	logoutView,

	adminLayout,
	adminDashboard,
	adminManageBuyers
) {

	return Router.extend({
		hooks: {
			'M:inactivityTimeout': 'navigateLogout'
		},

		pages: {
			admin: {
				'admin/dashboard': adminDashboard,
				'admin/manage-buyers': adminManageBuyers
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