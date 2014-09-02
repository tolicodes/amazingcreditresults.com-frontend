define([
	'core/mvc/view',
	'./product-list-view',
	'hbs!./manage-products',
	'./modify-product-view'
], function(
	View,
	ListView,
	tpl,
	ModifyProduct
){
	return View.extend({
		tpl: tpl,

		views: {
			'.list': ListView,
			'.modify-product': ModifyProduct
		}
	});
});