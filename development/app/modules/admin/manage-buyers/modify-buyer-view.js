define([
	'core/mvc/view',
	'modules/admin/manage-user/general-info',
	'./buyer-model',
	'hbs!./modify-buyer'
], function(
	View,
	GeneralInfoView,
	BuyerModel,
	modifyBuyerTpl
){
	return View.extend({
		tpl: modifyBuyerTpl,
		
		hooks: {
			'initialize:before': ['checkUserModel']
		},

		views: {
			'.general-info': GeneralInfoView
		},

		checkUserModel: function(){
			if(!this.model) {
				this.model = new BuyerModel();
			}
		}
	});
});