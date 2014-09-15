define([
	'core/mvc/view',
	'./tradelines-list',
	'./tradelines-collection',
	'./cart-collection',
	'./cart',
	'./recommendations-view',
	'hbs!./inventory'
], function(
	view,
	TradelinesList,
	TradelinesCollection,
	CartCollection,
	CartView,
	RecommendationsView,
	tpl
){
	return view.extend({
		tpl: tpl,

		className: 'inventory',

		views: {
			'.recommendations': function(){
				var tier = window.location.hash.match(/tier-(\d+)/),
					limit = window.location.hash.match(/limit-(\d+)/);

				if(!tier && !limit) {
					return;
				}

				return new RecommendationsView({
					collection: new TradelinesCollection({}, {
						where: {
							tier: parseInt(tier[1])
						},
						limit: parseInt(limit[1])
					})
				})
			},
			'.tradelines-list': function() {
				return new TradelinesList({
					collection: new TradelinesCollection
				});
			},
			'.cart': function(){
				return new CartView({
					collection: new CartCollection
				})
			}
		}
	});
});