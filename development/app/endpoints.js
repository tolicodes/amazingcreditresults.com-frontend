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
			"createClient": "admin/clients",
			"adminClients": "admin/clients/:id",
			"adminLogin": "owner/login",
			"tradeline": "tradelines",
			"createOwner": "admin/owners",
			
			"resetPassword": "admin/clients/resetPassword/:userId",
			"sendWelcomeEmail": "admin/clients/welcome/:userId",
			
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
		getUrl: function(name, model) {
			if(!name) {
				throw Error("No URL specified");
			}

			var endpoint = endpoints[name];

			if(!endpoint) { return name }

			var namedParams = /:\w+/g;

			_(endpoint.match(namedParams)).each(function(param){
				endpoint = endpoint.replace(param, model.get(param.substring(1)));
			}, this);

			var url = base + apiPath + endpoint;
			
			return url;
		}
	};

});