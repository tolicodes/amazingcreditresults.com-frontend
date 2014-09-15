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
			'close:before': 'hide'
		},

		events: {
			'click .save-btn': 'triggerSave'
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
				return new this.mainView({
					model: this.model
				});
			}
		},

		triggerSave: function(){
			this.trigger('save');
		},

		activateModal: function(){
			this.$el.modal('hide');
		},

		show: function(){
			if(this._showing) {
				return;
			}

			this._showing = true;
			this.$el.modal('show');
		},

		hide: function(){
			if(!this._showing) {
				return;
			}

			this._showing = true;

			this.$el.modal('hide');
		}
	});
});