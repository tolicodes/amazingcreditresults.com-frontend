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
		},

		parse: function(data){
			if(this.dataKey) {
				data = data[this.dataKey];
			}

			if(this.options.where) {
				data = _(data).where(this.options.where);
			}

			if(this.options.limit) {
				data = data.slice(0, this.options.limit)
			}

			return data;
		},
		
		state: {
			pageSize: 100000
		}
	});

	return modelCollectionMixins.mixInto(Collection);
});