require.config({
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
		underscore: "../libs/underscore/underscore"
	},
	map: {
		"*": {
			less: "../libs/require-less/less"
		}
	},
	shim: {
		jquery: {
			exports: "$"
		}
	},
	packages: [

	]
});

require([
	'backbone',
	'router',

	// bootstrap css file
	"css!libs/bootstrap/dist/css/bootstrap"
], function(
	Backbone,
	router
) {

});