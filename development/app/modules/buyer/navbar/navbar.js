define([
	'core/navbar/navbar',
	'hbs!./navbar'
], function(
	view,
	tpl
){
	return view.extend({
		tpl: tpl
	});
});