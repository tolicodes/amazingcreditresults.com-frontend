define([
	'../manage-users/user-model'
], function(
	Model
) {
	return Model.extend({
		defaults: {
			roles: {
				seller: true,
				owner: false,
				buyer: false
			}
		}
	});
})