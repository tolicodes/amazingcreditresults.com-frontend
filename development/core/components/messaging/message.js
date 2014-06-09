// message.js
// --------------
// Requires define
// Return Message object {Object}

define([
	"base",
	"hbs!core/components/messaging/templates/message",
	"core/components/messaging/collections/messages"
], function(
	Base,
	viewTemplate,
	Collection
) {
	return Base.extend({
		
		tpl: viewTemplate,
		
		timeInterval : 10000,
		
		// hooks
		extraHooks : {
			'messaging:showAlert' : ['showMessage'],
			'messaging:hideAlert' : ['hideMessage']
		},
		
		initializeBefore: function() {
			if(!$(".message-area").length)
				$("body").append('<div class="message-area"></div>');
				
			this.collection = new Collection();
				
		},
		
		alertsClass: {
			"Green": "success",
			"Red"  : "danger",
			"Info"   : "info",
			"Yellow": "warning"
		},
		
		afterRender: function() {
			$(".close-btn").click(function() {
				this.hideMessage();
			}.bind(this));
		},
		
		 /*
		 *  type options :
		 *  success (default) - to show success message 
		 *  info  - to show information
		 *  warning - to show warning
		 *  danger - to show error message
		 * */		
		
		showMessage : function(options) {
			if(this.type) this.hideMessage();
			this.message = (options && options[0])?options[0]:"";
			if(this.message) {
				var cls = (options && options[1])?options[1]:"Green";
				var errors = (options && options[2])?options[2]:[];
				this.type = this.alertsClass[cls];
				if(errors) this.showFieldErrors(errors);
				// set message in collection
				this.collection.add({message: this.message, type: this.type });
				// show message on DOM
				$(".alert-message-h").addClass("alert-"+this.type).removeClass('hide').html(this.message);			
				$(".close-btn").show();
				// hide message after 10 seconds
				setTimeout(this.hideMessage.bind(this), this.timeInterval);
			}
		},
			
		// show fields error
		showFieldErrors: function(errors) {
			var html = "";
			_.each(errors, function(ob) {
				if(ob.field) {
					var $target = $("#"+ob.field);
					$target.parent().append("<div class='input-error alert-danger'>"+ob.message+"</div>");
					$target.focus(function() {
						$target.parent().find(".input-error").remove();
					});
					setTimeout(function() {
						$target.parent().find(".input-error").remove();
					}, this.timeInterval);
				} else {
					html += ob.message;
				}
			}.bind(this));
			
			if(html)
				this.showMessage([html, "Red"]);
		},
		
		// hide message
		hideMessage : function() {
			$(".alert-message-h").html("").removeClass('hide').removeClass("alert-"+this.type);
			$(".close-btn").hide();
		},
		
		appendTemplate : function() {
			if(this.tpl)
				$('div.message-area').html(this.tpl(_.extend(this.data, this.model && this.model.toJSON())));
		}

		
	});
});	