define([
	'core/mvc/model'
], function(
	model
){
	return model.extend({
		url: 'buyerSetPassword',

		schema: {
			'password': {
				type: 'Password',
				title: 'Password'
			},
			'passwordConfirm': {
				type: 'Password',
				title: 'Confirm Password'
			}
		},
		validation: {
			password: {
				required: true
			},
			passwordConfirm: {
				required: true,
				equalTo: 'password'
			}
		}
	});
});