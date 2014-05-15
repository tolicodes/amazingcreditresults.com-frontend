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
			$(e.target).attr("disabled", true);
			var password = $(e.target).find("#password").val();
			if (!password) {
				alert("Please enter password");
				$(e.target).attr("disabled", false);
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
				App.Mediatior.trigger("messaging:showAlert", "Some error occured", "error");
			});

		},
		
		// main initialize function
		init : function(options) {
			this.userId = options.userDetail.id;
		}

	});
});
