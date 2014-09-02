define([
	'core/data-table/data-table-collection',
	'./seller-model'
], function(
	Collection,
	Model
){
	return Collection.extend({
		url: 'sellersList',
		model: Model
	});
});