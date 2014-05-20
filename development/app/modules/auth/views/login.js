// login.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"hbs!auth/templates/login", 
	"auth/models/login", 
	"auth/models/myself"
	], function(
	Base, 
	viewTemplate, 
	loginModel, 
	authModel
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
			var password = $(e.target).find("#password").val();
			if (!password) {
				alert("Please enter password");
				$(e.target).prop("disabled", false);
				return false;
			}
			
			// save the password and redirect
			var login = new loginModel();
			login.set({apiKey: this.apiKey, password: password});
			
			// validate login form
			if(login.isValid()) {
				login.save();
				this.listenTo(login, 'sync', function(response) {
					// set the huntKey in session storage
					sessionStorage.setItem("huntKey", response.get("huntKey"));
					
					// setup hunt key
					this.setUpHuntkey();
					
					// get the user detail
					this.authorizeUser().done(this._createForQuestionair.bind(this));
				}.bind(this));
				
				this.listenTo(login, 'error', function() {
					App.Mediator.trigger("messaging:showAlert", "Some error occured", "error");
				});
			}
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
