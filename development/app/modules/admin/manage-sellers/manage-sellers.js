define([
	'core/mvc/view',
	'./seller-list-view',
	'hbs!./manage-sellers',
	'./modify-seller-view'
], function(
	view,
	UserListView,
	tpl,
	ModifySellerView
){
	return view.extend({
		tpl: tpl,
		views: {
			'.list': UserListView,
			'.modify-seller': ModifySellerView
		}
	});
});