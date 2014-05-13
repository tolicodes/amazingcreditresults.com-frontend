// login.js
// --------------
// Requires define
// Return Backbone View {Object}

define(["require", "backbone", "hbs!templates/auth/login", "models/auth/setPassword", "models/buyer/info"], function(require, Backbone, viewTemplate, setPasswordModel, buyerInfoModel) {

	return Backbone.View.extend({

		events : {
			'submit .password-form' : 'handleFormSubmit'
		},

		el : 'body',

		handleFormSubmit : function(e) {
			e.preventDefault();
			$(e.target).attr("disabled", "true");
			var password = $(e.target).find("#password").val();
			if (!password) {
				alert("Please enter password");
				$(e.target).attr("disabled", "false");
				return false;
			}

			// save the password and redirect

			var model = new buyerInfoModel();
			model.id = this.userId;
			model.fetch({
				success : function(response) {
					var route = (response.get("needQuestionare") == "true") ? "questions" : "buyer";
					App.routing.navigate(route, {
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
			this.userId = options.userDetail.id;
		},

		render : function() {
			this.$el.html(viewTemplate());
		}
	});
});
