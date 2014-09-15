define([
	'./tradelines-list',
	'./tradeline-view',
	'hbs!./recommendations'
], function(
	List,
	TradelineView,
	tpl
) {
	return List.extend({
		itemView: TradelineView,

		tpl: tpl,

		$listEl: '.list',

		events: {
			'click .add-all': 'addAll'
		},

		hooks: {
			'collection:sync': 'checkEmpty'
		},

		checkEmpty: function() {
			if (!this.collection.length) {
				this.$el.hide();
			}
		},

		addAll: function() {
			_(this._collectionViews).each(function(view) {
				view.addToCart();
			});
		}
	});
})