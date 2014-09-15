define([
	'core/data-table/data-table-collection',
	'./tradeline-model'
], function(
	Collection,
	Model
){
	return Collection.extend({
		url: 'adminTradelines',
		model: Model
	});
});