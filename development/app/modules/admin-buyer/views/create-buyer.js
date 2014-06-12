// create buyer.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"buyer/views/buyer-form", 
	"adminManageBuyer/models/create-buyer"
], function(
	BuyerFormView, 
	createBuyerModel
) {

	return BuyerFormView.extend({
		el : undefined,
		// set the submit button text
		submitButtonText : "Create Buyer",
		
		// add schema to common schema
		addSchema: {
			'needQuestionnaire': {
				type : 'Checkbox',
				title : "need Questionnaire"				
			},
			
			'accountVerified': {
				type : 'Checkbox',
				title : "Verified"				
			}
		},
		
		handleModelSuccessError: function(model) {
			this.listenTo(model, 'sync', function(response) {
				App.Mediator.trigger("messaging:showAlert", "Buyer created successfully.", "Green");
			}.bind(this));

			this.listenTo(model, 'error', function(model, response) {
				var json = (response.responseText)?JSON.parse(response.responseText):{};
				App.Mediator.trigger("messaging:showAlert", "Some error occured", "Red", json.errors);
			});
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
