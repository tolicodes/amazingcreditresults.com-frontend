define([
	'backbone.paginator',
	'./modelCollectionMixins',
	'./model'
], function(
	PageableCollection,
	modelCollectionMixins,
	Model
){
	var Collection = PageableCollection.extend({
		model: Model,
		mode: "client",
		hasPrevious: function(){
			return this.hasPreviousPage();
		},
		hasNext: function(){
			return this.hasNextPage();
		}
	});

	return modelCollectionMixins.mixInto(Collection);
});