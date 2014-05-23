// create buyer.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"formView",
	"adminDashboard/models/create-buyer"
], function(
	FormView,
	createBuyerModel
) {

	return FormView.extend({
		el: undefined,
		// schema to generate form
		schema: {
	        'givenName': {type: 'Text', title: "First Name"},
	        'familyName':  {type: 'Text', title: "Last Name"},
	        'email':     { validators: ['email'] },
	        'Address':   {type: 'TextArea', title: "Address"},
	        'City':      {type: 'Text', title: "City"},
	        'State':     {type: 'Select', 
	        				options: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
									  'Connecticut', 'Delaware', 'District Of Columbia','Florida', 'Georgia', 'Hawaii',
									  'Idaho', 'Illinois', 'Indiana','Iowa', 'Kansas', 'Kentucky',
									  'Louisiana', 'Maine', 'Maryland','Massachusetts', 'Michigan', 'Minnesota',
									  'Mississippi', 'Missouri', 'Montana','Nebraska', 'Nevada', 'New Hampshire',
									  'New Jersey', 'New Mexico', 'New York','North Carolina', 'North Dakota', 'Ohio',
									  'Oklahoma', 'Oregon', 'Pennsylvania','Rhode Island', 'South Carolina', 'South Dakota',
									  'Tennessee', 'Texas', 'Utah','Vermont', 'Virginia', 'Washington',
									  'West Virginia', 'Wisconsin', 'Wyoming'		
	        ]},
	        'Verified':  {type: 'Checkbox', title: "Verified"},
	        'Questionnaire':  {type: 'Checkbox', title: "Questionnaire"},
			'Zip':       {type: 'Text', title: "Zip"},
	        'phone':     {type: 'Text', title: "Phone"},
	        'AltPhone':  {type: 'Text', title: "Alt Phone"}
		},
		
		// set the submit button text
		submitButtonText: "Create Buyer",
		
		handleFormSubmit: function(values) {
			console.log(values);
			
			var createBuyer = new createBuyerModel();
			this.bindModelValidation(createBuyer);
			
			createBuyer.bind('validated:valid', function(m, errors) {
				this.listenTo(createBuyer, 'sync', function(response) {
					App.Mediator.trigger("messaging:showAlert", "Buyer created successfully.", "success");
				}.bind(this));
				
				this.listenTo(createBuyer, 'error', function() {
					App.Mediator.trigger("messaging:showAlert", "Some error occured", "error");
				});
			}.bind(this));
			
			createBuyer.bind('validated:invalid', function(model) {
				createBuyer.showErrors(model);
			});
			
			createBuyer.set(values);
			createBuyer.save();
		},
		
		initializeBefore : function() {
		}
	});
});
