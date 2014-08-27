define([
	'core/data-table/data-table-collection',
	'./buyer-model'
], function(
	Collection,
	BuyerModel
){
	return Collection.extend({
		url: 'buyersList',
		model: BuyerModel,
		parse: function(){
			return _(Collection.prototype.parse.apply(this, arguments)).filter(function(m){
				return m.roles.buyer;
			});
		}
	});
});