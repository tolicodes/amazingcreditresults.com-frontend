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
		}
	});
});