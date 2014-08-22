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
			'render:before': 'getUserData'
		},
		getUserData: function(){
			console.log(this.templateData)
			_(this.templateData).extend({
				user: App.Auth.getUser().toJSON()
			});
		}
	});
});