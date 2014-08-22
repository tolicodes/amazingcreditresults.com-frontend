define([
	"core/mvc/layout",
	"hbs!./admin",
	"modules/admin/navbar/navbar"
], function(
	Layout,
	adminTpl,
	NavbarView
) {
	return Layout.extend({
		className: 'container admin-layout',
		tpl: adminTpl,
		hooks: {
			'render:after': 'setupViews'
		},

		setupViews: function(){
			this.addView('.navbar', new NavbarView);
		}
	});
});