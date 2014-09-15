define([
	'core/mvc/view',
	'hbs!./logout'
], function(
	view,
	tpl
){
	return view.extend({
		tpl: tpl,
		hooks: {
			'initialize:before': 'triggerLogout'
		},
		triggerLogout: function(){
			this.Mediator.trigger('logout');
		}
	})
});