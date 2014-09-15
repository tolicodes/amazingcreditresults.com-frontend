define([
	'modules/admin/manage-users/modify-user-view',
	'modules/admin/manage-users/general-info',
	'./buyer-model',
	'hbs!./modify-buyer'
], function(
	View,
	GeneralInfoView,
	UserModel,
	tpl
){
	return View.extend({
		tpl: tpl,

		UserModel: UserModel,

		views: {
			'.general-info': GeneralInfoView
		}
	});
});