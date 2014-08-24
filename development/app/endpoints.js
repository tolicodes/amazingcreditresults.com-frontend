define([

], function(

) {

	var base = window.location.origin,
		apiPath = '/api/v1/',
		endpoints = {
			"myself": "myself",
			"buyerLogin": "buyer/login",
			"buyerSetPassword": "buyer/setPassword",
			"authSelf": "myself",
			"needToSetPassword": "buyer/needToSetPassword",
			"adminClients": "admin/clients",
			"adminLogin": "owner/login",
			"tradeline": "tradelines",
			"createOwner": "admin/owners",
			"resetPassword": "admin/clients/resetPassword",
			"welcomeEmail": "admin/clients/welcome",
			"adminProduct": "admin/products",
			"products": "owner/products",
			"cart": "cart/tradelines",
			"importBuyer": "owner/bulkImport",
			"createTransaction": "admin/clients/balance",
			"csvFilePath": "owner/clientsExample.csv",
			"seller": "admin/clients?role['seller']=true",
			"adminTradelines": "owner/tradelines",
			"userList": "admin/clients",
			"sellersList": "admin/clients?seller=true",
			"buyersList": "admin/clients?buyer=true"
		},
		addParams = function(url, params) {
			_.each(params, function(p) {
				if (p)
					url += "/" + p;
			});
			return url;
		},
		addFilters = function(url, params) {
			var qFound = false;
			_.each(params, function(p, k, j) {
				if (p) {
					if (!qFound) {
						url += (url.indexOf("?") != -1) ? "&" : "?";
						qFound = true;
					} else {
						url += "&";
					}
					url += k + "=" + p;
				}
			});
			return url;
		};

	return {
		getUrl: function(name, params, filters) {
			var endpoint = endpoints[name];

			if(!endpoint) {
				return;
			}

			var url = base + apiPath + endpoint;
			
			if (params)
				url = addParams(url, params);
			if (filters)
				url = addFilters(url, filters);
			
			return url;
		}
	};

});