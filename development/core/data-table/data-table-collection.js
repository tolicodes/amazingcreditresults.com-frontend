define([
	'core/mvc/collection'
], function(
	Collection
){
	return Collection.extend({
		parse: function(data) {
			return data.data;
		},
		state: {
			pageSize: 10
		}
	});	
});