define([
	'core/mvc/view',
	'hbs!./message-tpl'
], function(
	view,
	messageTpl
){
	return view.extend({
		hooks: {
			'initialize:before': ['setHideTimeout'],
			'render:before': ['_addClass'],
			'model:change:hide': 'hide'
		},

		events: {
			'click .close-btn': 'triggerHide',
			'mouseover': 'cancelHideTimeout'
		},

		tpl: messageTpl,

		className: 'alert alert-message-h',

		setHideTimeout: function(options) {
			this.hideTimeout = setTimeout(this.triggerHide.bind(this), this.options.parentView.options.hideTimeout);
		},

		cancelHideTimeout: function(){
			clearTimeout(this.hideTimeout);
		},

		triggerHide: function(){
			this.model.set('hide', true);
		},

		hide: function(){
			this.$el.fadeOut();
		},

		alertTypes: {
			'success': 'alert-success',
			'error': 'alert-danger',
			'info': 'alert-info',
			'warning': 'alert-warning'
		},

		_addClass: function(){
			this.$el.addClass(
				this.alertTypes[this.model.get('type')]
			);
		}
	});
})