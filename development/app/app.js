// app.js
// --------------
// Requires define
// Return {Object} App

define([
	"backbone",
	"home/views/home",
	"buyer/views/info",
	"grid/views/grid",
	"auth/views/set-password",
	"auth/views/login",
	"questionair/views/questionair",
	"auth/models/myself",
	"less!cssPath/style"
	], function(
		Backbone, 
		home, 
		buyerInfo, 
		dataGrid, 
		setPassword, 
		login, 
		questionair, 
		authModel
	) {

	return Backbone.Router.extend({

		routes : {
			'' : 'login',
			'buyer' : 'buyer',
			'grid' : 'dataGrid',
			'questions' : 'questions',
			'setPassword' : 'setPassword',
			'login' : 'login',
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

		// this function gives the current user detail
		authorizeduser : function(callback) {
			var model = new authModel();
			model.fetch({
				success : function() {
					if (callback)
						callback(model.toJSON());
				},
				error : function() {

				}
			});
		},

		loadPage : function(pageName) {
			var _self = this;
			this.authorizeduser(function(userDetail) {
				_self.currentView = new pageName({
					userDetail : userDetail
				});
				_self.currentView.el = "body";
			});
		},

		// main initialize function
		initialize : function(options) {
			//_.bindAll(this);
		}
	});
});
