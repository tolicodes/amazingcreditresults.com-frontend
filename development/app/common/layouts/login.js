define([
	"core/mvc/layout",
	"hbs!./login"
], function(
	Layout,
	loginTpl
) {
	return Layout.extend({
		className: 'container login-layout',
		tpl: loginTpl,
		noAuthentication: true,
		hooks: {
			'initialize:before': 'triggerLogout'
		},
		triggerLogout: function(){
			this.Mediator.trigger('logout');
		}
	});
});