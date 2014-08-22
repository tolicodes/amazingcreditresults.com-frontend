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
			'user:sync': ['_resolveDfd'],
			'user:error': ['_rejectDdf']
		},

		isAuthed: function() {
			if (!this.user) {
				return this._createUser();
			} else {
				return this.user.syncing ?
					this.authDfd :
					this.fetchUser();
			}
		},

		_resolveDfd: function() {
			this.authDfd.resolve();
		},

		_rejectDdf: function() {
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

		getUser: function() {
			return this.user;
		}
	});
})