define([
	'core/mvc/view',
	'./buyers-list-view',
	'hbs!./manage-buyers',
	'./modify-buyer-view'
], function(
	view,
	BuyerListView,
	ManageBuyersTpl,
	ModifyBuyerView
){
	return view.extend({
		tpl: ManageBuyersTpl,
		views: {
			'.buyers-list': BuyerListView,
			'.modify-buyer': ModifyBuyerView
		}
	});
});