// base-view.js
// --------------
// Requires define
// Return Backbone Base View {Object}

define([
	"backbone",
	"core/components/endpoints/endpoints",
	"backboneValidator"
	], function(
	Backbone,
	EndPoint
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
		el : '.main-view',

		// hooks
		hooks : {
			'intialize:before' : ['initializeBefore'],
			'intialize:after' : ['initializeAfter'],
			'render:before': ['beforeRender'],
			'render:after': ['afterRender']
		},
		
		// function to implemnt hooks
		implementHooks : function() {
			_.each(this.hooks, function(callbacks, key){
				_.each(callbacks, function(callback) {
					this.listenTo(this, key, this[callback]);
				}, this);
			}, this);
		},
		
		getUrl: function(name, params, addHuntKey) {
			return EndPoint.getUrl(name, params, addHuntKey);
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
			this.bindSuccessMethod(model);
		},

		// bind validation collection
		bindCollectionValidation: function(collection) {
			Backbone.Validation.bind(this, {
		      collection: collection
		    });
			this.bindSuccessMethod(model);
		},
		
		bindSuccessMethod: function(model) {
			this.listenTo(model, 'error', function(model, response) {
				var json = (response.responseText)?JSON.parse(response.responseText):{};
				App.Mediator.trigger("messaging:showAlert", json.Error, "Red", json.errors);
			}.bind(this));
			
			model.successValidation = function() {
				if(this.handleModelSuccessError && _.isFunction(this.handleModelSuccessError))
					this.handleModelSuccessError(model);
			}.bind(this);			
		},

		// main initialize function
		initialize : function(options) {
			this.addViewHooks();
			this.implementHooks();

			if(options && options[0])
				options = options[0];

			this.trigger('objectModifications');

			this.trigger('addActionItems');			
			
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
			
			return this;
		},
		
		appendTemplate: function() {
			var json = _.extend(this.data, this.model && this.model.toJSON());
			//this.trigger('after:compileJSON', json);
			// if tpl is defined
			if (this.tpl) this.$el.html(this.tpl(json));
		}
	});
});
