define([
	'form',
	'./register-model',
	'hbs!./register'
], function(
	Form,
	registerModel,
	registerTpl
){
	return Form.extend({
		options: {
			templateData: {
				submitButton: 'Login'
			},
			renderOn: ''
		},

		className: "buyer-set-password row well col-md-6 col-md-offset-3",
		
		FormModel: registerModel,

		tpl: registerTpl,

		$formEl: '.form',
		
		hooks: {
			'form:submit:success': ['doLogin']
		},

		doLogin: function(){
			this.trigger('userRegistered', 
				this.model.get('apiKey'), 
				this.model.get('password')
			)
		}
	});
});