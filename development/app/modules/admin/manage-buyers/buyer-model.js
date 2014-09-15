define([
	'../manage-users/user-model'
], function(
	Model
) {
	return Model.extend({
		defaults: {
			roles: {
				seller: false,
				owner: false,
				buyer: true
			}
		},

		schema: function() {
			return _(Model.prototype.schema()).extend({
				'sendWelcomeEmail': 'Checkbox',
				'evsVerified': 'Checkbox',
				'phoneVerified': 'Checkbox'
			});
		}
	});
})