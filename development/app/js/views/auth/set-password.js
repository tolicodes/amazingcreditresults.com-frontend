// set password.js
// --------------
// Requires define
// Return Backbone View {Object}

define(["require", "backbone", "text!templates/auth/set-password.html", "models/auth/setPassword"], function(require, Backbone, viewTemplate, setPassword) {

	return Backbone.View.extend({

		events : {
			'submit .reset-password-form' : 'handleFormSubmit'
		},

		handleFormSubmit : function(e) {
			e.preventDefault();
			$(e.target).attr("disabled", "true");
			var password = $(e.target).find("#password").val(), confirmPassword = $(e.target).find("#confirmPassword").val();

			if (!password) {
				alert("Please enter password");
				$(e.target).attr("disabled", "true");
				return false;
			} else if (password != confirmPassword) {
				alert("Please confirm password");
				$(e.target).attr("disabled", "true");
				return false;
			}

			// save the password and login
			this.model = new setPassword();
			this.model.set({
				apiKey : "",
				password : password
			});
			this.model.save({
				success : function() {
					alert("saved successfully");
					App.routing.navigate("login", {
						trigger : true
					});
				},
				error : function() {
					alert("Some error occured");
				}
			});
		},
		
		// main initialize function
		initialize : function(options) {

		},

		render : function() {
			this.$el.html(_.template(viewTemplate));
		}
	});
});
