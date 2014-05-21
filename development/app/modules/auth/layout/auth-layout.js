// info.js
// --------------
// Requires define
// Return Backbone View {Object}


define([
	"baseLayout",
	"hbs!auth/templates/layout",
	"auth/views/login",
	"auth/views/set-password",
	"auth/models/password-needed"
], function(
	BaseLayout,
	templateView,
	loginView,
	setPasswordView,
	passwordneededModel
) {

	return BaseLayout.extend({
		
		template: templateView,
		
		initializeAfter: function(options) {
			if(options && options[0]) {
				this.passwordCheck = new passwordneededModel({id: options[0].apiKey});
				this.options = options;
				this.listenTo(this.passwordCheck, 'sync', this._createPage().bind(this));
				this.listenTo(this.passwordCheck, 'error', function() {});
				this.passwordCheck.fetch();
			}
		},
		
		_createPage: function() {
			
			var viewObject;			
			console.log(this.passwordCheck);
			if(this.passwordCheck.get("needToSetPassword")) {
				viewObject = setPasswordView;
			} else {
				viewObject = (this.options[0].page == "login")?loginView:setPasswordView;				
			}

			var myView = new viewObject(this.options);
			this.setViewInLayout( '.form-view', myView);			
		}			

	});
});
