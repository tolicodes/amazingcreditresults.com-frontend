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
			if(options) {
				this.passwordCheck = new passwordneededModel({id: options.apiKey});
				this.options = options;
				this.listenTo(this.passwordCheck, 'sync', this._createPage.bind(this));
				this.listenTo(this.passwordCheck, 'error', function(model, response) {
					var json = (response.responseText)?JSON.parse(response.responseText):{};
					App.Mediator.trigger("messaging:showAlert", json.Error, "Red");
				});
				this.passwordCheck.fetch();
			}
		},
		
		showView: function(viewObject) {
			if(!viewObject)
				viewObject = loginView;
			
			// pass controller object in options
			this.options.layoutObject = this;
			
			var myView = new viewObject(this.options);
			this.setViewInLayout( '.form-view', myView);						
		},
		
		
		showUserName: function() {
			var name = (this.passwordCheck.get("name").givenName)?this.passwordCheck.get("name").givenName:"-";
			name += " ";
			name += (this.passwordCheck.get("name").familyName)?this.passwordCheck.get("name").familyName:"-";
			$(".username").html(name);
		},
		
		_createPage: function() {
			
			// show user name 
			this.showUserName();
			
			var viewObject = (this.passwordCheck.get("needToSetPassword"))?setPasswordView:loginView;
			this.showView(viewObject);
		}			

	});
});
