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
			'givenName' : {
				type : 'Text',
				title : "First Name"
			},
			
			'familyName' : {
				type : 'Text',
				title : "Last Name"
			},
			
			'needQuestionnaire': {
				type : 'Checkbox',
				title : "need Questionnaire"				
			},
			
			'accountVerified': {
				type : 'Checkbox',
				title : "Verified"				
			}
		},
		
		// function handles form submission and success and error handling.
		handleFormSubmit : function(values) {
			var createBuyer = new createBuyerModel();
			this.bindModelValidation(createBuyer);

			createBuyer.bind('validated:valid', function(m, errors) {
				this.listenTo(createBuyer, 'sync', function(response) {
					App.Mediator.trigger("messaging:showAlert", "Buyer created successfully.", "Green");
				}.bind(this));

				this.listenTo(createBuyer, 'error', function(model, response) {
					var json = (response.responseText)?JSON.parse(response.responseText):{};
					App.Mediator.trigger("messaging:showAlert", "Some error occured", "Red", json.errors);
				});
			}.bind(this));

			createBuyer.bind('validated:invalid', function(model) {
				createBuyer.showErrors(model);
			});

			createBuyer.set(values);
			createBuyer.save();
		}
	});
});
