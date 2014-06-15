// login.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"formView", 
	"hbs!adminLogin/templates/login", 
	"adminLogin/models/login"
	], function(
	FormView, 
	viewTemplate, 
	loginModel
	) {

	return FormView.extend({

		submitButtonText : "Login",
		
		formArea: '.form-area',
		
		el: undefined,
		
		// schema to generate form
		schema : {
			'username' : {
				type : 'Text'
			},
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

		handleFormSubmit : function(values) {
			// save the password and redirect
			var login = new loginModel();
			this.bindModelValidation(login);
			login.set(values);
			login.save();

		},
				
		initializeBefore : function(options) {
			//if(options && options[0]) this.apiKey = options[0].apiKey;
		}
	});
});
