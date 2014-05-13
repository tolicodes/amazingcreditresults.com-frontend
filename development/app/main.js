// main.js
// -------
// See requirejs.org/
// Requires `require`, `define`

require.config({
	baseUrl : './',
	locale : 'en-us',
	config : {
		text : {
			useXhr : function(url, protocol, hostname, port) {
				return true;
			}
		}
	},
	paths : {
		// Libraries
		'backbone' : ['app/libs/backbone'],
		'underscore' : ['app/libs/underscore'],
		'jquery' : 'app/libs/jquery.1.10.2.min',
		'backgrid' : 'app/libs/backgrid',
		'pageableCollection' : 'app/libs/backbone-pageable',
		'backgridPaginator' : 'app/libs/backgrid-paginator',
		'hbs' : 'app/libs/hbs',
		// Plugins
		'bootstrap' : ['app/libs/bootstrap.min'],
		'text' : ['app/libs/text'],
		// Should be used as required dependencies with use of `define`,
		'models' : ['app/js/models'],
		'views' : ['app/js/views'],
		'collections' : ['app/js/collections'],
		'cssPath' : ['css'],
		// Application - bootstrap for frontend app
		'application' : ['app/app']

	},

	hbs : {// optional
		helpers : true, // default: true
		i18n : false, // default: false
		templateExtension : 'hbs', // default: 'hbs'
		partialsUrl : '' // default: ''
	},

	map : {
		'*' : {
			'less' : 'app/libs/require-less/less', // path to less
			'css': 'app/libs/css' // or whatever the path to require-css is
		}
	},

	shim : {
		'jquery' : {
			exports : '$'
		},
		'facade' : {
			deps : ['jquery']
		},
		'underscore' : {
			exports : '_',
			deps : ['jquery']
		},
		'backbone' : {
			deps : ['underscore', 'jquery'],
			exports : 'Backbone'
		},
		'backgrid' : {
			exports : 'Backgrid',
			deps : ['backbone']
		},
		'pageableCollection' : {
			exports : 'PageableCollection',
			deps : ['backbone']
		},
		'backgridPaginator' : {
			exports : 'BackgridPaginator',
			deps : ['backbone']
		}
	},
	priority : ['text', 'models', 'views', 'collections', 'controller'],
	jquery : '1.10.2',
	waitSeconds : 60
});

// initializing the router "application" on startup
define(['require', 'backbone', 'underscore', 'jquery', 'application'], function(require, Backbone, _, $, app) {
	$(document).ready(function() {
		App = {};
		App.routing = new app();
		Backbone.history.start({});
	});
});
