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
					//'middleName' : {
					//	type : 'Text',
					//	title : "Middle Name"
					//}
				}
			},
			'email' : {
				validators : ['email']
			},
			'city' : {
				type : 'Text',
				title : "City"
			},
			'state' : {
				type : 'Select',
				options :  function(callback, editor) {
	       		 var states = new statesCollection();
	       		 states.fetch({
	       		 	success: function() {
	       		 		callback(states.toJSON());
	       		 	}, 
	       		 	error: function() {
	       		 	}
	       		 });
    			}
			},
			'zip' : {
				type : 'Text',
				title : "Zip"
			},
			'phone' : {
				type : 'Text',
				title : "Phone"
			},
			'altPhone' : {
				type : 'Text',
				title : "Alt Phone"
			},
			'localAddress' : {
				type : 'TextArea',
				title : "Address"
			}
		}
	});
});
