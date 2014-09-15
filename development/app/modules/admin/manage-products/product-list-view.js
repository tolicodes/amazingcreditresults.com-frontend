define([
	'core/data-table/data-table',
	'core/data-table/action-buttons-cell',
	'./product-collection',
	'backgrid-select2-cell'
], function(
	DataTable,
	ActionButtonsCell,
	ProductCollection,
	Select2Cell
){
	return DataTable.extend({
		Collection: ProductCollection,
		hooks: {
			'M:create-product': 'addToCollection'
		},

		addToCollection: function(model){
			this.collection.add(model);
		},

		columns: [{
			name: 'bank',
			label: 'Bank',
			cell: 'string'
		}, {
			name: 'name',
			label: 'Product Name',
			cell: 'string'
		}, {
			name: 'type',
			label: 'Type',
			cell: Backgrid.Extension.Select2Cell.extend({
				optionValues: ['Visa', 'MasterCard', 'American Express', 'Discover'].map(function(val){
					return [val, val];
				})
			})
		}, {
			name: 'reportsTo',
			label: 'Reports To',
			cell: Backgrid.Extension.Select2Cell.extend({
				optionValues: ['Transunion', 'Equifax', 'Experian'].map(function(val){
					return [val, val];
				}),
				multiple: true
			})
		}, {
			name: 'totalAus',
			label: 'Total AUs',
			cell: 'string'
		}, {
			name: 'notes',
			label: 'Notes',
			cell: 'string'
		}, {
			sortable: false,
			editable: false,
			label: "Actions",
			cell: ActionButtonsCell.extend({
				resourceName: 'product'
			})
		}]
	});
})