define([
	'core/mvc/view',
	'hbs!./navbar',
	'core/app/app'
], function(
	view,
	tpl,
	App
){
	return view.extend({
		tpl: tpl,
		className: 'navbar navbar-default',
		hooks: {
			'render:before': 'getUserData',
			'M:router:route:after': 'highlightActive'
		},

		highlightActive: function(route){
			this.$('.nav > li.active').removeClass('active');
			this.$('.nav > li a[href="#/' + route +'"]').parent().addClass('active');
		},

		getUserData: function(){
			_(this.templateData).extend({
				user: App.Auth.getUser().toJSON()
			});
		}
	});
});