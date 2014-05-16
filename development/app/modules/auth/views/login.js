// login.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"hbs!auth/templates/login", 
	"auth/models/setPassword", 
	"buyer/models/info"
	], function(
	Base, 
	viewTemplate, 
	setPasswordModel, 
	buyerInfoModel
	) {

	return Base.extend({
		events : {
			'submit .password-form' : 'handleFormSubmit'
		},
		
		tpl : viewTemplate,

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

			var model = new buyerInfoModel();
			model.id = this.userId;
			
			model.fetch();
			
			this.listenTo(model, 'sync', function(response){
				var route = (response.get("needQuestionare") == "true") ? "questions" : "buyer";
				App.routing.navigate(route, {
					trigger : true
				});
			});
			
			this.listenTo(model, 'error', function(){
				App.Mediator.trigger("messaging:showAlert", "Some error occured", "error");
			});

		},
		
		initializeBefore : function(options) {
			if(options && options[0])
				this.userId = options[0].userDetail.id;
		}

	});
});
