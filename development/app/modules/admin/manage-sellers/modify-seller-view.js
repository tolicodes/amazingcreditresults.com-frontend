define([
	'modules/admin/manage-users/modify-user-view',
	'modules/admin/manage-users/general-info',
	'./tradelines-list',
	'./seller-model',
	'modules/admin/manage-tradelines/tradelines-collection',
	'hbs!./modify-seller'
], function(
	View,
	GeneralInfoView,
	TradelinesList,
	UserModel,
	TradelinesCollection,
	modifySellerTpl
){
	return View.extend({
		tpl: modifySellerTpl,

		UserModel: UserModel,

		views: {
			'.general-info': GeneralInfoView
		},

		hooks: {
			'M:edit-user': 'setupViews'
		},

		setupViews: function(){
			this.tradelines = new TradelinesCollection({}, {
				sellerId: this.model.id
			});

			this.addView(new TradelinesList({
				collection: this.tradelines
			}), '.tradelines-list');
		}
	});
});