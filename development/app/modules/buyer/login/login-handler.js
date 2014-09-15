define([
	'core/mvc/view',
	'hbs!./login-handler',
	'./need-to-set-password-model',
	'./login-view',
	'./register-view',
	'core/app/app'
], function(
	view,
	loginTpl,
	NeedToSetPasswordModel,
	loginView,
	registerView,
	App
){
	return view.extend({
		tpl: loginTpl,

		views: {
			'.login': loginView,
			'.register': registerView
		},
		
		hooks: {
			'initialize:before': ['checkNeedAuth'],
			'form:submit:success': ['saveSessionKey', 'redirectToDashboard']
		},

		checkNeedAuth: function(params){
			console.log(params);
			var model = new NeedToSetPasswordModel(params);
			model.fetch();
			
			this.listenTo(model, 'sync', function(){
				if(model.get('needToSetPassword')) {
					this._views['.register'].render();
					this.listenTo(this._views['.register'], 'userRegistered', this.doLogin);
				} else {
					this._views['.login'].render();
				}
				this.setModelsKey(params.welcomeKey);
			});
		},

		setModelsKey: function(welcomeKey){
			_(['.login', '.register']).each(function(view){
				if(!this._views[view].model) {
					return;
				}
				
				this._views[view].model.set({
					apiKey: welcomeKey
				})
			}, this);
		},

		doLogin: function(welcomeKey, password) {
			this._views['.login'].doLogin(welcomeKey, password);
		}
	});
});