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
			'render:before': ['setOptions'], 
			'render:after': ['addMainView']
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

		addMainView: function(){
			if(!this.mainView) { return }
			this.addView('.modal-body', new this.mainView)
		},

		activateModal: function(){
			this.$el.modal('hide');
		},

		show: function(){
			console.log('showing');
			this.$el.modal('show');
		},

		hide: function(){
			this.$el.modal('hide');
		}
	});
});