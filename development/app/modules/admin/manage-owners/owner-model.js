define([
	'core/mvc/model',
], function(
	Model
) {
	return Model.extend({
		url: 'manageOwner',
		defaults: {
			roles: {
				seller: false,
				owner: true,
				buyer: false
			}
		},
		schema: {
			'name.givenName': {
				type: 'Text',
				title: 'First Name'
			},
			'name.familyName': {
				type: 'Text',
				title: 'Last Name'
			},
			'username': {
				type: 'Text',
				title: 'Username (Email Address)'
			},
			'phone': {
				type: 'Phone',
				title: 'Phone'
			},
			'password': {
				type: 'Password',
				title: 'Password'
			},
			'passwordConfirm': {
				type: 'Password',
				title: 'Confirm Password'
			}
		},

		validation: function() {
			var validation = {
				'name.givenName': {
					required: true
				},
				'name.familyName': {
					required: true
				},
				username: {
					required: true,
					pattern: 'email'
				}
			};

			if (this.isNew()) {
				_(validation).extend({
					password: {
						required: true
					},
					passwordConfirm: {
						required: true,
						equalTo: 'password'
					}
				});
			}

			return validation;
		},
		urls: {
			'create': 'manageOwner',
			'read': 'manageOwner',
			'update': 'modifyOwner',
			'delete': 'modifyOwner'
		}
	});
})