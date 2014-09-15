define([
	'core/mvc/model',
	'../manage-products/product-collection'
], function(
	model,
	ProductCollection
) {
	return model.extend({
		defaults: {
			active: true
		},

		urls: {
			'create': 'adminTradelines',
			'update': 'adminTradelinesModify',
			'delete': 'adminTradelinesModify'
		},

		schema: function() {
			this._products = this._products || new ProductCollection; 

			return {
				'product': {
					title: 'Lender',
					type: 'Select',
					options: this._products
				},
				'cost': {
					title: 'Paid To Seller',
					type: 'Currency'
				},
				'price': {
					title: 'Price To Buyer',
					type: 'Currency'
				},

				'creditLimit': {
					title: 'Limit',
					type: 'Currency'
				},

				'dateOpen': {
					title: 'Date Open',
					type: 'DatePicker'
				},

				'statementDate': {
					title: 'Statement Day'
				},

				'tier': {
					title: 'Tier',
					type: 'Select',
					options: ['1', '2', '3']
				},

				'balance': {
					title: 'Balance',
					type: 'Currency'
				},
				
				'currentAus': {
					title: 'Current AUs'
				},
				
				'totalAus': {
					title: 'Total AUs'
				},

				'active': {
					title: 'Active',
					type: 'Checkbox'
				}
			};
		}
	});
})