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
		
		// validation status Default: true
		bindValidation: true,
		
		initialize: function() {
			
			if(this.autoFetch) this.fetch();

			if(this.bindValidation) {
				this.bind('validated:valid', function(model, errors) {
					if(this.successValidation && _.isFunction(this.successValidation))
						this.successValidation();
				}.bind(this));
				
				// bind model validations
				this.bind('validated:invalid', function(model) {
					if(this.showErrors && _.isFunction(this.showErrors))
						this.showErrors(model);
				}.bind(this));
			}
			
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
			var errors = [];
			_.each(model.validationError, function(err, field) {
				errors.push({message: err, field: field});
			});
			console.log(errors);
			App.Mediator.showFieldErrors(errors);
		}
		
	});
});
