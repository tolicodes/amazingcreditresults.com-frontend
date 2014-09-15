define([
	"./modelCollectionMixins",
	"backbone-deep-model"
], function(
	modelCollectionMixins
) {
	var model = Backbone.DeepModel.extend({
		hooks: {
			'initialize:before': ['_implementSeparateUrls'],
			'sync:after': ['_implementSyncMessages']
		},

		_insertTriggers: ['sync'],

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

				return oldSync.call(this, method, model, options);
			}.bind(this)
		},

		_implementSyncMessages: function(dfd, method) {
			if(this.syncMessages && this.syncMessages[method]) {
				dfd.done(function(){
					this.Mediator.trigger('message', this.syncMessages[method], 'success');
				}.bind(this));
			}

			return dfd;
		}
	});

	return modelCollectionMixins.mixInto(model);
});