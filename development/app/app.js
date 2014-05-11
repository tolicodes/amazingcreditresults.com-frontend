// app.js
// --------------
// Requires define
// Return {Object} App

define(["require", "backbone", "views/home/home","views/buyer/info"], function(require, Backbone, home, buyerInfo) {

	return Backbone.Router.extend({

		routes : {
			'' : 'home',
			"*splat" : "routeNotFound"
		},

		// route not found
		routeNotFound : function() {
			alert("Not Found");
		},

		// home page route
		home : function() {
			var a = new buyerInfo().render();
		},

		// main initialize function
		initialize : function(options) {
			_.bindAll(this);
		}
	});
});
