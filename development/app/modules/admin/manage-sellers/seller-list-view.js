define([
	'../manage-users/user-list-view',
	'./sellers-collection',
	'core/data-table/action-buttons-cell'
], function(
	DataTable,
	Collection,
	ActionButtonsCell
){
	return DataTable.extend({
		Collection: Collection,
		columns: DataTable.prototype.columns.concat([{
			sortable: false,
			editable: false,
			label: "Actions",
			cell: ActionButtonsCell.extend({
				resourceName: 'user'
			})
		}])
	});
})