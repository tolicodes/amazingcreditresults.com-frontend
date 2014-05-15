// message.js
// --------------
// Requires define
// Return Message object {Object}

define([
	"backbone"
], function(
	Backbone
) {
	return Backbone.View.extend({
		/*
		 *  type options :
		 *  success (default) - to show success message 
		 *  info  - to show information
		 *  warning - to show warning
		 *  danger - to show error message
		 * */
		
		// hooks
		hooks : {
			'messaging:showAlert' : ['showMessage'],
			'messaging:hideAlert' : ['hideMessage']
		},
		
		implementHooks : function() {
			var _self = this;
			if (this.hooks) {
				_.each(_self.hooks, function(hookCallbacks, hookName) {
					console.log(hookName);
					_self.listenTo(_self, hookName, function(a) {
						var arg = arguments;
						if (_.isArray(hookCallbacks)) {
							_.each(hookCallbacks, function(hookTriggerFn) {
								if (_.isFunction(_self[hookTriggerFn]))
									_self[hookTriggerFn](arg);
							});
						}
					});
				});
			}
		}, 
		
		initialize: function() {
			this.implementHooks();
		},
		
		showMessage : function(options) {
			console.log(options);
			this.message = (options && options[0])?options[0]:"";
			this.type = (options && options[1])?options[1]:"success";
			$(".alert-message-h").addClass("alert-"+this.type).removeClass('hide').html(this.message);			
		}, 
		
		hideMessage : function() {
			$(".alert-message-h").html("").removeClass('hide').removeClass("alert-"+this.type);
		}
	});
});	