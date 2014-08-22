define([
	'form',
	'./loginModel',
	'hbs!./loginTpl',
	'core/app/app'
], function(
	Form,
	loginModel,
	loginTpl,
	App
){
	return Form.extend({
		className: "row well col-md-6 col-md-offset-3",
		
		formModel: loginModel,

		tpl: loginTpl,
		
		hooks: {
			'form:submit:success': ['saveSessionKey', 'redirectToDashboard']
		},

		saveSessionKey: function(model) {
			App.SessionKey.setSessionKey(model.get('huntKey'));
		},

		redirectToDashboard: function(){
			App.Router.navigate('admin/dashboard', {trigger: true});
		},
		
		options: {
			templateData: {
				submitButton: 'Login'
			}
		}
	});
});