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
		pageType: 'admin',

		// set the submit button text
		submitButtonText: "Create Card",

		// add schema to common schema
		schema: {
			'bank': {
				type: 'Text',
				title: "Issuing Bank"
			},

			'name': {
				type: 'Text',
				title: "Product Name"
			},

			'ncRating': {
				type: 'Select',
				options: ["None", "Silver", "Gold", "Bronze"]
			},
			'bcRating': {
				type: 'Select',
				options: ["None", "Silver", "Gold", "Bronze"]
			},
			'moRating': {
				type: 'Select',
				options: ["None", "Silver", "Gold", "Bronze"]
			},

			'reportsToExperian': {
				type: 'Checkbox',
				name: "reportsToExperian",
				title: "Experian"
			},

			'reportsToEquifax': {
				type: 'Checkbox',
				name: "reportsToEquifax",
				title: "Equifax"
			},

			'reportsToTransunion': {
				type: 'Checkbox',
				name: "reportsToTransunion",
				title: "TransUnion"
			},

			'type': {
				type: 'Select',
				options: ['Visa', 'MasterCard', 'Amex', 'Discover'],
				title: "Type"
			},

			'notes': {
				type: 'TextArea',
				title: "Notes"
			},
		},

		handleModelSuccessError: function(model) {
			this.listenTo(this.model, 'sync', function(response) {
				App.Mediator.trigger("messaging:showAlert", "Product added successfully.", "Green");
			}.bind(this));
		},

		// function handles form submission and success and error handling.
		handleFormSubmit: function(values) {
			this.model.set(values);
			this.model.save();
		},

		initializeBefore: function() {
			this.model = new createProductModel();
			this.bindModelValidation(this.model);
		}

	});
});