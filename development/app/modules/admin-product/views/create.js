// create buyer.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"formView", 
	"adminProduct/models/create"
], function(
	FormView, 
	createProductModel
) {

	return FormView.extend({
		el : undefined,
		// set the submit button text
		submitButtonText : "Create Card",
		
		// add schema to common schema
		schema: {
			'bank' : {
				type : 'Text',
				title : "Issuing Bank"
			},
			
			'name' : {
				type : 'Text',
				title : "Product Name"
			},
			
			'ncRating': {type : 'Select', options: ["None", "Silver", "Gold", "Brown"]},
			'bcRating': {type : 'Select', options: ["None", "Silver", "Gold", "Brown"]},
			'moRating': {type : 'Select', options: ["None", "Silver", "Gold", "Brown"]},
			'improvingShortCreditHistory': {type : 'Select', options: ["None", "Silver", "Gold", "Brown"]},
			'improvingBadCreditScore': {type : 'Select', options: ["None", "Silver", "Gold", "Brown"]},
			'improvingMaxedOutCredit': {type : 'Select', options: ["None", "Silver", "Gold", "Brown"]},

			'reportsToExperian': {
				type : 'Checkbox',
				name: "reportsToExperian",
				title : "Experian"				
			},
			
			'reportsToEquifax': {
				type : 'Checkbox',
				name: "reportsToEquifax",
				title : "Equifax"				
			},
			
			'reportsToTransunion': {
				type : 'Checkbox',
				name: "reportsToTransunion",
				title : "TransUnion"				
			},
			
			'type': {
				type : 'Text',
				title : "Type"				
			},
			
			'notes': {
				type : 'TextArea',
				title : "Notes"				
			},
		},
		
		handleModelSuccessError: function(model) {
			this.listenTo(createProduct, 'sync', function(response) {
				App.Mediator.trigger("messaging:showAlert", "Product added successfully.", "Green");
				App.routing.navigate("admin/dashboard", {
					trigger : true
				});
			}.bind(this));			
		},
		
		// function handles form submission and success and error handling.
		handleFormSubmit : function(values) {
			var createProduct = new createProductModel();
			this.bindModelValidation(createProduct);
			createProduct.set(values);
			createProduct.save();
		}
	});
});
