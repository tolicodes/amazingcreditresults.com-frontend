define([
	'core/mvc/view',
	'./product-list-view',
	'./product-collection',
	'hbs!./manage-products',
	'./modify-product-view'
], function(
	View,
	ListView,
	ProductCollection,
	tpl,
	ModifyProduct
) {
	return View.extend({
		tpl: tpl,

		views: {
			'.list': ListView,
			'.modify-product':  ModifyProduct
		}
	});
});