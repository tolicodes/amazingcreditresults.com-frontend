define([
	'core/mvc/view',
	'./owner-list-view',
	'hbs!./manage-owners',
	'./modify-owner-view'
], function(
	View,
	UserListView,
	tpl,
	ModifyUser
){
	return View.extend({
		tpl: tpl,

		views: {
			'.list': UserListView,
			'.modify-owner': ModifyUser
		}
	});
});