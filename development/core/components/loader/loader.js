// loader.js
// --------------
// Requires define
// Return Message object {Object}

define([
	"base",
	"hbs!core/components/loader/templates/loader"
], function(
	Base,
	viewTemplate
) {
	return Base.extend({
		
		tpl: viewTemplate,
		
		initializeBefore: function(options) {
			if(!$("#loader-area").length)
				$("body").append('<div id="loader-area"></div>');
		},
		
		showLoader: function() {
			$("#loader-area").removeClass("hide");
			// hide loader in 20 seconds
			setTimeout(this.hideLoader.bind(this), 20000);
		},

		hideLoader: function() {
			$("#loader-area").addClass("hide");
		},
		
		appendTemplate : function() {
			if(this.tpl)
				$('#loader-area').html(this.tpl(_.extend(this.data, this.model && this.model.toJSON())));
		}
	});
});	