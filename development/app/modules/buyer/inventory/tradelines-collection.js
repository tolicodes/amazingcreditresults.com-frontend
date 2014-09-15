define([
	'core/mvc/collection'
], function(
	Collection
){
	return Collection.extend({
		autoFetch: true,
		url: 'tradelinesList',
		dataKey: 'data'
	});
})