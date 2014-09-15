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
			 * When does rendering happen
			 * false: manually
			 * initialize: on initialize
			 * append: on append
			 * @type {String|Boolean}
			 */
			renderOn: 'initialize',

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

		/**
		 * Merges options from the super chain
		 * @type {Array}
		 */
		_mergeSuperProperties: ['options'],
		
		/**
		 * Inserts before and after triggers for render and for close
		 * @type {Array}
		 */
		_insertTriggers: ['render', 'close'],

		hooks: {
			'initialize:before': ['_removeClasses', '_bindMessageCB', '_addInstanceOptions', '_overwriteOptions', '_setupContainers', '_relayModelCollection'],
			'initialize:after': ['_relayModelCollection', '_renderOnInitialize'],
			'append:after': ['_renderOnAppend', '_addViews'],
			'render:before': ['_mergeClassName']
		},

		/**
		 * Propagates a trigger to all the children down the cahin
		 * @return {[type]} [description]
		 */
		propagateToChildren: function() {
			var args = _.argsToArray(arguments);

			_(this._views).each(function(view, key) {
				view.trigger.apply(view, args);
				if (view.propagateToChildren) {
					view.propagateToChildren.apply(view, args);
				}
			}, this);
		},

		/**
		 * Appends a view to the object
		 * If the selector doesn't exist on the object it will simply be 
		 * appended to the view and the selector will be used as an 
		 * identifier
		 * @param {Backbone.View} view     View Instance
		 * @param {String} selector The selector
		 */
		addView: function(view, selector) {
			//Closes any existing view if it is attached
			if (this._views[selector]) {
				this._views[selector].close();
			}

			//Attaches parentView pointer
			view.parentView = this;
			this._views[selector] = view;

			view.trigger.call(view, 'append:before', this);
			if (this.$el.closest('html').length) {
				view.trigger.call(view, 'appendInDom:before', this);
			}

			//If the element does not exist, just append to the parent
			//and append the class from the selector
			if(!this.$(selector).length) {
				this.$el
					.append(view.$el)
					.addClass(selector.replace(/\./g, ''));
			} else {
				this.$(selector)
					.html(view.$el);
			}

			view.trigger.call(view, 'append:after', this);
			if (this.$el.closest('html').length) {
				view.trigger.call(view, 'appendInDom:after', this);
			}

			return view;
		},

		/**
		 * Closes all of the subviews. Calls close if there is a close
		 * Otherwise just calls remove (if there are regular Backbone Views)
		 * @return {[type]} [description]
		 */
		close: function() {
			_(this._views).each(function(view) {
				if (view.close) {
					view.close();
				} else {
					view.remove();
				}
			});
			this.remove();
		},

		/**
		 * Compiles template data
		 * @return {[type]} [description]
		 */
		render: function() {
			if (!this.tpl) {
				return;
			}

			var data = this.compileTemplateData();

			this.trigger('appendTemplate:before', data);

			this.$el.html(this.tpl(data));
		},

		/**
		 * Merges model json, instance's templateData and 
		 * option's template data
		 * @return {Object} The data
		 */
		compileTemplateData: function(){
			return _({}).extend(
				this.model ? this.model.toJSON() : {},
				this.templateData || {},
				this.options.templateData || {}
			);
		},

		/**
		 * Appends the Element to a jQuery selector
		 * @return {[type]} [description]
		 */
		appendEl: function() {
			if (this.appendTo) {
				this.trigger('append:before');
				if (this.$el.closest('html').length) {
					this.trigger('appendInDom:before');
				}

				this.$el.appendTo(this.appendTo);

				this.trigger('append:after');
				if (this.$el.closest('html').length) {
					this.trigger('appendInDom:after');
				}
			}
		},

		/**
		 * Copies appendTo from options to instance
		 * @return {[type]} [description]
		 */
		_overwriteOptions: function() {
			_(this).extend(
				_(this.options).pick(['appendTo'])
			);
		},

		/**
		 * Binds Message Callback to instance
		 * @return {[type]} [description]
		 */
		_bindMessageCB: function() {
			_(this).bindAll('messageCB');
		},

		/**
		 * Returns the message callback with options filled
		 * @param  {String} message The message to display
		 * @param  {String} type    Type of message (success, fail, etc)
		 * @return {[type]}         [description]
		 */
		messageCB: function(message, type) {
			return _(this.message).bind(this, message, type);
		},

		message: function(message, type) {
			type = type || 'success';
			this.Mediator.trigger('message', message, type);
		},

		/**
		 * By default Backone will apply the classes before rendering
		 * We only want it to happen on a render
		 * @return {[type]} [description]
		 */
		_removeClasses: function(){
			this.$el.removeClass(this.className);
		},

		_mergeClassName: function() {
			var superChain = this.getSuperChain();

			this.className = _(superChain).reduce(function(memo, superView) {
				if (superView.className) {
					memo += ' ' + superView.className;
				}

				return memo;
			}, this.className || '');

			this.$el.addClass(this.className);
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
			if (this.options.renderOn === 'initialize') {
				this.render();
				this.appendEl();
			}
		},

		_renderOnAppend: function(){
			if(this.options.renderOn === 'append') {
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

				if(!viewInstance) {
					return;
				}

				this.addView(viewInstance, selector);

			}, this);
		}
	});

	return hooks.mixInto(view)
});