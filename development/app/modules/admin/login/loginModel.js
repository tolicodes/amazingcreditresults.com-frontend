define([
	'core/mvc/model'
], function(
	model
) {
	return model.extend({
		/**
		 * We don't want any ID attribute so it will always
		 * do a POST
		 * @type {String}
		 */
		idAttribute: 'na',

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