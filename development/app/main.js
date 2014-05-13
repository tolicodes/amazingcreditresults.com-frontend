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
		'backbone' : ['libs/backbone/backbone'],
		'underscore' : ['libs/underscore/underscore'],
		'jquery' : 'libs/jquery/jquery',
		'backgrid' : 'libs/backgrid/lib/backgrid',
		'pageableCollection' : 'libs/backbone-pageable/lib/backbone-pageable',
		'backgridPaginator' : 'libs/libs/backgrid-paginator',
		'hbs' : 'libs/require-handlebars/hbars',
		'bootstrap' : ['libs/bootstrap/dist/js/bootstrap'],

		// Should be used as required dependencies with use of `define`,
		'auth' : ['app/modules/auth'],
		'buyer' : ['app/modules/buyer'],
		'grid' : ['app/modules/grid'],
		'home' : ['app/modules/home'],
		'questionair' : ['app/modules/questionair'],
		
		'cssPath' : ['app/common/css'],
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
			'less' : 'libs/require-less/less', // path to less
			'css': 'libs/require-css/css' // or whatever the path to require-css is
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
	priority : [],
	jquery : '1.10.2',
	waitSeconds : 60
});

// initializing the router "application" on startup
define(['backbone', 'underscore', 'jquery', 'application'], function(Backbone, _, $, app) {
	$(document).ready(function() {
		App = {};
		App.routing = new app();
		Backbone.history.start({});
	});
});
