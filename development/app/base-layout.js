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
			_.each(this.hooks, function(callbacks, key){
				_.each(callbacks, function(callback) {
					this.listenTo(this, key, this[callback]);
				}, this);
			}, this);
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

			// render template
			this.render();
				
			// trigger after intialize
			this.trigger('intialize:after', options);
			
			this.$el.find("a[href='"+Backbone.history.location.hash+"']").parent().addClass("active");	
		},
		
		removeViewFromLayout: function(v) {
			
			this.getViews(v).each(function(view) {
			  view.removeView();
			});
		},

		//addedViews: [],
		
		// set view in layout
		setViewInLayout: function(target, ob, setUpView) {
			Backbone.Layout.setupView(ob);
			//this.addedViews.push(target);
			if(setUpView)
				this.setView(target, ob);
			else
				this.insertView(target, ob);	
		}
		
	});
});
