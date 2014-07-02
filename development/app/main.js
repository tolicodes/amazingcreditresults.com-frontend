// main.js
// -------
// See requirejs.org/
// Requires `require`, `define`

require.config({
	urlArgs: "bust=" + (new Date()).getTime(),
	baseUrl : './',
	locale : 'en-us',
	config : {
		 text : {
			 useXhr : function(url, protocol, hostname, port) {
				 return true;
			 }
		 }
	},
	
	deps: ['application'],
	
	//packages : [
    //{ 
     //   name: 'application',
      //  location : '/',
      //  main : 'setup'
   // }
   //],
	
	paths : {
		// Libraries
		'backbone' : 'libs/backbone/backbone',
		'backboneValidator' : 'libs/backbone-validation/dist/backbone-validation-amd',		
		'underscore' : 'libs/underscore/underscore',
		'backboneRelational' : 'libs/backbone-relational/backbone-relational',
		'layoutManagers' : 'libs/layoutmanager/backbone.layoutmanager',
		"backboneForms": 'libs/backbone-forms/distribution.amd/backbone-forms',
		'jquery' : 'libs/jquery/jquery',
		'backgrid' : 'libs/backgrid/lib/backgrid',
		'pageableCollection' : 'libs/backbone-pageable/lib/backbone-pageable',
		'backgridPaginator' : 'libs/backgrid-paginator/backgrid-paginator',
		'backgridSelect' : 'libs/backgrid-select-all/backgrid-select-all',
		'backboneUploadModel' : 'libs/backbone-model-file-upload/backbone-model-file-upload',
		'jqueryUpload' : 'libs/blueimp-file-upload/js/jquery.fileupload',
		'jqueryUploadIframe' : 'libs/blueimp-file-upload/js/jquery.iframe-transport',
		'jquery.ui.widget': 'libs/blueimp-file-upload/js/vendor/jquery.ui.widget',
		'hbs' : 'libs/require-handlebars-plugin/hbs',
		'Handlebars': 'libs/handlebars/handlebars',
		'bootstrap' : 'libs/bootstrap/dist/js/bootstrap',
		'text' : 'libs/requirejs-text/text',

		// Should be used as required dependencies with use of `define`,
		'auth' : 'app/modules/auth',
		'buyer': 'app/modules/buyer',
		'inventory': 'app/modules/inventory',
		'grid' : 'app/modules/grid',
		'buyerDashboard': 'app/modules/buyer-dashboard',
		'adminSeller': 'app/modules/admin-seller',
		'adminLogin': 'app/modules/admin-login',
		'adminDashboard': 'app/modules/admin-dashboard',
		'adminManageOwner': 'app/modules/admin-owner',
		'adminManageBuyer': 'app/modules/admin-buyer',
		'adminProduct': 'app/modules/admin-product',
		'home' : 'app/modules/home',
		'questionnaire' : 'app/modules/questionnaire',
		'video' : 'app/modules/video',
		'cart' : 'app/modules/cart',
		'logout' : 'app/modules/logout',
		
		'cssPath' : 'app/common/css',
		
		'application' : 'app/app',
		'base' : 'app/base-view',
		'mainLayout' : 'app/modules/main-layout',
		'baseLayout' : 'app/base-layout',
		'baseModel' : 'app/base-model',
		'relationalModel' : 'app/relational-model',
		'baseCollection' : 'app/base-collection',
		
		'currentUser' : 'app/common/entities/current-user',
		
		// core components path
		'formView': 'core/components/form/form-view',
		'dataTable':'core/components/data-table/grid',
		'Mediator': 'core/components/messaging/message',
		
		
		/// common paths
		'dataPath': 'app/common/data'
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
		
		'backboneValidator': ["backbone"],
		
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
			deps : ['backbone', 'pageableCollection']
		},
		'backgridSelect' : {
			exports : 'backgridSelect',
			deps : ['backbone', 'backgrid']
		},
		'backboneUploadModel' : {
			exports : 'backboneUploadModel',
			deps : ['backbone']
		},
		'jqueryUpload' : {
			exports : 'jqueryUpload',
			deps : ['jquery']
		},
		'jqueryUploadIframe': {
			exports : 'jqueryUploadIframe',
			deps : ['jquery']			
		},
		'jquery.ui.widget': {
			exports : 'jquery.ui.widget',
			deps : ['jquery']			
		}

	},
	priority : [],
	jquery : '1.10.2',
	waitSeconds : 60
});

// initializing the router "application" on startup
// application.js

require([
	'backbone', 
	'underscore', 
	'jquery', 
	'application',
	'Mediator',
	'currentUser',
	// bootstrap css file
	"css!libs/bootstrap/dist/css/bootstrap"
	], function(
	Backbone, 
	_,
	$, 
	application,
	mediator,
	CurrentUser
	) {
	$(document).ready(function() {
		App = {};
		// create Mediatior object for messaging
		App.Mediator = new mediator;		
		App.CurrentUser = new CurrentUser();
		App.routing = new application();
		Backbone.history.start({});
	});
});
