// message.js
// --------------
// Requires define
// Return Message object {Object}

define([
	"base",
	"hbs!core/components/messaging/message"
], function(
	Base,
	viewTemplate
) {
	return Base.extend({
		
		tpl: viewTemplate,
		
		// hooks
		extraHooks : {
			'messaging:showAlert' : ['showMessage'],
			'messaging:hideAlert' : ['hideMessage']
		},
		
		initializeBefore: function() {
			if(!$(".message-area").length)
				$("body").append('<div class="message-area"></div>');
		},
		
		 /*
		 *  type options :
		 *  success (default) - to show success message 
		 *  info  - to show information
		 *  warning - to show warning
		 *  danger - to show error message
		 * */		
		
		showMessage : function(options) {
			this.message = (options && options[0])?options[0]:"";
			this.type = (options && options[1])?options[1]:"success";
			$(".alert-message-h").addClass("alert-"+this.type).removeClass('hide').html(this.message);			
		}, 
		
		hideMessage : function() {
			$(".alert-message-h").html("").removeClass('hide').removeClass("alert-"+this.type);
		},
		
		appendTemplate : function() {
			if(this.tpl)
				$('div.message-area').html(this.tpl(_.extend(this.data, this.model && this.model.toJSON())));
		}

		
	});
});	