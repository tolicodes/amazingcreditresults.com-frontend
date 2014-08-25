define([
	"core/mvc/controller"
], function(
	Controller
) {
	return Controller.extend({
		/**
		 * Will hold the deferred for getting the User Model
		 * @type {JQuery.Deferred}
		 */
		authDfd: null,

		hooks: {
			'initialize:before': '_setupAuthorizationsHash',
			'user:sync': ['_resolveDfd'],
			'user:error': ['_rejectDdf'],
			'M:logout': 'destroyUser'
		},

		/**
		 * Is user authenticated (logged in)
		 * @return {JQuery.Deferred} [description]
		 */
		isAuthenticated: function() {
			if (!this.user) {
				return this._createUser();
			} else {
				return this.authDfd;
			}
		},

		_setupAuthorizationsHash: function(){
			this.authorizations = _({}).extend(this.options.authorizations);
		},

		_resolveDfd: function() {
			this.Mediator.trigger('auth:success');
			this.authDfd.resolve();
		},

		_rejectDdf: function() {
			this.Mediator.trigger('auth:fail');
			this.authDfd.reject();
		},

		_createUser: function() {
			this.user = new this.options.UserModel();
			this.relayTriggers('user');

			return this.fetchUser();
		},

		fetchUser: function() {
			this.authDfd = this.authDfd || $.Deferred();
			this.user.fetch();
			return this.authDfd;
		},

		destroyUser: function() {
			delete this.user;
			this.authDfd = null;
		},

		getUser: function() {
			return this.user;
		}
	});
})