// create buyer.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"buyer/views/buyer-form", 
	"modules/admin/buyer/models/create-buyer",
	"modules/admin/buyer/models/user-info"	
], function(
	BuyerFormView, 
	createBuyerModel,
	userInfo
) {

	return BuyerFormView.extend({
		el : undefined,
		// set the submit button text
		submitButtonText : "Create Seller",
		
		// add schema to common schema
		addSchema: {
			'needQuestionnaire': {
				type : 'Checkbox',
				title : "Questionary"				
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
		
		handleModelSuccessError: function(model) {
			this.listenTo(model, 'sync', function(response) {
				App.Mediator.trigger("messaging:showAlert", "Seller created successfully.", "Green");
				App.routing.navigate("admin/seller", {
					trigger : true
				});	
			}.bind(this));
		},
		
		// function handles form submission and success and error handling.
		handleFormSubmit : function(values) {
			if(values) {
				values.roles = {
					seller: true
				};
				
				console.log(this.model);
				
				this.model.set(values);
				this.model.save();
			}
		},
		
		initializeBefore : function(options) {
			console.log(options);
			if (options && options.id) {
				this.submitButtonText = "Update Seller";
				this.userId = options.id;
				this.model = new userInfo({id: this.userId});
				this.model.id = this.userId;
				this.bindModelValidation(this.model);
				this.listenTo(this.model, 'sync', function(response) {
					this.render();
				}.bind(this));
				this.model.fetch();
			} else {
				this.model = new createBuyerModel({id: options.id});
				this.bindModelValidation(this.model);
			}
		}
	});
});
