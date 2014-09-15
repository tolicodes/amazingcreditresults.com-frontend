define([

], function(

) {

	var base = window.location.origin,
		apiPath = '/api/v1/',
		endpoints = {
			"adminLogin": "owner/login",
			
			"needToSetPassword": "buyer/needToSetPassword/:welcomeKey",
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

			"manageTradelines": "owner/tradelines",

			"manageProducts": "owner/products",
			"manageProduct": "owner/products/:id",
			
			"tradelinesList": "tradelines",

			"adminTradelines": "owner/tradelines",
			"adminTradelinesModify": "owner/tradelines/:id",

			"cart": 'cart/tradelines',

			"addCart": 'cart/tradelines',
			'removeCart': 'cart/tradelines/:id',

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