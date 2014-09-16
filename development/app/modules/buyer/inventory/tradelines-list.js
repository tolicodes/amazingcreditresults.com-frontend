define([
	'core/mvc/list',
	'./tradeline-view',
	'hbs!./tradelines-list',
	'masonry'
], function(
	List,
	TradelineView,
	tpl,
	Masonry
) {
	return List.extend({
		itemView: TradelineView,
		tpl: tpl,
		$listEl: '.list',
		hooks: {
			'M:addToCart': 'removeFromList',
			'M:removeFromCart': 'addToList',
			'appendInDom:after': 'applyMasonry',
			'appendItem:after': 'itemAdded',
			'removeItem:before': 'itemRemoved'
		},

		itemAdded: function(view) {
			this.masonry.appended(view.el);
			this.masonry.layout();

		},

		itemRemoved: function(view) {
			this.masonry.remove(view.el);
			this.masonry.layout();

		},

		applyMasonry: function() {

			if (this.masonry) {
				this.masonry.layout();
				return;
			}

			var $list = this.$(this.$listEl);

			this.masonry = new Masonry($list[0], {
				itemSelector: '.tradeline-container'
			});
		},
		removeFromList: function(model) {
			this.collection.remove(model);
		},
		addToList: function(model) {
			this.collection.add(model);
		}
	});
})