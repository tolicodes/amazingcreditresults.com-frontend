// create buyer.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"buyer/views/buyer-form", 
	"../models/create-buyer",
	 "../views/transactions"
], function(
	BuyerFormView, 
	createBuyerModel,
	TransactionsView
) {

	return BuyerFormView.extend({
		el : undefined,
		// set the submit button text
		submitButtonText : "Create Buyer",
		
		// add schema to common schema
		addSchema: {
			'needQuestionnaire': {
				type: 'Checkbox',
				title: "Questionnaire"
			},

			'isBanned': {
				type: 'Checkbox',
				title: "Banned"
			},

			'accountVerified': {
				type : 'Checkbox',
				title : "Verified"				
			},
			
			'doNotSendEmail': {
				type : 'Checkbox',
				title : "Do Not Send Welcome Email"				
			}
		},
		
		handleModelSuccessError: function(model) {
			this.listenTo(model, 'sync', function(response) {
				var msg = (this.userId)?"User updated successfully.":"Buyer created successfully.";
				App.Mediator.trigger("messaging:showAlert", msg, "Green");
				history.back(-1);
			}.bind(this));
		},
		

		submitButtonText: "Edit User",

		handleModelSuccessError: function(model) {
			this.listenTo(this.model, 'sync', function(response) {
				App.Mediator.trigger("messaging:showAlert", "User updated successfully.", "Green");
				App.routing.navigate("admin/dashboard", {
					trigger: true
				});
			}.bind(this));
		},

		// function handles form submission and success and error handling.
		handleFormSubmit: function(values) {
			this.model.set(values);
			this.model.save();
		},
		

		initializeBefore: function(options) {
			if (options && options.userId) {
				this.submitButtonText = "Edit";
				this.userId = options.userId;
				this.model = new createBuyerModel({id: this.userId});
				this.listenTo(this.model, 'sync', function() {
					this.render();
					this.renderTransactions();
				}.bind(this));

				this.listenTo(this.model, 'error', function(model, response) {
					var json = (response.responseText) ? JSON.parse(response.responseText) : {};
					App.Mediator.trigger("messaging:showAlert", json.Error, "Red");
				});

				this.bindModelValidation(this.model);
				this.model.fetch();
			} else {
				this.model = new createBuyerModel();
				this.bindModelValidation(this.model);
			}
		},
		    renderTransactions: function() {
      new TransactionsView({model: this.model}).render();
    }


	});
});
