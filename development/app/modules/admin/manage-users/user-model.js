define([
	'core/mvc/model',
	"common/data/collections/states"
], function(
	Model,
	states
) {
	return Model.extend({
		schema: function() {
			this._states = this._states || new states;

			return {
				'name.title': {
					type: 'Select',
					options: ['Mr', 'Mrs', 'Ms'],
					title: 'Title'
				},
				'name.givenName': {
					type: 'Text',
					title: 'First Name'
				},
				'name.middleName': {
					type: 'Text',
					title: 'M. I.'
				},
				'name.familyName': {
					type: 'Text',
					title: 'Last Name'
				},
				'name.generation': {
					type: 'Select',
					options: ['', 'JR', 'SR', 'III', 'IV', 'V'],
					title: 'Generation'
				},
				'birthday': {
					type: 'DatePicker',
					title: 'Date of Birth'
				},
				
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
				'email': {
					type: 'Text',
					title: 'Email Address'
				},
				'phone': {
					type: 'Phone',
					title: 'Phone'
				}
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