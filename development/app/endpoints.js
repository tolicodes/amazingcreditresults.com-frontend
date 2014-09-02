define([

], function(

) {

	var base = window.location.origin,
		apiPath = '/api/v1/',
		endpoints = {
			"adminLogin": "owner/login",
			
			"needToSetPassword": "buyer/needToSetPassword",
			"buyerLogin": "buyer/login",
			"buyerSetPassword": "buyer/setPassword",
			
			"myself": "myself",
			
			"createClient": "admin/clients",
			"adminClients": "admin/clients/:id",

			"sellersList": "admin/clients?seller=true",
			"buyersList": "admin/clients?buyer=true",
			"ownersList": "admin/clients?owner=true",

			"resetPassword": "admin/clients/resetPassword/:userId",
			"sendWelcomeEmail": "admin/clients/welcome/:userId",

			"adminProducts": "owner/products",
			
			"tradeline": "tradelines",

			"manageOwner": "admin/owners",
			"modifyOwner": "admin/owners/:id"
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