define([
	'core/mvc/list',
	'./tradeline-view',
	'hbs!./cart'
], function(
	list,
	TradelineView,
	tpl
){
	return list.extend({
		tpl: tpl,

		$listEl: '.list',

		itemView: TradelineView,

		hooks: {
			'render:after': 'updateTotal',
			'M:addToCart': ['addToCart', 'updateTotal'],
			'M:removeFromCart': ['updateTotal'],
			'collection:sync': 'updateTotal'
		},

		addToCart: function(model) {
			model = this.collection.add(model.toJSON());

			model.save();
		},
		updateTotal: function(){
			var total = this.collection.reduce(function(memo, model){
				return memo + model.get('price')
			}, 0);

			if(!total) {
				this.$('.total').text('Your Cart Is Empty');
				this.$('.checkout').prop('disabled', true);
			} else {
				this.$('.total').html('<strong>Total</strong>: ' + numeral(total).format('$0,'));
				this.$('.checkout').prop('disabled', false);
			}
		}
	})
})