// base-layout.js
// --------------
// Requires define
// Return Backbone Base View {Object}

define([
	"backbone",
	'hbs!app/common/layout/default',
	"layoutManagers"
	], function(
	Backbone,
	defaultLayout
	) {

	return Backbone.Layout.extend({
		
		template: defaultLayout,
		 
		//el: '.main-view',
		
		// hooks
		hooks : {
			'intialize:before' : ['initializeBefore'],
			'intialize:after' : ['initializeAfter']
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
		
		// before initialize function
		initializeBefore:function() {
			console.log("before initialize");
		},
		
		// after initialize function
		initializeAfter: function() {
			console.log("After initialize");
		},

		
		render: function() {
			return this.template;
		},
		
		initialize: function(options) {
			this.implementHooks();

			// trigger before intialize
			this.trigger('intialize:before', options);

			// render template if renderOnInitialize property is set to true
			this.render();
				
			// trigger after intialize
			this.trigger('intialize:after', options);	

		},
		
		// set view in layout
		setViewInLayout: function(target, ob) {
			Backbone.Layout.setupView(ob);
			this.insertView(target, ob);
		}
		
		
	});
});
