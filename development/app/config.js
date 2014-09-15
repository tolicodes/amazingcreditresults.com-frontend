require.config({
	deps: [
		"main"
	],
	baseUrl: "app/",
	paths: {
		dataPath: "app/common/data",
		libs: "../libs",
		core: "../core",
		backbone: "../libs/backbone/backbone",
		requirejs: "../libs/requirejs/require",
		jquery: "../libs/jquery/dist/jquery",
		css: "../libs/require-css/css",
		"css-builder": "../libs/require-css/css-builder",
		normalize: "../libs/require-css/normalize",
		bootstrap: "../libs/bootstrap/dist/js/bootstrap",
		underscore: "../libs/underscore/underscore",
		"backbone-forms": "../libs/backbone-forms/distribution.amd/backbone-forms",
		less: "../libs/less/dist/less-1.7.4",
		marionette: "../libs/marionette/lib/core/backbone.marionette",
		"require-handlebars-plugin": "../libs/require-handlebars-plugin/hbs",
		hbs: "../libs/requirejs-hbs/hbs",
		handlebars: "../libs/handlebars/handlebars",
		"hbs-builder": "../libs/requirejs-hbs/hbs-builder",
		"requirejs-text": "../libs/requirejs-text/text",
		"backbone-validation": "../libs/backbone-validation/dist/backbone-validation",
		moment: "../libs/moment/moment",
		"moment-duration-format": "../libs/moment-duration-format/lib/moment-duration-format",
		"backbone.paginator": "../libs/backbone.paginator/lib/backbone.paginator",
		"backgrid-paginator": "../libs/backgrid-paginator/backgrid-paginator",
		backgrid: "../libs/backgrid/lib/backgrid",
		"backbone-deep-model": "../libs/backbone-deep-model/distribution/deep-model",
		"bootstrap-datepicker": "../libs/bootstrap-datepicker/js/bootstrap-datepicker",
		"jquery-color": "../libs/jquery-color/jquery.color",
		"numeral": "../libs/numeral/numeral",
		"backgrid-select2-cell": "../libs/backgrid-select2-cell/backgrid-select2-cell",
		"select2": "../libs/select2/select2"
	},
	map: {
		"*": {
			less: "../libs/require-less/less",
			text: "requirejs-text",
			form: "core/form/form-view"
		}
	},
	shim: {
		"moment-duration-format": {
			deps: [
				"moment"
			]
		},
		"bootstrap-datepicker": {
			deps: [
				"jquery"
			]
		},
		"jquery-color": {
			deps: ['jquery']
		},
		bootstrap: {
			deps: [
				"jquery"
			]
		},
		backgrid: {
			deps: [
				"backbone",
				"css!./backgrid"
			]
		},
		"backbone-deep-model": {
			deps: [
				"backbone"
			]
		},
		"backbone-validation": {
			deps: [
				"backbone"
			]
		},
		handlebars: {
			exports: "Handlebars"
		},
		"backgrid-paginator": {
			deps: [
				"backgrid",
				"backbone.paginator"
			]
		},
		backbone: {
			exports: "Backbone",
			deps: [
				"underscore",
				"jquery"
			]
		},
		jquery: {
			exports: "$"
		},
		"backgrid-select2-cell": {
			deps: ['backgrid', 'select2', 'css!backgrid-select2-cell/../backgrid-select2-cell']
		},
		'select2': {
			deps: ['css!select2/../select2']
		}
	},
	packages: [

	]
});