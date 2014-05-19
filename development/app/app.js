// app.js
// --------------
// Requires define
// Return {Object} App

define([
	"backbone",
	"home/views/home",
	//"buyer/views/info",
	"buyer/layout/buyer-layout",	
	"grid/views/grid",
	"auth/views/set-password",
	"auth/views/login",
	"questionair/views/questionair",
	"auth/models/myself",
	"buyer/views/inventory",
	"less!cssPath/style"
	], function(
	Backbone, 
	home, 
	buyerInfo, 
	dataGrid, 
	setPassword, 
	login, 
	questionair, 
	authModel,
	inventoryView
	) {

	return Backbone.Router.extend({

		routes : {
			'' : 'login',
			'buyer' : 'buyer',
			'grid' : 'dataGrid',
			'questions' : 'questions',
			'setPassword' : 'setPassword',
			'login' : 'login',
			'inventory': 'inventory',
			"*splat" : "routeNotFound"
		},

		// route not found
		routeNotFound : function() {
			alert("Not Found");
		},

		// set password
		setPassword : function() {
			this.loadPage(setPassword);
		},

		// questions page
		questions : function() {
			this.loadPage(questionair);
		},

		// set password
		login : function() {
			this.loadPage(login);
		},

		// home page route
		buyer : function() {
			this.loadPage(buyerInfo);
		},

		dataGrid : function() {
			this.loadPage(dataGrid);
		},
		
		inventory : function() {
			this.loadPage(inventoryView);
		},

		// this function gives the current user detail
		authorizeduser : function(callback) {
			var model = new authModel();
			model.fetch();
			this.listenTo(model, 'sync', function(){
				if (callback)
					callback(model.toJSON());
			}.bind(this));
			
			this.listenTo(model, 'error', function(){
				App.Mediator.trigger("messaging:showAlert", "Some error occured", "error");
			});

		},

		loadPage : function(pageName) {
			this.authorizeduser(function(userDetail) {
				this.currentView = new pageName({
					userDetail : userDetail
				});
			}.bind(this));
		},

		// main initialize function
		initialize : function(options) {
			//_.bindAll(this);
		}
	});
});
