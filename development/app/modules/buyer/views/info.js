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
) {

	return FormView.extend({

		renderOnInitialize: false,
		
		schema: {
	        'First Name':      {type: 'Text', title: "First Name"},
	        'Last Name':       {type: 'Text', title: "Last Name"},
	        'email':      { validators: ['required', 'email'] },
	        'Address':   {type: 'TextArea', title: "Address"},
	        'City':       {type: 'Text', title: "City"},
	        'State':      { type: 'Select', 
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
	        'Alt-phone': {type: 'Text', title: "Alt Phone"},
		},
		
		data: '',
		
		// main initialize function
		init : function(options) {
			var _self = this;
			_self.model = new model;
			_self.model.id = options.userDetail.id;
			_self.model.fetch({
				success: function() {
					_self.data = _self.model.toJSON();
					_self.render();
				},
				error: function() {
					alert("Some error occured");
				}
			});
		}
	});
});
