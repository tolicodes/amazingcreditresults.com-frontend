// app.js
// --------------
// Requires define
// Return {Object} App

define([
	"backbone",
	"home/views/home",
	"buyer/layout/buyer-layout",
	"auth/layout/auth-layout",
	"buyerDashboard/layout/dashboard",
	
	"inventory/layout/layout",
	"adminLogin/layout/auth-layout",
	"adminDashboard/layout/dashboard",
	"adminManageOwner/layout/layout",
	'mainLayout/layout/main',
	"adminManageBuyer/layout/dashboard",
	"adminProduct/layout/layout",
	"adminSeller/layout/layout",
	"logout/views/logout",
	"core/components/auth/auth",

	"less!cssPath/style"
], function(
	Backbone,
	home,
	buyerInfo,
	authLayout,
	buyerDashboardLayout,
	
	inventoryLayout,
	adminLoginLayout,
	adminDashboardLayout,
	adminManageOwnerLayout,
	mainLayout,
	adminManageBuyerLayout,
	adminCreateProductLayout,
	adminSellerLayout,
	logoutView,
	auth
) {

	return Backbone.Router.extend({
		routes: {
			'setPassword/:apikey': 'setPassword',
			'login/:apikey': 'login',
			
			'checkout/:apikey': 'checkout',
			'buyer/:apikey': 'checkout',
			'logout': 'logout',

			// 404 Page
			"*splat": "routeNotFound"
		},

		pages: {
			'': buyerDashboardLayout,
			'dashboard': buyerDashboardLayout,
			'inventory': inventoryLayout,
			'checkout/apikey': buyerInfo,


			'admin/dashboard': adminDashboardLayout,
			'admin/login': adminLoginLayout,
			'admin/seller': adminSellerLayout,
			"admin/owner": adminManageOwnerLayout,
			'admin/buyer': adminManageBuyerLayout,

			"admin/user/:id": adminManageBuyerLayout,

			"admin/seller/add": adminSellerLayout,
			"admin/seller/add/:userId": adminManageBuyerLayout,


			"admin/product/create": adminCreateProductLayout,

			"admin/product/create/:id": adminCreateProductLayout,
		},

		// permission to access pages without login
		noAuth: ["login/:apikey", "setPassword/:apikey", "admin/login", "logout"],


		initialize: function() {
			this._appendMainContainer();
			
			_.bindAll(this, '_createPage');

			_(this.pages).each(function(pageView, route){
				var optsArray = (route.match(/(\(\?)?:\w+/g));

				optsArray = _.map(optsArray, function(opt){
					return opt.substr(1);
				})

				this.route(route, function(){
					var opts = {};

					_.each(arguments, function(arg, i){
						if(!optsArray[i]) { return; }
						opts[optsArray[i]] = arg;
					});

					this.createPage(pageView, _.extend({
						pageType: pageView.prototype.pageType || 'default'
					}, opts));
				});
			}, this);
		},

		_appendMainContainer: function(){
			$("body").append('<div class="container"><div class="main-container"></div></div>');
		},
		

		// load page after checking auth
		loadPage: function(pageView, pageName, pageOptions) {
			if (this.checkNeedAuth(pageName)) {

				this._createPage(pageView, pageOptions);
			} else {
				auth.authorizeUser().done(
					this._createPage.bind(this, pageView, pageOptions)
				);
			}
		},

		// check if page has permission
		checkNeedAuth: function(pageName) {
			return _(this.noAuth).indexOf(pageName) === -1;
		},

		createPage: function(pageView, options) {
			var layout = new mainLayout({
				page: pageView,
				options: options
			});
		},

		_createPage: function(pageView, pageOptions) {
			var user = auth.getUser();
			this.createPage(pageView, _({}).extend(pageOptions, {
				userDetail: user ? user.toJSON() : {}
			}));

			if(user) {
				this._displayLogoutButton();
			}
		},

		_displayLogoutButton: function() {
			if (sessionStorage.getItem("huntKey"))
				$(".logout-btn").removeClass("hide");
			else
				$(".logout-btn").addClass("hide");
		},

		routeNotFound: function() {
			App.Mediator.trigger("messaging:showAlert", "Path not found. Redirecting to the main page", "Red");
			this.navigate('', true);
		},

		/* Owner routes function */

		// set password
		setPassword: function(apiKey) {
			this.loadPage(authLayout, "setPassword", {
				apiKey: apiKey,
				page: "setPassword" 
			});
		},

		// set password
		login: function(apiKey) {
			this.loadPage(authLayout, "login", {
				apiKey: apiKey,
				page: "login"
			});
		},

		logout: function() {
			this.loadPage(logoutView, "logout", {
				pageType: "default"
			});
		}
	});
});