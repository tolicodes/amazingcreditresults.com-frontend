// endpoints.js
// --------------
// Requires define

define([], function() {

	var base = window.location.origin,
		apiPath = '/api/v1/',
		endpoints = {
			"buyerLogin": "buyer/login",
			"buyerSetPassword": "buyer/setPassword",
			"authSelf": "myself",
			"needToSetPassword": "buyer/needToSetPassword",
			"adminClients": "admin/clients",
			"saveQuestionnaireAnswers": "buyer/saveQuestionnaireAnswers",
			"adminLogin": "owner/login",
			"tradeline": "tradelines",
			"createOwner": "admin/owners",
			"resetPassword": "admin/clients/resetPassword",
			"welcomeEmail": "admin/clients/welcome",
			"adminProduct": "owner/products",
			"products": "owner/products",
			"cart": "cart/tradelines",
			"importBuyer": "owner/bulkImport", 
			"account": "account",
			"createTransaction": "admin/clients/balance",
			"csvFilePath": "owner/clientsExample.csv",
			"userList": "admin/clients",
			"sellersList": "admin/clients?seller=true",
			"buyersList": "admin/clients?buyer=true",
			"ownersList": "admin/clients?owner=true"
		},

		addParams = function(url, params) {
			_.each(params, function(p) {
				url += "/" + p;
			});
			return url;
		};

	/*
	 * Params eg :
	 * {id: 123, name: sanjay}
	 * */

	return {
		getUrl: function(name, params, huntKey) {
			var endpoint = endpoints[name],
				url = base + apiPath + endpoint;
			if (huntKey) url += "?huntKey=" + sessionStorage.getItem("huntKey");
			if (params) url = addParams(url, params);
			return url;
		}
	};

});