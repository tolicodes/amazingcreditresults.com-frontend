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
			
			'ncRating': {type : 'Select', options: ["None", "A"]},
			
			'bcRating': {type : 'Select', options: ["None", "A"]},
			
			'moRating': {type : 'Select', options: ["None", "A"]},
			
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
		
		// function handles form submission and success and error handling.
		handleFormSubmit : function(values) {
			var createProduct = new createProductModel();
			this.bindModelValidation(createProduct);

			createProduct.bind('validated:valid', function(m, errors) {
				this.listenTo(createProduct, 'sync', function(response) {
					App.Mediator.trigger("messaging:showAlert", "Card added successfully.", "Green");
					App.routing.navigate("admin/dashboard", {
						trigger : true
					});
					
				}.bind(this));

				this.listenTo(createProduct, 'error', function(model, response) {
					var json = (response.responseText)?JSON.parse(response.responseText):{};
					App.Mediator.trigger("messaging:showAlert", json.Error, "Red");
				});
			}.bind(this));

			createProduct.bind('validated:invalid', function(model) {
				createProduct.showErrors(model);
			});

			createProduct.set(values);
			createProduct.save();
		}
	});
});
