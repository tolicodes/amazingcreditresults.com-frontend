define([
	'form',
	'./loginModel',
	'hbs!./loginTpl'
], function(
	Form,
	loginModel,
	loginTpl
){
	return Form.extend({
		className: "row well col-md-6 col-md-offset-3",
		
		formModel: loginModel,

		tpl: loginTpl,
		
		hooks: {
			'form:submit:success': 'redirectToDashboard'
		},

		redirectToDashboard: function(){
			
		},
		
		options: {
			templateData: {
				submitButton: 'Login'
			}
		}
	});
});