// endpoints.js
// --------------
// Requires define

define([
	], function(
	) {

	var base = 'http://localhost:8081', 
	apiPath = '/api/v1/', endpoints = {
		'buyer/blah' : function(params) {
			//return "the URL based on params";
		},
		"buyerLogin" : "buyer/login",
		"buyerSetPassword" : "buyer/setPassword",
		"authSelf" : "auth/myself",
		"needToSetPassword": "buyer/needToSetPassword/"
	};

	return {
		getUrl : function(name, params) {
			var endpoint = endpoints[name],
			url = base + apiPath;
			url += _.isFunction(endpoint) ? endpoint(params) : endpoint;
			return  url;
		}
	};

});
