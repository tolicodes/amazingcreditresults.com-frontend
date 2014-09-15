define([
	'core/mvc/model',
], function(
	Model
) {
	return Model.extend({
		urls: {
			'create': 'manageProducts',
			'update': 'manageProduct',
			'delete': 'manageProduct'
		},

		schema: {
			'bank': 'Text',
			'name': 'Text',
			'type': {
				type: 'Select',
				options: ['American Express', 'Visa', 'MasterCard', 'Discover']
			},
			'totalAus': {
				type: 'Text'
			},
			reportsTo: {
				type: 'Checkboxes',
				options: ['Transunion', 'Equifax', 'Experian']
			},
			'notes': 'Text'
		},

		validation: {

		},

		toString: function(){
			return this.get('bank') + ' ' + this.get('name') + ' ' + this.get('type'); 
		}
	});
})