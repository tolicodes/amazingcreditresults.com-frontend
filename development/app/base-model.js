// base-model.js
// --------------
// Requires define
// Return Backbone Base Model {Object}

define([
	"backbone",
	"core/components/endpoints/endpoints",
	"backboneValidator"
	], function(
	Backbone,
	EndPoint
	) {

	return Backbone.Model.extend({
		// fetch the modelautomatically if set to true
		autoFetch: false,
		
		// has the model been fetched
		fetched: false,
		
		// jquery Deferred Object
		fetchedDfd: false,
		
		initialize: function() {
			if(this.autoFetch) this.fetch();
		},
		
		// get the url
		getUrl: function(name, params) {
			return EndPoint.getUrl(name, params);
		},
		
		// fetch data
		fetch: function() {
			this.fetchedDfd = new $.Deferred();
			
			this.listenTo(this, 'sync', function() {
				this.fetched = true;
				this.fetchedDfd.resolve.apply(this, arguments);
			}.bind(this));

			this.listenTo(this, 'error', function() {
				this.fetched = false;
				this.fetchedDfd.reject.apply(this, arguments);
			}.bind(this));
			return Backbone.Model.prototype.fetch.apply(this, arguments);
		},
		
		// show errors
		showErrors: function(model) {
			var msg = "";
			_.each(model.validationError, function(err, field) {
				msg += "<p>"+err+"</p>";
			});
			if(msg) App.Mediator.trigger("messaging:showAlert", msg, "Red");
		}
		
		
	});
});
