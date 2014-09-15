define([
	'modules/admin/manage-users/modify-user-view',
	'modules/admin/manage-users/general-info',
	'./owner-model',
	'hbs!./modify-owner'
], function(
	View,
	GeneralInfoView,
	UserModel,
	modifySellerTpl
){
	return View.extend({
		tpl: modifySellerTpl,

		UserModel: UserModel,

		views: {
			'.general-info': GeneralInfoView
		}
	});
});