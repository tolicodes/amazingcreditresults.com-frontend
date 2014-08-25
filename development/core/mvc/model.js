define([
	"./modelCollectionMixins",
	"backbone-deep-model"
], function(
	modelCollectionMixins
) {
	var model = Backbone.DeepModel.extend({
		hooks: {
			'initialize:before': ['_implementSeparateUrls']
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
		}
	});

	return modelCollectionMixins.mixInto(model);
});