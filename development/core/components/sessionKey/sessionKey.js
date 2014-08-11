define([
	'jquery'
], function(
	$
){
	return {
		init: function(){
			var sessionKey = this.getSessionKey();

			if(sessionKey) {
				this.setAjaxHeaders(sessionKey);
			}
		},
		getSessionKey: function(){
			return sessionStorage.getItem("huntKey");
			
		},
		setSessionKey: function(key){
			sessionStorage.setItem("huntKey", key);
			this.setAjaxHeaders(key);

		},
		setAjaxHeaders: function(key){
			$.ajaxSetup({
				beforeSend: function(request) {
					request.setRequestHeader("huntKey", key);
				}
			});
		}
	}
})