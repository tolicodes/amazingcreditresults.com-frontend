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
		
		formClass: 'login-form',
		
		// schema to generate form
		schema : {
			'password' : {
				type : 'Password',
				validators : ['required']
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

		handleFormSubmit : function(values) {
			// save the password and redirect
			var login = new loginModel();
			
			this.bindModelValidation(login);
			login.bind('validated:valid', function(m, errors) {
				this.listenTo(login, 'sync', function(response) {
					// set the huntKey in session storage
					sessionStorage.setItem("huntKey", response.get("huntKey"));
					// setup hunt key
					this.setUpHuntkey();
					// get the user detail
					this.authorizeUser().done(this._createForQuestionnaire.bind(this));
				}.bind(this));
				
				this.listenTo(login, 'error', function(model, response) {
					var json = (response.responseText)?JSON.parse(response.responseText):{};
					App.Mediator.trigger("messaging:showAlert", "Incorrect Password. Forgot your password? Contact support at <a  href='mailto:support@amazingcreditresults.com'>support@amazingcreditresults.com</a>", "Red", json.errors);
				});
			}.bind(this));
			
			login.bind('validated:invalid', function(model) {
				login.showErrors(model);
			});
			
			if(values)
				values.apiKey = this.apiKey;
			
			login.set(values);
			login.save();

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
