// payment info .js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"formView", 
	"buyer/models/card"
], function(
	FormView, 
	model
) {

	return FormView.extend({
		el : undefined,

		formClass: "full-width",

		schema: {
			"cardNumber": {
				type: "Text",
				title: "Card Number"
			},
			"cvv": {
				type: "Text",
				title: "CVV"
			},
			
			"expiry": {
				type: "Object",
				subSchema: {
					"month": {
						type: "Select",
						title: "",
						options: [{"val": "01", "label":"January"}, 
							{"val": "02", "label":"February"}, 
							{"val": "03", "label":"March"}, 
							{"val": "04", "label":"April"}, 
							{"val": "05", "label":"May"}, 
							{"val": "06", "label":"June"},
							{"val": "07", "label":"july"},
							{"val": "08", "label":"August"},
							{"val": "09", "label":"September"},
							{"val": "10", "label":"October"},
							{"val": "11", "label":"November"},
							{"val": "12", "label":"December"}
						]
					},
					"year": {
						type: "Select",
						title: "",
						options: [
							'2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'
						]
					}
				}
			}
			
		},

		submitButtonText : "Make Payment",

		handleModelSuccessError: function(model) {
			this.listenTo(model, 'sync', function(response) {
			}.bind(this));
		},

		handleFormSubmit : function(values) {
			this.model.set(values);
			this.model.save();
		},


		initializeBefore : function(options) {
			this.model = new model();
			this.bindModelValidation(this.model);
		}

	});
});
