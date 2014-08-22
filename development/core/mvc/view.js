define([
	"backbone",
	"core/hooks/hooks",
	"core/mediator/mediator"
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
			'initialize:before': ['_addInstanceOptions', '_overwriteOptions', '_setupSubViewsContainer', '_relayMediator', '_relayModelCollection'],
			'initialize:after': ['_relayModelCollection', '_autoRender'],
			'render:before': ['appendEl']
		},

		Mediator: Mediator,

		_overwriteOptions: function(){
			_(this).extend(
				_(this.options).pick(['appendTo'])
			);
		},

		_addInstanceOptions: function(options) {
			_(this.options).extend(options);
		},
		
		_setupSubViewsContainer: function() {
			this._views = {};
		},

		_relayMediator: function(){
			this.relayTriggers('Mediator');
			this.relayTriggers('M', this.Mediator);
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

		addView: function(selector, view) {
			this._views[selector] = view;

			view.$el.appendTo(this.$(selector));
		},

		close: function() {
			_(this._views).each(function(view) {
				view.remove();
			});
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