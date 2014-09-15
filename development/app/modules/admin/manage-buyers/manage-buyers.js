define([
	'core/mvc/view',
	'./buyers-list-view',
	'hbs!./manage-buyers',
	'./modify-buyer-view'
], function(
	view,
	ListView,
	ManageBuyersTpl,
	ModifyUserView
){
	return view.extend({
		tpl: ManageBuyersTpl,
		views: {
			'.list': ListView,
			'.modify-buyer': ModifyUserView
		}
	});
});