// app.js
// --------------
// Requires define
// Return {Object} App

define(["require", "backbone", "views/home/home", "views/buyer/info","views/grid/grid", "views/auth/set-password","views/auth/login", "views/questionair/questionair"], 
function(require, Backbone, home, buyerInfo, dataGrid, setPassword, login, questionair) {

	return Backbone.Router.extend({

		routes : {
			'' : 'buyer',
			'buyer': 'buyer',
			'grid': 'dataGrid',
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
		setPassword: function() {
			new setPassword().render();
		},
		
		// questions page
		questions: function() {
			new questionair().render();			
		},
		
		// set password
		login: function() {
			new login().render();
		},

		// home page route
		buyer : function() {
			new buyerInfo().render();
		},
		
		dataGrid : function() {
			new dataGrid().render();
		},

		// main initialize function
		initialize : function(options) {
			_.bindAll(this);
		}
	});
});
