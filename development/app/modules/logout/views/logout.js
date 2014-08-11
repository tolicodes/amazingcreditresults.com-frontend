// home.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"hbs!../templates/logout",
	"hbs!../templates/timeout-logout"
], function(
	Base, 
	logoutTemplate,
	timeOutLogoutTemplate
) {

	return Base.extend({
		
		el: undefined,

		
		
		initializeBefore: function(options) {
			if(options.sessionOut)
				this.tpl = timeOutLogoutTemplate;
			else
				this.tpl = logoutTemplate;	
				
			sessionStorage.removeItem("huntKey");
		}

	});
});
