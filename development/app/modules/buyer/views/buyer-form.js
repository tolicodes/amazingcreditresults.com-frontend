// buyer-form.js
// --------------
// Requires define
// Return Backbone Buyer Form View {Object}

define([
	"formView", 
	"buyer/models/info", 
	"dataPath/collections/states"
], function(
	FormView, 
	model, 
	statesCollection
) {

	return FormView.extend({
		// schema to generate form
		schema : {
			'name' : {
				type : 'Object',
				subSchema : {
					'givenName' : {
						type : 'Text',
						title : "First Name"
					},
					'familyName' : {
						type : 'Text',
						title : "Last Name"
					}
				}
			},
			'email' : {
				validators : ['required', 'email']
			},
			'City' : {
				type : 'Text',
				title : "City"
			},
			'State' : {
				type : 'Select',
				options :  new statesCollection()
			},
			'Zip' : {
				type : 'Text',
				title : "Zip"
			},
			'phone' : {
				type : 'Text',
				title : "Phone"
			},
			'AltPhone' : {
				type : 'Text',
				title : "Alt Phone"
			},
			'Address' : {
				type : 'TextArea',
				title : "Address"
			}
		}
	});
});
