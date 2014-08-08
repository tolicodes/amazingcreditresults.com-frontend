define([
	'jquery'
], function(
	$
){
	return {
		init: function(){
			this._checkSessionStorage();
			App.Mediator.on('setSessionKey', this.setAjaxHeaders);
		},
		_checkSessionStorage: function(){
			var sessionStorageKey = sessionStorage.getItem("huntKey");
			if(sessionStorageKey) {
				this.setAjaxHeaders(sessionStorageKey);
			}
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