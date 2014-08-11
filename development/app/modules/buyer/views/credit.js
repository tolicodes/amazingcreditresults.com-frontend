// payment info .js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"../models/credit",
	"hbs!../templates/credit"
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
