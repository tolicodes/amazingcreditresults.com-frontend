define([
	"./view"
], function(
	view
) {
	return view.extend({
		appendTo: 'body',
		$mainEl: '.main'
	});
});