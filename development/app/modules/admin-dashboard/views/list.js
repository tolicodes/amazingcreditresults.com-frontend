// list.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"app/common/components/user-table/views/user-table"
], function(
	userTable
) {
	return userTable.extend({
		url: 'userList'
	})
});