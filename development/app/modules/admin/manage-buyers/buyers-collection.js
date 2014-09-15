define([
	'core/data-table/data-table-collection',
	'./buyer-model'
], function(
	Collection,
	UserModel
){
	return Collection.extend({
		url: 'buyersList',
		model: UserModel
	});
});