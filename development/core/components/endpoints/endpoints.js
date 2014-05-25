// endpoints.js
// --------------
// Requires define

define([
	], function(
	) {

	var base = window.location.origin, 
	apiPath = '/api/v1/', endpoints = {
		"buyerLogin" : "buyer/login/",
		"buyerSetPassword" : "buyer/setPassword/",
		"authSelf" : "myself/",
		"needToSetPassword": "buyer/needToSetPassword/",
		"adminClients" : "admin/clients/",
		"saveQuestionnaireAnswers": "buyer/saveQuestionnaireAnswers",
		"adminLogin": "owner/login",
		"tradeline": "tradelines"
	},
	
	addParams = function(url, params) {
		_.each(params, function(p) {
			url += p + "/";
		});
		return url;
	};

	/*
	 * Params eg :
	 * {id: 123, name: sanjay} 
	 * */

	return {
		getUrl : function(name, params) {
			var endpoint = endpoints[name],
			url = base + apiPath + endpoint;
			if(params) url = addParams(url, params);
			return  url;
		}
	};

});
