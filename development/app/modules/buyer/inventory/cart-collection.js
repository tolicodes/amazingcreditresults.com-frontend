define([
	'./tradelines-collection',
	'core/mvc/model'
], function(
	collection,
	model
){
	return collection.extend({
		url: 'cart',
		model: model.extend({
			idAttribute: 'no',
			urls: {
				'create': 'addCart',
				'delete': 'removeCart'
			}
		})
	})
});