// set password.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"formView", 
	"hbs!../templates/set-password", 
	"../models/setPassword"
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
			if(values) values.apiKey = this.apiKey;
			this.model.set(values);
			this.model.save();
		},
		
		initializeBefore : function(options) {
			if(options) {
				this.apiKey = options.apiKey;
				this.layoutObject = options.layoutObject;
			}
			this.model = new setPassword();
			this.bindModelValidation(this.model);
		}
	});
});