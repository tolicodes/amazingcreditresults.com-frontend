define([
	'core/data-table/data-table-collection',
	'./owner-model'
], function(
	Collection,
	Model
){
	return Collection.extend({
		url: 'ownersList',
		model: Model,
		parse: function(data) {
			return _(Collection.prototype.parse(data)).where({
				isBanned: false
			});
		}
	});
});