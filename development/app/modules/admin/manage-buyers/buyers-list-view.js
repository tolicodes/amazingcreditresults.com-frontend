define([
	'core/data-table/data-table',
	'./buyers-collection',
	'./action-buttons'
], function(
	DataTable,
	BuyersCollection,
	ActionButtonsCell
){
	return DataTable.extend({
		Collection: BuyersCollection,
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
		}, {
			sortable: false,
			label: "Verified",
			name: "accountVerified",
			cell: "boolean",
			editable: false
		}, {
			label: "Actions",
			cell: ActionButtonsCell,
			editable: false
		}]
	});
})