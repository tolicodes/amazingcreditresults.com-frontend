define([
	'core/modal/modal',
	'core/form/form-view'
], function(
	Modal,
	Form
){
	return Modal.extend({
		mainView: Form.extend({
			
		}),

		hooks: {
			'save': 'saveModel'
		},

		saveModel: function(){
			var body = this._views['.modal-body'],
				errors = body.form.commit();

			if(!errors) {
				body.model.save();
			}

			this.listenTo(body.model, 'sync', this.close)
		}
	})
});