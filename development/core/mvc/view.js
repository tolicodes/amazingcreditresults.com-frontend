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
			autoRender: true,

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
			'initialize:before': ['_mergeClassName', '_addInstanceOptions',  '_overwriteOptions', '_setupContainers', '_relayModelCollection'],
			'initialize:after': ['_relayModelCollection', '_autoRender'],
			'render:before': ['appendEl'],
			'render:after': ['_addViews']
		},

		_overwriteOptions: function(){
			_(this).extend(
				_(this.options).pick(['appendTo'])
			);
		},

		_mergeClassName: function(){
			var superChain = this.getSuperChain();
			
			this.className = _(superChain).reduce(function(memo, superView){
				if(superView.className) {
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
		_relayModelCollection: function(){
			if(this.model && !this._relayingModelTriggers) {
				this._relayingModelTriggers = true;
				this.relayTriggers('model');
			}

			if (this.collection && !this._relayingCollectionTriggers) {
				this._relayingCollectionTriggers = true;
				this.relayTriggers('collection');
			}
		},

		_autoRender: function() {
			if (this.options.autoRender) {
				this.render();
			}
		},

		_addViews: function(){
			_(this.views).each(function(view, selector){
				var viewInstance;

				if(!(view.prototype instanceof Backbone.View)) {
					viewInstance = view.apply(this); 
				} else {
					viewInstance = new view;
				}

				this.addView(viewInstance, selector);

			}, this);
		},

		addView: function(view, selector) {
			console.log(view, selector)
			view.parentView = this;

			this._views[selector] = view;

			view.trigger('append:before');

			view.$el.appendTo(this.$(selector));

			view.trigger('append:after');
		},

		close: function() {
			_(this._views).each(function(view) {
				view.close();
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

		appendEl: function(){
			if(this.appendTo) {
				this.$el.appendTo(this.appendTo);
			}
		}
	});

	return hooks.mixInto(view)
});