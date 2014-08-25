define([
	'core/hooks/hooks',
	"endpoints"
], function(
	hooks,
	endpoints
){
	var mixin = {
		// fetch the model automatically if set to true
		autoFetch: false,

		fetchDfd: null,
		
		// has the model been fetched
		fetched: false,

		syncing: false,

		hooks: {
			'initialize:before': ['_listenToSync', '_parseUrl', '_implementAutoFetch'],
			'success': 'handleServerSuccess',
			'error': 'handleServerError'
		},

		_implementAutoFetch: function(){
			if (this.autoFetch) this.fetch();
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

			var responseText = response.responseText;
			var out = null;

			try {
				out = JSON.parse(response.responseText).errors;
				this.Mediator.trigger('server:error', out, response.status);
			} catch (e) {
				out = response.responseText;
				this.Mediator.trigger('server:rawError', out, response.status);
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
	};

	return {
		mixInto: function(child){
			child = hooks.mixInto(child);

			return child.extend(mixin);
		}
	};
})