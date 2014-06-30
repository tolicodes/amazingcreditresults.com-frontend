// payment info .js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"buyer/models/credit",
	"hbs!buyer/templates/credit"
], function(
	Base, 
	model,
	viewTemplate
) {

	return Base.extend({
		el : undefined,

		tpl: viewTemplate,

		initializeAfter : function(options) {
			this.model = new model();
			this.listenTo(this.model, 'sync', function(response) {
				this.appendTemplate();
			});
		}
	});
});
