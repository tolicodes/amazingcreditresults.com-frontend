// set password.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"formView", 
	"hbs!auth/templates/set-password", 
	"auth/models/setPassword"
], function(
	FormView, 
	viewTemplate, 
	setPassword
) {

	return FormView.extend({
		tpl: viewTemplate,
		
		submitButtonText : "Set My Password And START BUYING",

		formClass: "set-password",

		formArea: '.form-area',
		
		// schema to generate form
		schema : {
			'password' : {
				type : 'Password'
			},
			'confirmPassword' : {
				type : 'Password'
			}
		},
		
		handleModelSuccessError: function(model) {
			this.listenTo(model, 'sync', function(response) {
				App.Mediator.trigger("messaging:showAlert", "Password reset successfully.");
				this.layoutObject.showView();
			}.bind(this));
		},
		
		handleFormSubmit : function(values) {
			// save the password and login
			this.model = new setPassword();
			this.bindModelValidation(this.model);
			if(values) values.apiKey = this.apiKey;
			this.model.set(values);
			this.model.save();
		},
		
		initializeBefore : function(options) {
			if(options && options[0]) {
				this.apiKey = options[0].apiKey;
				this.layoutObject = options[0].layoutObject;
			}
		}
	});
});