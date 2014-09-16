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
			'collection:sync': ['checkEmpty', 'saveOriginal']
		},

		checkEmpty: function() {
			if (!this.collection.length) {
				this.$el.hide();
			}
		},

		saveOriginal: function(){
			this.original = this.collection.map(function(model){
				return model.get('_id');
			});
		},

		addAll: function() {
			_(this._collectionViews).each(function(view) {
				view.addToCart();
			});
		},

		removeFromList: function(model) {
			this.collection.remove(model);
		},

		addToList: function(model) {
			if(this.original.indexOf(model.get('_id')) !== -1) {
				this.collection.add(model);
			}
		}
	});
})