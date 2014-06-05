// app.js
// --------------
// Requires define
// Return {Object} App

define([
	"backbone", 
	"home/views/home", 
	"buyer/layout/buyer-layout", 
	"grid/views/grid", 
	"auth/layout/auth-layout", 
	"buyerDashboard/layout/dashboard", 
	"auth/models/myself", 
	"inventory/layout/layout",
	"adminLogin/layout/auth-layout",
	"adminDashboard/layout/dashboard",
	"adminManageOwner/layout/layout",
	'mainLayout/layout/main',
	"less!cssPath/style"
], function(
	Backbone, 
	home,
	buyerInfo,
	dataGrid,
	authLayout,
	buyerDashboardLayout,
	authModel, 
	inventoryLayout,
	adminLoginLayout,
	adminDasboardLayout,
	adminManageOwnerLayout,
	mainLayout
) {

	return Backbone.Router.extend({

		routes : {
			'buyer' : 'buyer',
			'grid' : 'dataGrid',
			'dashboard': 'dashboard',
			'setPassword/:apikey' : 'setPassword',
			'login/:apikey' : 'login',
			'inventory' : 'inventory',
			'buyer/:apikey' : 'buyer',
			'logout' : 'logout',
			// owner routes
			"admin/login": "adminLogin",
			"admin/dashboard": "adminDashboard",
			"admin/owner": "adminOwner",
			"admin/user/:id": "editUser",			
			
			// 404 Page
			"*splat" : "routeNotFound"		
		},

		// permission to access pages without login
		noAuth : ["login", "setPassword", "adminLogin", "logout"],
		
		// user activity time in minutes
		logoutTime: 5,
		
		initialize: function() {
			
			// append the main container into DOM
			if(!$(".main-container").length)
				$("body").append('<div class="container"><div class="main-container"></div></div>');
			
			// setup hunkKey if exists
			if(sessionStorage.getItem("huntKey")) {
				$.ajaxSetup({
					beforeSend: function (request) {
	                	request.setRequestHeader("huntKey", sessionStorage.getItem("huntKey"));
	            	}
				});
			}
			// set in activity timer
			this.setInActivityTimer();
		},
		
		// activity timer
		setInActivityTimer: function() {
			this.userActivityLastTime = new Date().getTime();
			$("html").bind('mousemove click', function() {
				this.userActivityLastTime = new Date().getTime();
			}.bind(this));
			
			// bind interval to check user activity
			var interval = setInterval(this.calculateActivityTime.bind(this), 60000);
		},
		
		calculateActivityTime: function() {
			if(sessionStorage.getItem("huntKey")) {
				var diff = new Date().getTime() - this.userActivityLastTime, minutes = Math.floor((diff / 1000) / 60);
				if (minutes >= (this.logoutTime - 1)) {
					userActivityLastTime = new Date().getTime();
					this.logoutUser();
				}
			}
		},
		
		// logout user
		logoutUser: function() {
			//sessionStorage.removeItem("huntKey");
			App.routing.navigate("logout", {
				trigger : true
			});
		},


		// this function gives the current user detail
		authorizeUser : function(callback) {
			if (!this.user) {
				this.user = new authModel();
				this.user.fetchedDfd.fail(function() {
					App.Mediator.trigger("messaging:showAlert", "Authorization failed. Please login.", "Red");
				});
			}
			return this.user.fetchedDfd;
		},

		// load page after checking auth
		loadPage : function(pageView, pageName, pageOptions) {
			this.pageView = pageView;
			this.pageOptions = pageOptions;
			if (this.checkNeedAuth(pageName)) {
				this._createPage();
			} else {
				this.authorizeUser().done(this._createPage.bind(this));
			}
		},
		
		showUserName: function() {
			var name = (this.user.get("name").givenName)?this.user.get("name").givenName:"-";
			name += " ";
			name += (this.user.get("name").familyName)?this.user.get("name").familyName:"-";
			$(".username").html(name);

		},

		_createPage : function() {
			if(!_.isUndefined(App.CurrentUser) && this.user) App.CurrentUser.set(this.user.toJSON());
			this.createPage(this.pageView, _({}).extend(this.pageOptions, {
				userDetail : (this.user)?this.user.toJSON():{}
			}));
			// show username
			this.showUserName();
		},

		// check if page has permission
		checkNeedAuth : function(pageName) {
			return _(this.noAuth).indexOf(pageName) !== -1;
		},

		createPage : function(pageView, options) {
			this.currentView = new mainLayout({page: pageView, options: options});
		},		

		// route not found
		routeNotFound : function() {
			alert("Not Found");
		},
		
		/* Owner routes function */
		
		adminLogin: function() {
			this.loadPage(adminLoginLayout, "adminLogin", {
				pageType: "default"
			});
		},
		
		adminDashboard: function() {
			this.loadPage(adminDasboardLayout, "adminDashboard", {
				pageType: "admin"
			});
		},
		
		adminOwner: function() {
			this.loadPage(adminManageOwnerLayout, "adminManageOwner", {
				pageType: "admin"
			});
		},
		
		editUser: function(userId) {
			this.loadPage(adminDasboardLayout, "adminDashboard", {
				page: "ediUser",
				userId: userId,
				pageType: "admin"
			});
		},

		// set password
		setPassword : function(apiKey) {
			this.loadPage(authLayout, "setPassword", {
				apiKey : apiKey,
				page : "setPassword"
			});
		},

		dashboard : function() {
			this.loadPage(buyerDashboardLayout, 'buyerDashboard');
		},

		// set password
		login : function(apiKey) {
			this.loadPage(authLayout, "login", {
				apiKey : apiKey,
				page : "login"
			});
		},
		
		logout: function() {
			this.loadPage(authLayout, "logout");			
		},

		// home page route
		buyer : function(apiKey) {
			// if apiKey is defined redirect to login page
			if(apiKey) {
				App.routing.navigate("login/"+apiKey, {
					trigger : true
				});
			} else {
				this.loadPage(buyerInfo, 'buyer', {
					apiKey : apiKey,
					page : "buyer"
				});
			}
		},

		dataGrid : function() {
			this.loadPage(dataGrid, 'dataGrid');
		},

		inventory : function() {
			this.loadPage(inventoryLayout, 'inventory');
		}
		

	});
});
