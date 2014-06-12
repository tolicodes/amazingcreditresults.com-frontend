// create buyer.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"buyer/views/buyer-form", 
	"adminDashboard/models/create-buyer"
], function(
	BuyerFormView, 
	createBuyerModel
) {

	return BuyerFormView.extend({
		el : undefined,
		// set the submit button text
		submitButtonText : "Create Buyer",
		
		handleModelSuccessError: function(model) {
			this.listenTo(model, 'sync', function(response) {
				App.Mediator.trigger("messaging:showAlert", "Buyer created successfully.", "Green");
			}.bind(this));			
		},
		
		// function handles form submission and success and error handling.
		handleFormSubmit : function(values) {
			var createBuyer = new createBuyerModel();
			this.bindModelValidation(createBuyer);
			createBuyer.set(values);
			createBuyer.save();
		}
	});
});
