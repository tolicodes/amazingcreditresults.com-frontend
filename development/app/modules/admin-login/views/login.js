// login.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"hbs!adminLogin/templates/login", 
	"adminLogin/models/login"
	], function(
	Base, 
	viewTemplate, 
	loginModel
	) {

	return Base.extend({
		events : {
			'submit .password-form' : 'handleFormSubmit'
		},
		
		el: undefined,
		
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
				App.Mediator.trigger("messaging:showAlert", "Authorization failed. Please login.", "error");
			});
			return this.user.fetchedDfd;
		},

		handleFormSubmit : function(e) {
			e.preventDefault();
			$(e.target).prop("disabled", true);
			
			var password = $(e.target).find("#password").val(),
			username = $(e.target).find("#username").val();
			// save the password and redirect
			var login = new loginModel();
			
			this.bindModelValidation(login);
			
			login.bind('validated:valid', function(m, errors) {
				this.listenTo(login, 'sync', function(response) {
					// set the huntKey in session storage
					sessionStorage.setItem("huntKey", response.get("huntKey"));
					// setup hunt key
					this.setUpHuntkey();

					App.routing.navigate("admin/dashboard", {
						trigger : true
					});	
				}.bind(this));
				
				this.listenTo(login, 'error', function() {
					App.Mediator.trigger("messaging:showAlert", "Some error occured", "error");
				});
				
			}.bind(this));
			
			login.bind('validated:invalid', function(model) {
				$(e.target).prop("disabled", false);
				login.showErrors(model);
			});
			
			login.set({username: username, password: password});
			login.save();

		},
		
		_createForQuestionair: function() {
			var route = (this.user.get("profile").needQuestionnaire == "true") ? "questions" : "buyer";
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
