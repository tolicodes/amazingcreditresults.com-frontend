define([
	'core/data-table/data-table'
], function(
	DataTable
){
	return DataTable.extend({
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
		}]
	});
})