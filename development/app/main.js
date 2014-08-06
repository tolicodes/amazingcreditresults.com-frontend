// main.js
// -------
// See requirejs.org/
// Requires `require`, `define`

require.config({
	urlArgs: "bust=1407176645869",
	baseUrl: "./",
	locale: "en-us",
	config: {
		text: {
			useXhr: function (url, protocol, hostname, port) {
	return true;
}
		}
	},
	paths: {
		backbone: "../libs/backbone/backbone",
		backboneValidator: "libs/backbone-validation/dist/backbone-validation-amd",
		underscore: "../libs/underscore/underscore",
		backboneRelational: "libs/backbone-relational/backbone-relational",
		layoutManagers: "libs/layoutmanager/backbone.layoutmanager",
		backboneForms: "libs/backbone-forms/distribution.amd/backbone-forms",
		jquery: "../libs/jquery/jquery",
		backgrid: "../libs/backgrid/lib/backgrid",
		pageableCollection: "libs/backbone.paginator/lib/backbone.paginator",
		backgridPaginator: "libs/backgrid-paginator/backgrid-paginator",
		backgridSelect: "libs/backgrid-select-all/backgrid-select-all",
		backboneUploadModel: "libs/backbone-model-file-upload/backbone-model-file-upload",
		jqueryUpload: "libs/blueimp-file-upload/js/jquery.fileupload",
		jqueryUploadIframe: "libs/blueimp-file-upload/js/jquery.iframe-transport",
		"jquery.ui.widget": "../libs/blueimp-file-upload/js/vendor/jquery.ui.widget",
		hbs: "libs/require-handlebars-plugin/hbs",
		Handlebars: "libs/handlebars/handlebars",
		bootstrap: "../libs/bootstrap/dist/js/bootstrap",
		text: "libs/requirejs-text/text",
		auth: "app/modules/auth",
		buyer: "app/modules/buyer",
		inventory: "app/modules/inventory",
		grid: "app/modules/grid",
		buyerDashboard: "app/modules/buyer-dashboard",
		adminSeller: "app/modules/admin-seller",
		adminLogin: "app/modules/admin-login",
		adminDashboard: "app/modules/admin-dashboard",
		adminManageOwner: "app/modules/admin-owner",
		adminManageBuyer: "app/modules/admin-buyer",
		adminProduct: "app/modules/admin-product",
		home: "app/modules/home",
		questionnaire: "app/modules/questionnaire",
		video: "app/modules/video",
		cart: "app/modules/cart",
		logout: "app/modules/logout",
		cssPath: "app/common/css",
		application: "app/app",
		base: "app/base-view",
		mainLayout: "app/modules/main-layout",
		baseLayout: "app/base-layout",
		baseModel: "app/base-model",
		relationalModel: "app/relational-model",
		baseCollection: "app/base-collection",
		currentUser: "app/common/entities/current-user",
		formView: "core/components/form/form-view",
		dataTable: "core/components/data-table/grid",
		Mediator: "core/components/messaging/message",
		dataPath: "app/common/data",
		"backbone-forms": "../libs/backbone-forms/distribution/backbone-forms",
		"backbone-model-file-upload": "../libs/backbone-model-file-upload/backbone-model-file-upload",
		"backbone-relational": "../libs/backbone-relational/backbone-relational",
		"backbone-validation": "../libs/backbone-validation/dist/backbone-validation",
		"backbone-validator": "../libs/backbone-validator/backbone-validator",
		"backbone.paginator": "../libs/backbone.paginator/lib/backbone.paginator",
		"backgrid-paginator": "../libs/backgrid-paginator/backgrid-paginator",
		"backgrid-select-all": "../libs/backgrid-select-all/backgrid-select-all",
		"jquery.postmessage-transport": "../libs/blueimp-file-upload/js/cors/jquery.postmessage-transport",
		"jquery.xdr-transport": "../libs/blueimp-file-upload/js/cors/jquery.xdr-transport",
		"jquery.fileupload": "../libs/blueimp-file-upload/js/jquery.fileupload",
		"jquery.fileupload-process": "../libs/blueimp-file-upload/js/jquery.fileupload-process",
		"jquery.fileupload-validate": "../libs/blueimp-file-upload/js/jquery.fileupload-validate",
		"jquery.fileupload-image": "../libs/blueimp-file-upload/js/jquery.fileupload-image",
		"jquery.fileupload-audio": "../libs/blueimp-file-upload/js/jquery.fileupload-audio",
		"jquery.fileupload-video": "../libs/blueimp-file-upload/js/jquery.fileupload-video",
		"jquery.fileupload-ui": "../libs/blueimp-file-upload/js/jquery.fileupload-ui",
		"jquery.fileupload-jquery-ui": "../libs/blueimp-file-upload/js/jquery.fileupload-jquery-ui",
		"jquery.fileupload-angular": "../libs/blueimp-file-upload/js/jquery.fileupload-angular",
		"jquery.iframe-transport": "../libs/blueimp-file-upload/js/jquery.iframe-transport",
		handlebars: "../libs/handlebars/handlebars",
		layoutmanager: "../libs/layoutmanager/backbone.layoutmanager",
		css: "../libs/require-css/css",
		"css-builder": "../libs/require-css/css-builder",
		normalize: "../libs/require-css/normalize",
		"require-handlebars-plugin": "../libs/require-handlebars-plugin/hbs",
		requirejs: "../libs/requirejs/require",
		"requirejs-text": "../libs/requirejs-text/text",
		select2: "../libs/select2/select2",
		"backbone-deep-model": "../libs/backbone-deep-model/index",
		"backbone-pageable": "../libs/backbone-pageable/lib/backbone-pageable"
	},
	map: {
		"*": {
			less: "libs/require-less/less",
			css: "libs/require-css/css"
		}
	},
	shim: {
		jquery: {
			exports: "$"
		},
		facade: {
			deps: [
				"jquery"
			]
		},
		underscore: {
			exports: "_",
			deps: [
				"jquery"
			]
		},
		backbone: {
			deps: [
				"underscore",
				"jquery"
			],
			exports: "Backbone"
		},
		backboneValidator: [
			"backbone"
		],
		layoutManagers: [
			"backbone"
		],
		backgrid: {
			exports: "Backgrid",
			deps: [
				"backbone"
			]
		},
		pageableCollection: {
			exports: "PageableCollection",
			deps: [
				"backbone"
			]
		},
		backgridPaginator: {
			exports: "BackgridPaginator",
			deps: [
				"backbone",
				"pageableCollection"
			]
		},
		backgridSelect: {
			exports: "backgridSelect",
			deps: [
				"backbone",
				"backgrid"
			]
		},
		backboneUploadModel: {
			exports: "backboneUploadModel",
			deps: [
				"backbone"
			]
		},
		jqueryUpload: {
			exports: "jqueryUpload",
			deps: [
				"jquery"
			]
		},
		jqueryUploadIframe: {
			exports: "jqueryUploadIframe",
			deps: [
				"jquery"
			]
		},
		"jquery.ui.widget": {
			exports: "jquery.ui.widget",
			deps: [
				"jquery"
			]
		}
	},
	priority: [

	],
	jquery: "1.10.2",
	waitSeconds: 60,
	packages: [

	]
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