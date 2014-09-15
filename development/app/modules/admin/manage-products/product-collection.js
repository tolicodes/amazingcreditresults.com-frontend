define([
	'core/data-table/data-table-collection',
	'./product-model'
], function(
	Collection,
	Model
){
	return Collection.extend({
		url: 'manageProducts',
		model: Model
	});
});