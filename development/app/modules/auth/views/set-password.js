// set password.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"hbs!auth/templates/set-password", 
	"auth/models/setPassword"
], function(
	Base, 
	viewTemplate, 
	setPassword
) {

	return Base.extend({
		tpl: viewTemplate,
		events : {
			'submit .reset-password-form' : 'handleFormSubmit'
		},
		
		el: undefined,

		handleFormSubmit : function(e) {
			e.preventDefault();
			$(e.target).prop("disabled", true);
			var password = $(e.target).find("#password").val(), 
			confirmPassword = $(e.target).find("#confirmPassword").val();

			// save the password and login
			this.model = new setPassword();
			this.bindModelValidation(this.model);
			this.model.bind('validated:valid', function(m, errors) {
				this.listenTo(this.model, 'sync', function(response) {
					App.Mediator.trigger("messaging:showAlert", "saved successfully");
					App.routing.navigate("login/"+this.apiKey, {
						trigger : true
					});
				}.bind(this));
				
				this.listenTo(this.model, 'error', function() {
					App.Mediator.trigger("messaging:showAlert", "Some error occured", "error");
				});
				
			}.bind(this));
			
			this.model.bind('validated:invalid', function(model) {
				$(e.target).prop("disabled", false);
				this.model.showErrors(model);
			}.bind(this));

			this.model.set({
				apiKey : this.apiKey,
				password : password,
				confirmPassword: confirmPassword
			});
			
			this.model.save();
		},
		
		initializeBefore : function(options) {
			
			console.log(options);
			if(options && options[0])
				this.apiKey = options[0].apiKey;
		}

		
	});
});
