define([
	'form',
	'./login-model',
	'hbs!./login',
	'core/app/app'
], function(
	Form,
	loginModel,
	loginTpl,
	App
){
	return Form.extend({
		className: "buyer-login row well col-md-6 col-md-offset-3",
		
		FormModel: loginModel,

		options: {
			templateData: {
				submitButton: 'Login'
			},
			renderOn: ''
		},

		tpl: loginTpl,

		$formEl: '.form',
		
		hooks: {
			'model:sync': ['saveSessionKey', 'redirectToDashboard']
		},

		doLogin: function(welcomeKey, password) {
			this.model = new this.FormModel;
			this.relayTriggers('model');

			this.model.save({
				apiKey: welcomeKey,
				password: password
			});
		},

		saveSessionKey: function() {
			App.SessionKey.setSessionKey(this.model.get('huntKey'));
		},

		redirectToDashboard: function(){
			App.Router.navigate('inventory', {trigger: true});
		}
	});
});