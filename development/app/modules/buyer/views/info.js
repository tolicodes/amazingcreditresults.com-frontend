// info.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"buyer/views/buyer-form", 
	"adminManageBuyer/models/create-buyer",
	"dataPath/collections/states"
], function(
	BuyerFormView, 
	model,
	statesCollection
) {

	return BuyerFormView.extend({
		el : undefined,
		addSchema : {
			'ssn': {
				type: "MultipleInput",
				total: 3,
				title: "SSN"
			},
			birthday: 'Date',
			'email' : {
				editorAttrs: { disabled: true },
				validators : ['email']
			},
			
			'city' : {
				editorAttrs: { disabled: true },
				type : 'Text',
				title : "City"
			},
			'state' : {
				editorAttrs: { disabled: true },
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
				editorAttrs: { disabled: true },
				type : 'Text',
				title : "Zip"
			},
			'phone' : {
				editorAttrs: { disabled: true },
				type : 'Text',
				title : "Phone"
			},
			'altPhone' : {
				editorAttrs: { disabled: true },
				type : 'Text',
				title : "Alt Phone"
			},
			'street1' : {
				editorAttrs: { disabled: true },
				type : 'TextArea',
				title : "Street 1"
			},
			'street2' : {
				editorAttrs: { disabled: true },
				type : 'TextArea',
				title : "Street 2"
			}
		},
		
		submitButtonText : "Update",

		handleModelSuccessError: function(model) {
			this.listenTo(model, 'sync', function(response) {
				App.Mediator.trigger("messaging:showAlert", "Information updated successfully", "Green");		
			}.bind(this));
		},		
		
		handleFormSubmit : function(values) {
			this.model.set(values);
			this.model.save();
		},		

		initializeBefore : function(options) {
			if (options && options.userDetail) {
				this.model = new model();
				this.model.buyer = true;
				this.model.set(options.userDetail);
				this.bindModelValidation(this.model);
			}
		}
	});
});
