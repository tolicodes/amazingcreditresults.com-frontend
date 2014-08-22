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
		"backbone-validation": "../libs/backbone-validation/dist/backbone-validation"
	},
	map: {
		"*": {
			less: "../libs/require-less/less",
			text: "requirejs-text",
			form: "core/form/form-view"
		}
	},
	shim: {
		handlebars: {
			exports: "Handlebars"
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
		}
	},
	packages: [

	]
});