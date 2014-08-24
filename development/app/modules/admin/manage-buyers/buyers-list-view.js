define([
	'core/data-table/data-table',
	'./buyers-collection'
], function(
	DataTable,
	buyersCollection
){
	return DataTable.extend({
		Collection: new buyersCollection
	});
})