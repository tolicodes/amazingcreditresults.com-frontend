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

			if (!password) {
				alert("Please enter password");
				$(e.target).prop("disabled", false);
				return false;
			} else if (password != confirmPassword) {
				alert("Please confirm password");
				$(e.target).prop("disabled", false);
				return false;
			}

			// save the password and login
			this.model = new setPassword();
			
			this.model.set({
				apiKey : this.apiKey,
				password : password
			});
			
			this.model.save();
			
			this.listenTo(this.model, 'sync', function() {
				App.Mediator.trigger("messaging:showAlert", "saved successfully");
				App.routing.navigate("login/"+this.apiKey, {
					trigger : true
				});
			});
			
			this.listenTo(this.model, 'error', function(){
				App.Mediator.trigger("messaging:showAlert", "Some error occured", "error");
			});
		},
		
		initializeBefore : function(options) {
			
			console.log(options);
			if(options && options[0])
				this.apiKey = options[0].apiKey;
		}

		
	});
});
