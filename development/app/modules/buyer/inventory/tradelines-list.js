define([
	'core/mvc/list',
	'./tradeline-view',
	'hbs!./tradelines-list'
], function(
	List,
	TradelineView,
	tpl
){
	return List.extend({
		itemView: TradelineView,
		tpl: tpl,
		$listEl: '.list',
		hooks: {
			'M:addToCart': 'removeFromList',
			'M:removeFromCart': 'addToList'
		},
		removeFromList: function(model){
			this.collection.remove(model);
		},
		addToList: function(model){
			this.collection.add(model);
		}
	});
})