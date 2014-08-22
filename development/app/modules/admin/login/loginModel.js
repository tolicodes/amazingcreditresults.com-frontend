define([
	'core/mvc/model'
], function(
	model
) {
	return model.extend({
		schema: {
			username: 'Text',
			password: 'Password'
		},

		validation: {
			username: {
				required: true,
				pattern: 'email'
			},
			password: {
				required: true
			}
		},

		url: 'adminLogin'
	});
});