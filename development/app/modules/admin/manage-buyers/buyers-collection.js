define([
	'core/data-table/data-table-collection'
], function(
	Collection
){
	return Collection.extend({
		url: 'buyersList',
		columns: [{
			name: 'Name'
		}]
	});
});