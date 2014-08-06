// list.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"dataTable"
], function(
	DataTable
) {

	return DataTable.extend({
		url: 'ownersList'
	});
});