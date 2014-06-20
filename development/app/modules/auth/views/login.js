// login.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"formView", 
	"hbs!auth/templates/login", 
	"auth/models/login", 
	"auth/models/myself"
	], function(
	FormView, 
	viewTemplate, 
	loginModel, 
	authModel
	) {

	return FormView.extend({
		
		formArea: '.form-area',
		
		formClass: "set-password",
		
		// schema to generate form
		schema : {
			'password' : {
				type : 'Password'
			}
		},
		
		tpl : viewTemplate,

		// setup huntkey in header
		setUpHuntkey: function() {
			$.ajaxSetup({
				beforeSend: function (request) {
                	request.setRequestHeader("huntKey", sessionStorage.getItem("huntKey"));
            	}
			});			
		},

		// this function gives the current user detail
		authorizeUser : function() {
			this.user = new authModel();
			this.user.fetchedDfd.fail(function() {
				App.Mediator.trigger("messaging:showAlert", "Authorization failed. Please login.", "Red");
			});
			return this.user.fetchedDfd;
		},
		
		submitButtonText : "Login In START BUYING",

		handleModelSuccessError: function(model) {
			this.listenTo(model, 'sync', function(response) {
				// set the huntKey in session storage
				sessionStorage.setItem("huntKey", response.get("huntKey"));
				// setup hunt key
				this.setUpHuntkey();
				// get the user detail
				this.authorizeUser().done(this._createForQuestionnaire.bind(this));
			}.bind(this));
		},

		handleFormSubmit : function(values) {
			// save the password and redirect
			this.model = new loginModel();
			this.bindModelValidation(this.model);
			if(values) values.apiKey = this.apiKey;
			this.model.set(values);
			this.model.save();
		},
		
		_createForQuestionnaire: function() {
			if(!_.isUndefined(App.CurrentUser)) App.CurrentUser.set(this.user.toJSON());
			var route = (this.user.get("profile").needQuestionnaire == "true") ? "dashboard" : "buyer";
			App.routing.navigate(route, {
				trigger : true
			});
		},
		
		initializeBefore : function(options) {
			if(options && options[0])
				this.apiKey = options[0].apiKey;
		}

	});
});
