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
				title : "Questionary"				
			},
			
			'isBanned': {
				type : 'Checkbox',
				title : "Banned"				
			},			
			
			'accountVerified': {
				type : 'Checkbox',
				title : "Verified"				
			}
		},
		
		handleModelSuccessError: function(model) {
			this.listenTo(model, 'sync', function(response) {
				App.Mediator.trigger("messaging:showAlert", "Buyer created successfully.", "Green");
				App.routing.navigate("admin/dashboard", {
					trigger : true
				});	
			}.bind(this));
		},
		
		// function handles form submission and success and error handling.
		handleFormSubmit : function(values) {
			this.model.set(values);
			this.model.save();
		},
		
		initializeBefore : function(options) {
			this.model = new createBuyerModel();
			this.bindModelValidation(this.model);
		}
	});
});
