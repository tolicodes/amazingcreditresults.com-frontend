define([
	"core/mvc/layout",
	"hbs!./buyer"
], function(
	Layout,
	tpl
) {
	return Layout.extend({
		className: 'container buyer-layout',
		tpl: tpl
	});
});