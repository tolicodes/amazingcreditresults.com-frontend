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
		"backboneForms": 'libs/backbone-forms/distribution.amd/backbone-forms',
		'underscore' : ['libs/underscore/underscore'],
		'jquery' : 'libs/jquery/jquery',
		'backgrid' : 'libs/backgrid/lib/backgrid',
		'pageableCollection' : 'libs/backbone-pageable/lib/backbone-pageable',
		'backgridPaginator' : 'libs/backgrid-paginator/backgrid-paginator',
		'hbs' : 'libs/require-handlebars-plugin/hbs',
		'Handlebars': 'libs/handlebars/handlebars',
		'bootstrap' : ['libs/bootstrap/dist/js/bootstrap'],
		'text' : ['libs/requirejs-text/text'],

		// Should be used as required dependencies with use of `define`,
		'auth' : ['app/modules/auth'],
		'buyer' : ['app/modules/buyer'],
		'grid' : ['app/modules/grid'],
		'home' : ['app/modules/home'],
		'questionair' : ['app/modules/questionair'],
		
		'cssPath' : ['app/common/css'],
		// Application - bootstrap for frontend app
		'application' : ['app/app'],
		'base' : ['app/base-view'],
		'formView': ['core/components/form/form-view'],
		'dataTable': ['core/components/data-table/grid'],
		'Mediatior': ['core/components/messaging/message']

	},

	// hbs: { // optional
        // helpers: true,            // default: true
        // i18n: false,              // default: false
        // templateExtension: 'hbs', // default: 'hbs'
        // partialsUrl: ''           // default: ''
   // },

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
define([
	'backbone', 
	'underscore', 
	'jquery', 
	'application',
	'Mediatior'
	], function(
		Backbone, 
		_, 
		$, 
		app,
		mediatior
	) {
	$(document).ready(function() {
		App = {};
		console.log(new mediatior);
		App.Mediatior = new mediatior;
		App.routing = new app();
		Backbone.history.start({});
	});
});
