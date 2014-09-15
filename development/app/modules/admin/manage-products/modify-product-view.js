define([
	'core/form/form-view',
	'./product-model'
], function(
	Form,
	Model
){
	return Form.extend({
		options: {
			templateData: {
				submitButton: 'Create Product'
			}
		},

		hooks: {
			'append:before': ['createModel']
		},
		
		createModel: function(parentView){
			if(!this.model) {
				this.model = new Model
			}
			this.listenToOnce(this.model, 'sync', function(){
				this.Mediator.trigger('create-product', this.model)
			})
		},

		edit: function(model){
			this.model = model;

			var form = new this.form({
				templateData: {
					submitButton: 'Save'
				},
				model: model
			});

			this.addView(form, '.form');
		},
	});
});