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
		
		formArea: '.form-area',
		
		el: undefined,
		
		// schema to generate form
		schema : {
			'password' : {
				type : 'Password',
				validators : ['required']
			},
			'confirmPassword' : {
				type : 'Password',
				validators : ['required']
			}
		},

		handleFormSubmit : function(values) {
			// save the password and login
			this.model = new setPassword();
			this.bindModelValidation(this.model);
			this.model.bind('validated:valid', function(m, errors) {
				this.listenTo(this.model, 'sync', function(response) {
					App.Mediator.trigger("messaging:showAlert", "Password reset successfully.");
					this.layoutObject.showView();
				}.bind(this));
				
				this.listenTo(this.model, 'error', function() {
					App.Mediator.trigger("messaging:showAlert", "Some error occured", "Red");
				});
				
			}.bind(this));
			
			this.model.bind('validated:invalid', function(model) {
				this.model.showErrors(model);
			}.bind(this));

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
