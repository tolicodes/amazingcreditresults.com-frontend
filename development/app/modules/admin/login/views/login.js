// login.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"formView",
	"hbs!../templates/login",
	"../models/login",
	"core/components/sessionKey/sessionKey"
], function(
	FormView,
	loginTpl,
	loginModel,
	sessionKey
) {

	return FormView.extend({
		submitButtonText: "Login",

		formArea: '.form-area',

		// schema to generate form
		schema: {
			'username': {
				type: 'Text'
			},
			'password': {
				type: 'Password'
			}
		},

		tpl: loginTpl,

		handleModelSuccessError: function(model) {
			this.listenTo(model, 'sync', function(response) {
				sessionKey.setSessionKey(response.get("huntKey"));
				App.routing.navigate("admin/dashboard", {trigger: true});
			});
		},

		handleFormSubmit: function(values) {
			this.model.save(values);
		},

		initializeBefore: function() {
			this.model = new loginModel();
			this.bindModelValidation(this.model);
		}
	});
});