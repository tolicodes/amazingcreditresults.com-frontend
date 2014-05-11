// app.js
// --------------
// Requires define
// Return {Object} App

define(["require", "backbone", "views/home/home", "views/buyer/info","views/grid/grid"], function(require, Backbone, home, buyerInfo, dataGrid) {

	return Backbone.Router.extend({

		routes : {
			'' : 'home',
			'grid': 'dataGrid',
			"*splat" : "routeNotFound"
		},

		// route not found
		routeNotFound : function() {
			alert("Not Found");
		},

		// home page route
		home : function() {
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
