define([
	'backbone.paginator',
	'./model'
], function(
	PageableCollection,
	Model
){
	return PageableCollection.extend({
		model: Model
	});
});