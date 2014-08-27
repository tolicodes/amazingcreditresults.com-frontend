define([
	'backgrid'
], function(
	
){
	return Backgrid.Cell.extend({
		className: 'action-buttons',

		render: function(){
			_(this.buttons).each(function(options, className){
				var $button = $(
					'<button class="btn btn-xs ' + className + '">' + 
					'<i class="' + options.icon  + '"></i>' +
					'</button>'
				).tooltip({
					title: options.label
				}).on('click', function(){
					this[options.onClick].apply(this);
				}.bind(this));


				this.$el.append($button);
			}, this);

			return this;
		}
	});
})