// edit user.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"buyer/views/buyer-form", 
	"adminManageBuyer/models/user-info"
], function(
	BuyerFormView, 
	userModel
) {
	return BuyerFormView.extend({
		el : undefined,
		addSchema : {			
			'needQuestionnaire': {
				type : 'Checkbox',
				title : "need Questionnaire"				
			},
			
			'isBanned': {
				type : 'Checkbox',
				title : "Banned"				
			},			
			
			'accountVerified': {
				type : 'Checkbox',
				title : "Verified"				
			}
		},
		
		submitButtonText : "Edit User",
		
		handleModelSuccessError: function(model) {
			this.listenTo(this.model, 'sync', function(response) {
				App.Mediator.trigger("messaging:showAlert", "User updated successfully.", "Green");
				App.routing.navigate("admin/dashboard", {
					trigger : true
				});
			}.bind(this));
		},		
		
		// function handles form submission and success and error handling.
		handleFormSubmit : function(values) {
			this.model.set(values);
			this.model.save();
		},

		initializeBefore : function(options) {
			if (options && options[0] && options[0].userId) {
				this.userId = options[0].userId;
				this.model = new userModel({id: this.userId});
				this.bindModelValidation(this.model);
				this.listenTo(this.model, 'sync', function() {
					this.render();
				}.bind(this));
				
				this.listenTo(this.model, 'error', function(model, response) {
					var json = (response.responseText)?JSON.parse(response.responseText):{};
					App.Mediator.trigger("messaging:showAlert", json.Error, "Red");
				});
				this.model.fetch();
			}
		}
	});
});
