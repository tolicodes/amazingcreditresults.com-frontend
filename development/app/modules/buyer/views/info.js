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
	        'givenName': {type: 'Text', title: "First Name"},
	        'familyName':  {type: 'Text', title: "Last Name"},
	        'email':     { validators: ['required', 'email'] },
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
			options = [];
			options[0] = {};
			options[0].userDetail = {"id":"537cbbbf741911cf03c928d3","huntKey":"cfed2e155c99b16d37a2cad951421ea344852adf1a5de90f9b7d9bb34fed9002e7492eb60a72016422792efcb40349c40e65453f860a85fd4dc33175cca80bf3","email":"20sanjaykumar@gmail.com","name":{"familyName":"Kumar","givenName":"Sanjay"},"gravatar":"https://secure.gravatar.com/avatar/4ad1325118e913f712c4b361d18b83db.jpg?s=80&d=wavatar&r=g","gravatar30":"https://secure.gravatar.com/avatar/4ad1325118e913f712c4b361d18b83db.jpg?s=30&d=wavatar&r=g","gravatar50":"https://secure.gravatar.com/avatar/4ad1325118e913f712c4b361d18b83db.jpg?s=50&d=wavatar&r=g","gravatar80":"https://secure.gravatar.com/avatar/4ad1325118e913f712c4b361d18b83db.jpg?s=80&d=wavatar&r=g","gravatar100":"https://secure.gravatar.com/avatar/4ad1325118e913f712c4b361d18b83db.jpg?s=100&d=wavatar&r=g","root":false,"accountVerified":true,"profile":{"needQuestionnaire":false}};
			//if(options && options[0] && options[0].userDetail) {
				this.model = new model();
				this.model.set(options[0].userDetail);
			//	this.render();
			//}
		}
	});
});
