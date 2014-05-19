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
		'backbone' : 'libs/backbone/backbone',
		'backboneRelational' : 'libs/backbone-relational/backbone-relational',
		'layoutManagers' : 'libs/layoutmanager/backbone.layoutmanager',
		"backboneForms": 'libs/backbone-forms/distribution.amd/backbone-forms',
		'underscore' : 'libs/underscore/underscore',
		'jquery' : 'libs/jquery/jquery',
		'backgrid' : 'libs/backgrid/lib/backgrid',
		'pageableCollection' : 'libs/backbone-pageable/lib/backbone-pageable',
		'backgridPaginator' : 'libs/backgrid-paginator/backgrid-paginator',
		'hbs' : 'libs/require-handlebars-plugin/hbs',
		'Handlebars': 'libs/handlebars/handlebars',
		'bootstrap' : 'libs/bootstrap/dist/js/bootstrap',
		'text' : 'libs/requirejs-text/text',

		// Should be used as required dependencies with use of `define`,
		'auth' : 'app/modules/auth',
		'buyer': 'app/modules/buyer',
		'grid' : 'app/modules/grid',
		'home' : 'app/modules/home',
		'questionair' : 'app/modules/questionair',
		
		'cssPath' : 'app/common/css',
		
		'application' : 'app/app',
		'base' : 'app/base-view',
		'baseLayout' : 'app/base-layout',
		'baseModel' : 'app/base-model',
		'relationalModel' : 'app/relational-model',
		'baseCollection' : 'app/base-collection',
		
		// core components path
		'formView': 'core/components/form/form-view',
		'dataTable':'core/components/data-table/grid',
		'Mediator': 'core/components/messaging/message'

	},

	map : {
		'*' : {
			'less' : 'libs/require-less/less', 
			'css': 'libs/require-css/css'
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
		
		'layoutManagers': ["backbone"],
		
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
	'Mediator',
	// bootstrap css file
	"css!libs/bootstrap/dist/css/bootstrap"
	], function(
	Backbone, 
	_, 
	$, 
	application,
	mediator
	) {
	$(document).ready(function() {
		App = {};
		App.routing = new application();
		Backbone.history.start({});
		// create Mediatior object for messaging
		App.Mediator = new mediator;		
	});
});
