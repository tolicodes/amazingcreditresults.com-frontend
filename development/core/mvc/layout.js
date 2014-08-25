define([
	"./view"
], function(
	view
) {
	return view.extend({
		appendTo: 'body',
		$mainEl: '.main',
		hooks: {
			'render:after': ['triggerAppend']
		},
		triggerAppend: function(){
			this.trigger('append:before');
			this.trigger('appendInDom:before');
			this.trigger('append:after');
			this.trigger('appendInDom:after');
		}
	});
});