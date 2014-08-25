define([
	"backbone",
	"core/hooks/hooks",

], function(
	Backbone,
	hooks,
	Mediator
) {
	var view = Backbone.View.extend({
		options: {
			/**
			 * Does the view render on initialize
			 */
			renderOnInitialize: true,

			/**
			 * Does the view render on appending
			 * @type {Boolean}
			 */
			renderOnAppend: false,

			/**
			 * Data that would be merged into the templateData
			 * @type {Object}
			 */
			templateData: null
		},

		/**
		 * Data that would be merged into the template
		 * @type {[type]}
		 */
		templateData: null,

		_mergeSuperProperties: ['options'],
		_insertTriggers: ['render', 'close'],

		hooks: {
			'initialize:before': ['_mergeClassName', '_addInstanceOptions', '_overwriteOptions', '_setupContainers', '_relayModelCollection'],
			'initialize:after': ['_relayModelCollection', '_renderOnInitialize'],
			'render:before': ['appendEl'],
			'append:after': ['_renderOnAppend', '_addViews']
		},

		_overwriteOptions: function() {
			_(this).extend(
				_(this.options).pick(['appendTo'])
			);
		},

		_mergeClassName: function() {
			var superChain = this.getSuperChain();

			this.className = _(superChain).reduce(function(memo, superView) {
				if (superView.className) {
					memo += ' ' + superView.className;
				}

				return memo;
			}, this.className || '');

			this.$el.attr('class', this.className);
		},

		_addInstanceOptions: function(options) {
			_(this.options).extend(options);
		},

		_setupContainers: function() {
			this._views = {};
			this.templateData = {};
		},

		/**
		 * For relaying model and collection triggers. Checks once before
		 * initialize and once after
		 * @return {[type]} [description]
		 */
		_relayModelCollection: function() {
			if (this.model && !this._relayingModelTriggers) {
				this._relayingModelTriggers = true;
				this.relayTriggers('model');
			}

			if (this.collection && !this._relayingCollectionTriggers) {
				this._relayingCollectionTriggers = true;
				this.relayTriggers('collection');
			}
		},

		_renderOnInitialize: function() {
			if (this.options.renderOnInitialize && 
				!this.options.renderOnAppend) {
				this.render();
			}
		},

		_addViews: function() {
			_(this.views).each(function(view, selector) {
				var viewInstance;

				if (!(view.prototype instanceof Backbone.View)) {
					viewInstance = view.apply(this);
				} else {
					viewInstance = new view;
				}

				this.addView(viewInstance, selector);

			}, this);
		},

		propagateToChildren: function() {
			var args = _.argsToArray(arguments);

			_(this._views).each(function(view, key){
				view.trigger.apply(view, args);
				if(view.propagateToChildren) {
					view.propagateToChildren.apply(view, args);
				}
			}, this);
		},

		addView: function(view, selector) {
			if (this._views[selector]) {
				this._views[selector].close();
			}

			view.parentView = this;
			this._views[selector] = view;

			view.trigger.call(view, 'append:before', this);
			if(this.$el.closest('html').length) {
				view.trigger.call(view, 'appendInDom:before', this);
			}

			this.$(selector).html(view.$el);

			view.trigger.call(view, 'append:after', this);
			if(this.$el.closest('html').length) {
				view.trigger.call(view, 'appendInDom:after', this);
			}
		},

		close: function() {
			_(this._views).each(function(view) {
				if(view.close) {
					view.close();
				} else {
					view.remove();
				}
			});
			this.remove();
		},

		render: function() {
			var data = _({}).extend(
				this.model ? this.model.toJSON() : {},
				this.templateData || {},
				this.options.template || {}
			);

			if (!this.tpl) {
				return;
			}

			this.$el.html(
				this.tpl(data)
			);
		},

		appendEl: function() {
			if (this.appendTo) {
				this.$el.appendTo(this.appendTo);
			}
		}
	});

	return hooks.mixInto(view)
});