// list.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"app/common/components/user-table/views/user-table"
], function(
	DataTable
) {

	return DataTable.extend({
		url: 'buyersList'
	});
});
