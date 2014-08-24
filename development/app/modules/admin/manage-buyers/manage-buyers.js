define([
	'core/mvc/view',
	'./buyers-list-view'
], function(
	view,
	BuyerListView
){
	return view.extend({
		views: {
			'.buyer-list': BuyerListView
		}
	});
})