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
		el : undefined,
		// set the submit button text
		submitButtonText : "Create Owner",
		
		// schema to generate form
		schema : {
			'username' : {
				validators : ['required', 'email']
			},
			'password' : {
				type : 'Password',
				validators : ['required']
			}
		},
				
		// function handles form submission and success and error handling.
		handleFormSubmit : function(values) {
			var createOwner = new createOwnerModel();
			this.bindModelValidation(createOwner);

			createOwner.bind('validated:valid', function(m, errors) {
				this.listenTo(createOwner, 'sync', function(response) {
					App.Mediator.trigger("messaging:showAlert", "Owner acount created successfully.", "Green");
				}.bind(this));

				this.listenTo(createOwner, 'error', function(model, response) {
					//var json = (response.responseText)?JSON.parse(response.responseText):{};
					App.Mediator.trigger("messaging:showAlert", response.responseText, "Red");
				});
				
				
				
			}.bind(this));

			createOwner.bind('validated:invalid', function(model) {
				createOwner.showErrors(model);
			});
			createOwner.set(values);
			createOwner.save();
		}
	});
});
