// info.js
// --------------
// Requires define
// Return Backbone View {Object}


define([
	"formView", 
	'hbs!buyer/templates/info', 
	"buyer/models/info"
], function(
	FormView, 
	viewTemplate, 
	model
//	productModel,
//	tradelineModel,
//	transactionModel,
//	usersModel
) {

	return FormView.extend({

		el: undefined,
		
		// schema to generate form
		schema: {
	        'FirstName': {type: 'Text', title: "First Name"},
	        'LastName':  {type: 'Text', title: "Last Name"},
	        'Email':     { validators: ['required', 'email'] },
	        'Address':   {type: 'TextArea', title: "Address"},
	        'City':      {type: 'Text', title: "City"},
	        'State':     { type: 'Select', 
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
			'Zip':       {type: 'Text', title: "Zip"},
	        'phone':     {type: 'Text', title: "Phone"},
	        'AltPhone':  {type: 'Text', title: "Alt Phone"},
		},
		
		initializeBefore : function(options) {
			if(options && options[0] && options[0].userDetail) {
				this.model = new model();
				this.model.set(options[0].userDetail);
			}
		}
	});
});
