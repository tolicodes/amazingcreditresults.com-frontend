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
	"questionnaire/views/questionnaire", 
	"auth/models/myself", 
	"buyer/views/inventory",
	"adminLogin/layout/auth-layout",
	"adminDashboard/layout/dashboard",
	"adminManageOwner/layout/layout", 
	"less!cssPath/style"], function(
	Backbone, 
	home,
	buyerInfo,
	dataGrid,
	authLayout,
	questionnaire,
	authModel, 
	inventoryView,
	adminLoginLayout,
	adminDasboardLayout,
	adminManageOwnerLayout
) {

	return Backbone.Router.extend({

		routes : {
			'buyer' : 'buyer',
			'grid' : 'dataGrid',
			'questionnaire' : 'questionnaire',
			'setPassword/:apikey' : 'setPassword',
			'login/:apikey' : 'login',
			'inventory' : 'inventory',
			'buyer/:apikey' : 'buyer',
			'logout' : 'logout',
			// owner routes
			"admin/login": "adminLogin",
			"admin/dashboard": "adminDashboard",
			"admin/owner": "adminOwner",			
			
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

		_createPage : function() {
			if(!_.isUndefined(App.CurrentUser) && this.user) App.CurrentUser.set(this.user.toJSON());
			this.createPage(this.pageView, _({}).extend(this.pageOptions, {
				userDetail : (this.user)?this.user.toJSON():{}
			}));
		},

		// check if page has permission
		checkNeedAuth : function(pageName) {
			return _(this.noAuth).indexOf(pageName) !== -1;
		},

		createPage : function(pageView, options) {
			this.currentView = new pageView(options);
		},		

		// route not found
		routeNotFound : function() {
			alert("Not Found");
		},
		
		/* Owner routes function */
		
		adminLogin: function() {
			this.loadPage(adminLoginLayout, "adminLogin");
		},
		
		adminDashboard: function() {
			this.loadPage(adminDasboardLayout, "adminDashboard");
		},
		
		adminOwner: function() {
			this.loadPage(adminManageOwnerLayout, "adminManageOwner");
		},

		// set password
		setPassword : function(apiKey) {
			this.loadPage(authLayout, "setPassword", {
				apiKey : apiKey,
				page : "setPassword"
			});
		},

		// questionnaire page
		questionnaire : function() {
			this.loadPage(questionnaire, 'questions');
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
			this.loadPage(inventoryView, 'inventory');
		}
		

	});
});
