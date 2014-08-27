define([
	'core/mvc/model',
	"common/data/collections/states"
], function(
	Model,
	states
) {
	return Model.extend({
		defaults: {
			roles: {
				buyer: true
			}
		},

		schema: function() {
			this._states = this._states || new states;
			return {
				title: {
					type: 'Select',
					options: ['Mr', 'Mrs', 'Ms']
				},
				'name.givenName': {
					type: 'Text',
					title: 'First Name'
				},
				'name.familyName': {
					type: 'Text',
					title: 'Last Name'
				},
				'email': 'Text',
				'ssn': {
					type: 'SSN',
					title: 'SSN'
				},
				'street1': {
					type: 'Text',
					title: 'Address'
				},
				'city': 'Text',
				'state': {
					type: 'Select',
					options: this._states
				},
				'zip': 'Text',
				'phone': 'Phone',
				'birthday': 'DatePicker',
				'welcome-email': 'Checkbox'
			};
		},
		validation: {
			'name.givenName': {
				required: true
			},

			'name.familyName': {
				required: true
			},

			'email': {
				required: true,
				pattern: 'email'
			}
		},

		urls: {
			'create': 'createClient',
			'update': 'adminClients',
			'delete': 'adminClients',
			'read': 'adminClients'
		},

		syncMessages: {
			'create': 'User Created Successfully!',
			'update': 'Updated User Successfully!'
		}
	});
})