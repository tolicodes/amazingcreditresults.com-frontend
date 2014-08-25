define([
	'core/data-table/data-table',
	'./buyers-collection'
], function(
	DataTable,
	BuyersCollection
){
	return DataTable.extend({
		Collection: BuyersCollection
	});
})