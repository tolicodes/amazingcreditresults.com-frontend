define([
	'core/data-table/data-table',
	'./product-collection',
	'core/data-table/action-buttons-cell'
], function(
	DataTable,
	Collection,
	ActionButtonsCell
){
	return DataTable.extend({
		Collection: Collection,
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