define([
	'core/mvc/model'
], function(
	Model
){
	return Model.extend({
		schema: {
			title: { type: 'Select', options: ['Mr', 'Mrs', 'Ms'] },
			'name.givenName': { type: 'Text', title: 'First Name' },
			'name.familyName': { type: 'Text', title: 'Last Name' },
			'email': 'Text',
			'ssn': { type: 'SSN', title: 'SSN' },
			'street1': { type: 'Text', title: 'Address' },
			'city': 'Text',
			'state': { type: 'Select', options: ['NY'] },
			'zip': 'Text',
			'phone': 'Phone',
			'dob': 'DatePicker',
			'welcome-email': 'Checkbox'
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
		}
	});	
})