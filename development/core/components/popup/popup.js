// popup.js
// --------------
// Requires define
// Return Message object {Object}

define([
	"base",
	"hbs!core/components/popup/templates/popup",
	'bootstrapModal'
], function(
	Base,
	viewTemplate
) {
	return Base.extend({
		
		tpl: viewTemplate,
		
		initializeBefore: function(options) {
			this.popupView = options.view;
			this.methodToCall = options.methodToCall;
			if(!$("#popup-area").length)
				$("body").append('<div id="popup-area"></div>');
				
		},
		
		closePopup: function() {
			$('.modal').modal('hide');
		},
		
		afterRender: function() {
			if(this.popupView) {
				var view = new this.popupView;
				console.log(view.el);
				$(".modal-body").html(view.el);
				
				if(this.methodToCall)
					view[this.methodToCall]();
				
			}
			$('.modal').modal();
		},
		
		
		appendTemplate : function() {
			if(this.tpl)
				$('#popup-area').html(this.tpl(_.extend(this.data, this.model && this.model.toJSON())));
		}

		
	});
});	