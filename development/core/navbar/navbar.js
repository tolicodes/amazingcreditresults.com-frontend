define([
	'core/mvc/view',
	'core/app/app'
], function(
	view,
	App
){
	return view.extend({
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