// create owner.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"formView", 
	"adminManageOwner/models/create-owner"
], function(
	FormView, 
	createOwnerModel
) {

	return FormView.extend({
		// set the submit button text
		submitButtonText : "Create Owner",
		
		// schema to generate form
		schema : {
			'username' : {
				validators : ['email']
			},
			'password' : {
				type : 'Password'
			}
		},
		
		handleModelSuccessError: function(model) {
			this.listenTo(model, 'sync', function(response) {
				this.formReset();
				App.Mediator.trigger("messaging:showAlert", "Owner acount created successfully.", "Green");
			}.bind(this));
		},
				
		// function handles form submission and success and error handling.
		handleFormSubmit : function(values) {
			var createOwner = new createOwnerModel();
			this.bindModelValidation(createOwner);
			createOwner.set(values);
			createOwner.save();
		}
	});
});
