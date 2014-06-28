// list.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base",
	"hbs!adminManageBuyer/templates/import",
	"../models/import",
	"backboneUploadModel"
	], function(
	Base,
	viewTemplate,
	importBuyer
	) {

	return Base.extend({
		
		tpl: viewTemplate,

		events: {
			'submit .import-form' : 'handleSubmit'
		},

		handleSubmit: function(e) {
			e.preventDefault();
			
			var data = new FormData(),
			importModel = new importBuyer(); 
			files = $(e.target).find("input[type=file]")[0].files[0];
			
			importModel.set('file', files);
			importModel.save();
		},
		
		el: undefined,
		
		initializeBefore: function() {

		}
	});
});
