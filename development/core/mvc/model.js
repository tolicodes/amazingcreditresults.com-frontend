define([
	"core/hooks/hooks",
	"backbone",
	"endpoints",
	"core/mediator/mediator"
], function(
	hooks,
	Backbone,
	endpoints,
	Mediator
) {
	var model = Backbone.Model.extend({
		// fetch the model automatically if set to true
		autoFetch: false,

		fetchDfd: null,
		
		// has the model been fetched
		fetched: false,

		syncing: false,

		Mediator: Mediator,

		hooks: {
			'initialize:before': ['_listenToSync', '_parseUrl', '_implementSeparateUrls', '_implementAutoFetch'],
			'success': 'handleServerSuccess',
			'error': 'handleServerError'
		},

		_implementAutoFetch: function(){
			if (this.autoFetch) this.fetch();
		},

		/**
		 * Implements separate URLs for different url
		 * @return {[type]}
		 */
		_implementSeparateUrls: function(){
			if (!this.urls) {
				return;
			}

			var oldSync = this.sync;

			this.sync = function(method, model, options) {
				options = options || {};

				var url = this.urls[method];

				if(!url) {
					throw Error("Url not implemented for " + method);
				}

				options.url = this.getUrl(this.urls[method]);

				this.syncing = true;

				return oldSync.apply(this, arguments);
			}
		},

		handleServerSuccess: function(json){
			this.fetched = true;
			this.syncing = false;

			if(json.message) {
				this.Mediator.trigger('server:message', json.message);
			}
		},

		handleServerError: function(model, response) {
			this.fetched = false;
			this.syncing = false;

			var json = response.responseText && JSON.parse(response.responseText);
			
			if(json && json.errors) {
				this.Mediator.trigger('server:error', json.errors, response.status);
			} else {
				this.Mediator.trigger('server:rawError', response, response.status);
			}
		},

		_parseUrl: function(){
			if(_.isString(this.url)) {
				this.url = endpoints.getUrl(this.url) || this.url;
			}
		},

		// get the url
		getUrl: function(url) {
			return endpoints.getUrl(url);
		},

		// fetch data
		fetch: function() {
			return this.fetchDfd = Backbone.Model.prototype.fetch.apply(this, arguments);
		}
	});

	return hooks.mixInto(model);
});