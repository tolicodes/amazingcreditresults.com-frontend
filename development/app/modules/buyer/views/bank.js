// payment info .js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"formView", 
	"../models/bank"
], function(
	FormView, 
	model
) {

	return FormView.extend({
		formClass: "full-width",

		schema: {
			'routingNumber': {
				type: "Text",
				title: "Routing Number"
			},
			'accountNumber': {
				type: "Text",
				title: "Account Number"
			}
		},

		submitButtonText : "Make Payment",

		handleModelSuccessError: function(model) {
			this.listenTo(model, 'sync', function(response) {
			}.bind(this));
		},

		handleFormSubmit : function(values) {
			this.model.set(values);
			this.model.save();
		},


		initializeBefore : function(options) {
			this.model = new model();
			this.bindModelValidation(this.model);
		}
	});
});
