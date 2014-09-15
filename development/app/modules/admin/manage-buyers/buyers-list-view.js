define([
	'core/data-table/data-table',
	'./buyers-collection',
	'./action-buttons'
], function(
	DataTable,
	Collection,
	ActionButtonsCell
){
	return DataTable.extend({
		Collection: Collection,
		columns: [{
			label: "First Name",
			name: "name.givenName",
			cell: "string"
		}, {
			label: "Last Name",
			name: "name.familyName",
			cell: "string"
			
		}, {
			label: "Phone",
			name: "phone",
			cell: "string"
		}, {
			label: "Email",
			name: "email",
			cell: "string"
		},  {
			label: "Actions",
			cell: ActionButtonsCell,
			editable: false
		}]
	});
})