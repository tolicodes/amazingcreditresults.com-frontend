// create buyer.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"formView", 
	"../models/tradeline",
	"../collections/sellers",
	"../collections/products",
], function(
	FormView, 
	createModel,
	sellerCollection,
	productCollection
) {

	return FormView.extend({
		el : undefined,
		// set the submit button text
		submitButtonText : "Create Tradelines",
		
		// add schema to common schema
		schema: {
			'totalAus' : {
				type : 'Text',
				title : "Total"
			},
			
			'usedAus' : {
				type : 'Text',
				title : "Used"
			},
			
			'ncRating': {type : 'Select', options: ["None", "Silver", "Gold", "Bronze"]},
			'bcRating': {type : 'Select', options: ["None", "Silver", "Gold", "Bronze"]},
			'moRating': {type : 'Select', options: ["None", "Silver", "Gold", "Bronze"]},

			'creditLimit': {
				type : 'Text',
				name: "creditLimit",
				title : "Credit Limit"				
			},
			
			'cashLimit': {
				type : 'Text',
				name: "cashLimit",
				title : "Cash Limit"				
			},
			
			'balance': {
				type : 'Text',
				name: "balance",
				title : "Balance"				
			},
			
			'cost': {
				type : 'Text',
				name: "cost",
				title : "Cost"				
			},


			'price': {
				type : 'Text',
				name: "price",
				title : "Price"				
			},


			'balance': {
				type : 'Text',
				name: "balance",
				title : "Balance"				
			},
			
			'seller': {type : 'Select', options :  function(callback, editor) {
			       		 var sellers = new sellerCollection();
			       		 sellers.fetch({
			       		 	success: function() {
			       		 		callback(sellers.toJSON());
			       		 	}
			       		 });
		    			}
			},
			'product': {type : 'Select', options :  function(callback, editor) {
			       		 var products = new productCollection();
			       		 products.fetch({
			       		 	success: function() {
			       		 		callback(products.toJSON());
			       		 	}
			       		 });
		    }},
			
			'notes': {
				type : 'TextArea',
				title : "Notes"				
			},
		},
		
		handleModelSuccessError: function(model) {
			this.listenTo(model, 'sync', function(response) {
				var msg = (this.tradelineId)?"updated":"added";
				App.Mediator.trigger("messaging:showAlert", "Tradeline "+msg+" successfully.", "Green");
				history.back(-1);
			}.bind(this));			
		},
		
		// function handles form submission and success and error handling.
		handleFormSubmit : function(values) {
			this.model.set(values);
			this.model.save();
		},
		
		initializeBefore: function(options) {
			this.model = new createModel();
			this.bindModelValidation(this.model);			
			if(options.id) {
				this.tradelineId = options.id;
				this.submitButtonText = "Edit Tradelines";
				this.model.set({id: this.tradelineId});
				this.listenTo(this.model, 'sync',  this.render.bind(this));			
				this.model.fetch();
			}
		}
		
	});
});
