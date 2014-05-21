// endpoints.js
// --------------
// Requires define

define([
	], function(
	) {

	var base = 'http://localhost:8081', 
	apiPath = '/api/v1/', endpoints = {
		"buyerLogin" : "buyer/login/",
		"buyerSetPassword" : "buyer/setPassword/",
		"authSelf" : "auth/myself/",
		"needToSetPassword": "buyer/needToSetPassword/",
		"adminClients" : "admin/clients/",
		"saveQuestionnaireAnswers": "buyer/saveQuestionnaireAnswers"
	},
	addParams = function(url, params) {
		console.log(url);
		_.each(params, function(p) {
			url += p + "/";
		});
		console.log(url);
		return url;
	};

	/*
	 * Params eg :
	 * {id: 123, name: sanjay} 
	 * */

	return {
		getUrl : function(name, params) {
			var endpoint = endpoints[name],
			url = base + apiPath;
			if(params) url = addParams(url, params);
			return  url;
		}
	};

});
