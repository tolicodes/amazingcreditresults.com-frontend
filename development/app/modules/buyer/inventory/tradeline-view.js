define([
	'core/mvc/view',
	'hbs!./tradeline',
	'common/formatters',
	'modules/admin/manage-sellers/tradelines-list'
], function(
	view,
	tradelineTpl,
	formatters,
	tradelinesList
){
	return view.extend({
		tpl: tradelineTpl,
		hooks: {
			'appendTemplate:before': ['formatData', 'addBgColor']
		},

		events: {
			'click .add-to-cart': 'addToCart',
			'click .remove-from-cart': 'removeFromCart',
		},

		className: 'tradeline-container',

		addToCart: function(){
			this.model.collection.remove(this.model);

			this.model.set({
				inCart: true
			});

			this.Mediator.trigger('addToCart', this.model);
		},

		removeFromCart: function(){
			this.model.idAttribute = 'id';

			this.model.destroy();

			this.model.set({
				inCart: false
			});

			this.Mediator.trigger('removeFromCart', this.model);
		},

		getFormatter: function(field, data) {
			return _(tradelinesList.prototype.columns)
				.findWhere({label: field})
				.formatter.fromRaw(data, this.model);
		},

		formatData: function(data){
			var logoMap = {
				'MasterCard': 'mastercard',
				'American Express': 'amex',
				'Visa': 'visa',
				'Discover': 'discover'
			};

			_(data).extend({
				creditLimit: this.getFormatter('Limit', data.creditLimit),
				logo: logoMap[data.product.type],
				lineAge: this.getFormatter('Line Age', data.lineAge),
				price: this.getFormatter('Price To Buyer', data.price),
				statementDate: this.getFormatter('Statement Day', data.statementDate),
				availableAus: this.getFormatter('AUs Available', data.usedAus),
			});
		},

		addBgColor: function(){
			var color = ['#ccac00', '#CCCCCC', '#cd7f32'];

			this.$el.css('backgroundColor', color[this.model.get('tier') - 1]);
		}
	});
});