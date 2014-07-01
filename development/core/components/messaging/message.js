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
		
		showMessage : function(message, clas, errors) {
			console.log(arguments);
			if(this.type) this.hideMessage();
			var cls = (clas)?clas:"Green", 
			errors = (errors)?errors:[];
			
			this.message = message;
			this.type = this.alertsClass[cls];
			if(errors) this.showFieldErrors(errors);

			if(this.message && this.message != "undefined") {
				// set message in collection
				this.collection.add({message: this.message, type: this.type });
				// show message on DOM
				$(".alert-message-h").addClass("alert-"+this.type).removeClass('hide').html(this.message);			
				$(".close-btn").show();
				// hide message after 10 seconds
				setTimeout(this.hideMessage.bind(this), this.timeInterval);
			}
		},
		
		getFieldName: function(field) {
			if(field.indexOf(".") != -1) {
				var s = field.split(".");
				return s[s.length - 1];
			} else {
				return field;
			}
		},
			
		// show fields error
		showFieldErrors: function(errors) {
			var html = "", field;
			_.each(errors, function(ob) {
				if(ob.field) {
					field = this.getFieldName(ob.field);
					var $target = $("*[name="+field+"]");
					$target.parent().parent().find("div[data-error]").html(ob.message);
					$target.focus(function() {
						$target.parent().parent().find("div[data-error]").html("");
					});
				} else {
					html += ob.message;
				}
			}.bind(this));
			if(html) this.showMessage(html, "Red");
		},
		
		// hide message
		hideMessage : function() {
			$(".alert-message-h").html("").addClass('hide').removeClass("alert-"+this.type);
			$(".close-btn").hide();
		},
		
		appendTemplate : function() {
			if(this.tpl)
				$('div.message-area').html(this.tpl(_.extend(this.data, this.model && this.model.toJSON())));
		}

		
	});
});	