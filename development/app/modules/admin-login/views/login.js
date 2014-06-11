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
		
		handleModelSuccessError: function(model) {
			this.listenTo(model, 'sync', function(response) {
				// set the huntKey in session storage
				sessionStorage.setItem("huntKey", response.get("huntKey"));
				// setup hunt key
				this.setUpHuntkey();
				App.routing.navigate("admin/dashboard", {
					trigger : true
				});	
			}.bind(this));
		},

		handleFormSubmit : function(e) {
			e.preventDefault();
			var password = $(e.target).find("#password").val(),
			username = $(e.target).find("#username").val();
			// save the password and redirect
			var login = new loginModel();
			this.bindModelValidation(login);
			login.set({username: username, password: password});
			login.save();

		},
				
		initializeBefore : function(options) {
			if(options && options[0]) this.apiKey = options[0].apiKey;
		}
	});
});
