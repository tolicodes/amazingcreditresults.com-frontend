// home.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"hbs!logout/templates/logout"
], function(
	Base, 
	viewTemplate
) {

	return Base.extend({
		
		el: undefined,

		tpl: viewTemplate,
		
		initializeBefore: function() {
			sessionStorage.removeItem("huntKey");
		}

	});
});
