define([
	'core/mvc/controller'
], function(
	Controller
) {
	return Controller.extend({
		hooks: {
			'initialize:after': ['checkSessionStorage'],
			'M:logout': ['destroySessionKey']
		},
		
		checkSessionStorage: function() {
			var sessionKey = this.getSessionKey();

			if (sessionKey) {
				this.setAjaxHeaders(sessionKey);
			}
		},
		
		getSessionKey: function() {
			return sessionStorage.getItem("huntKey");

		},
		
		setSessionKey: function(key) {
			sessionStorage.setItem("huntKey", key);
			this.setAjaxHeaders(key);

		},
		
		destroySessionKey: function() {
			sessionStorage.removeItem("huntKey");
			this.unsetAjaxHeaders();
		},

		setAjaxHeaders: function(key) {
			$.ajaxSetup({
				headers: {
					'huntKey': key
				}
			});
		},
		unsetAjaxHeaders: function() {
			$.ajaxSetup({
				headers: {
					'huntKey': ''
				}
			});
		}
	});
})