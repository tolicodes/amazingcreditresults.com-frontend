// base-view.js
// --------------
// Requires define
// Return Backbone Base View {Object}

define([
	"backbone",
	"backboneValidator"
	], function(
	Backbone
	) {

	return Backbone.View.extend({
		
		// propety to manage that view in layout manager
		manage: true,

		// property to call render on initialize
		renderOnInitialize : true,

		// template function
		tpl : false,
		
		// set dat ain this variable
		data: {},

		// default target element
		el : '.main-container',

		// hooks
		hooks : {
			'intialize:before' : ['initializeBefore'],
			'intialize:after' : ['initializeAfter'],
			'render:before': ['beforeRender'],
			'render:after': ['afterRender']
		},

		// function to implemnt hooks
		implementHooks : function() {
			var _self = this;
			if (this.hooks) {
				_.each(this.hooks, function(hookCallbacks, hookName) {
					_self.listenTo(_self, hookName, function() {
						var arg = arguments;
						_.each(hookCallbacks, function(hookTriggerFn) {
							if (_.isFunction(_self[hookTriggerFn]))
								_self[hookTriggerFn](arg);
						});
					});
				});
			}
		},
		
		addViewHooks: function() {
			if(this.extraHooks) {
				_.each(this.extraHooks, function(methods, name) {
					this.hooks[name] = methods;
				}.bind(this));
			}
		},
		
		// bind validation model
		bindModelValidation: function(model) {
			Backbone.Validation.bind(this, {
		      model: model
		    });
		},

		// bind validation collection
		bindCollectionValidation: function(collection) {
			 Backbone.Validation.bind(this, {
		      collection: collection
		    });
		},



		// main initialize function
		initialize : function(options) {
			this.addViewHooks();
			this.implementHooks();

			if(options && options[0])
				options = options[0];

			this.trigger('objectModifications');
			
			// trigger before intialize
			this.trigger('intialize:before', options);

			// render template if renderOnInitialize property is set to true
			if (this.renderOnInitialize)
				this.render();
				
			// trigger after intialize
			this.trigger('intialize:after', options);	
				
		},

		render : function() {
			// trigger before render
			this.trigger('render:before');
			this.appendTemplate();
			// trigger after render
			this.trigger('render:after');
		},
		
		appendTemplate: function() {
			// if tpl is defined
			if (this.tpl)
				this.$el.html(this.tpl(_.extend(this.data, this.model && this.model.toJSON())));
		}
	});
});
