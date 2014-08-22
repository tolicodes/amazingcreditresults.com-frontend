define([
	"core/mvc/layout",
	"hbs!common/layouts/login"
], function(
	Layout,
	loginTpl
) {
	return Layout.extend({
		className: 'container login-layout',
		tpl: loginTpl,
		noAuth: true
	});
});