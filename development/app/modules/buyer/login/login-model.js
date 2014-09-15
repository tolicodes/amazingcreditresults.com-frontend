define([
	'core/mvc/model'
], function(
	model
){
	return model.extend({
		url: 'buyerLogin',

		schema: {
			'password': {
				type: 'Password',
				title: 'Password'
			}
		},
		validation: {
			password: {
				required: true
			}
		}
	});
});