define([
	'core/mvc/view',
	'hbs!./modal',
	'bootstrap'
], function(
	view,
	tpl
){
	return view.extend({
		hooks: {
			'render:before': ['setOptions']
		},

		options: {
			showSave: true,
			saveText: 'Save',
			showClose: true,
			closeText: 'Close'
		},

		className: 'modal fade',

		tpl: tpl,

		appendTo: 'body',

		setOptions: function(){
			_(this.templateData).extend(this.options);
		},

		views: {
			'.modal-body': function(){
				return new this.mainView;
			}
		},

		activateModal: function(){
			this.$el.modal('hide');
		},

		show: function(){
			this.$el.modal('show');
		},

		hide: function(){
			this.$el.modal('hide');
		}
	});
});