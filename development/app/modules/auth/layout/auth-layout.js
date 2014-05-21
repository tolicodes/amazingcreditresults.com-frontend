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
				this.model = new passwordneededModel({id: options[0].apiKey});
				this.options = options;
				this.listenTo(this.model, 'sync', this._createPage());
				this.listenTo(this.model, 'error', function() {});
				this.model.fetch();
			}
		},
		
		_createPage: function() {
			var viewObject = (this.model.get("needToSetPassword") || this.options[0].page == "login")?loginView:setPasswordView;
			var myView = new viewObject(this.options);
			this.setViewInLayout( '.form-view', myView);			
		}			

	});
});
