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
	"questionair/views/questionair", 
	"auth/models/myself", 
	"buyer/views/inventory", 
	"less!cssPath/style"], function(
	Backbone, 
	home,
	buyerInfo,
	dataGrid,
	authLayout,
	questionair,
	authModel, 
	inventoryView
) {

	return Backbone.Router.extend({

		routes : {
			'buyer' : 'buyer',
			'grid' : 'dataGrid',
			'questions' : 'questions',
			'setPassword/:apikey' : 'setPassword',
			'login/:apikey' : 'login',
			'inventory' : 'inventory',
			"*splat" : "routeNotFound"
		},

		// permission to access pages without login
		noAuth : ["login", "setPassword"],
		
		initialize: function() {
			// setup hunkKey if exists
			if(sessionStorage.getItem("huntKey")) {
				$.ajaxSetup({
					beforeSend: function (request) {
	                	request.setRequestHeader("huntKey", sessionStorage.getItem("huntKey"));
	            	}
				});			
			}
		},


		// this function gives the current user detail
		authorizeUser : function(callback) {
			if (!this.user) {
				this.user = new authModel();
				this.user.fetchedDfd.fail(function() {
					App.Mediator.trigger("messaging:showAlert", "Authorization failed. Please login.", "error");
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

		// set password
		setPassword : function(apiKey) {
			this.loadPage(authLayout, "setPassword", {
				apiKey : apiKey,
				page : "setPassword"
			});
		},

		// questions page
		questions : function() {
			this.loadPage(questionair, 'questions');
		},

		// set password
		login : function(apiKey) {
			this.loadPage(authLayout, "login", {
				apiKey : apiKey,
				page : "login"
			});
		},

		// home page route
		buyer : function() {
			this.loadPage(buyerInfo, 'buyer');
		},

		dataGrid : function() {
			this.loadPage(dataGrid, 'dataGrid');
		},

		inventory : function() {
			this.loadPage(inventoryView, 'inventory');
		}
		

	});
});
