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

	// extend backbone validation
	_.extend(Backbone.Validation.patterns, {
		passwordValidation: /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/
	});

	// overiding method these are creating issues in select box (remove all optons from select box)
	_.extend(Backbone.Validation.callbacks, {
		valid: function(view, attr, selector) {},
		invalid: function(view, attr, error, selector) {}

	});

	return Backbone.Model.extend({
		// fetch the model automatically if set to true
		autoFetch: false,

		// has the model been fetched
		fetched: false,

		// jquery Deferred Object
		fetchedDfd: false,

		// validation status Default: true
		bindValidation: true,

		initialize: function() {

			if (this.autoFetch) this.fetch();

			if (this.bindValidation) {
				this.bind('validated:valid', function(model, errors) {
					if (this.successValidation && _.isFunction(this.successValidation))
						this.successValidation();
				}.bind(this));

				// bind model validations
				this.bind('validated:invalid', function(model) {
					if (this.showValidationErrors && _.isFunction(this.showValidationErrors))
						this.showValidationErrors(model);
				}.bind(this));
			}

			this.bind("error", this.defaultErrorHandler);
		},

		defaultErrorHandler: function(event, xhr) {
			if (xhr.status >= 500) {
				var message = 'Oops, something is wrong with our server :-(. Please try again later.';
				App.Mediator.trigger("messaging:showAlert", message, "Red");
			}
		},

		// get the url
		getUrl: function(name, params, addHuntKey) {
			return EndPoint.getUrl(name, params, addHuntKey);
		},

		// fetch data
		fetch: function() {
			this.fetchedDfd = new $.Deferred();

			this.listenTo(this, 'sync', function() {
				this.fetched = true;
				this.fetchedDfd.resolve.apply(this, arguments);
			}.bind(this));

			this.listenTo(this, 'error', function(model, response) {
				this.fetched = false;
				this.fetchedDfd.reject.apply(this, arguments);
				var json = (response.responseText) ? JSON.parse(response.responseText) : {};
				App.Mediator.trigger("messaging:showAlert", json.Error, "Red", json.errors);
			}.bind(this));

			return Backbone.Model.prototype.fetch.apply(this, arguments);
		},

		// fetch data
		save: function() {
			this.listenTo(this, 'error', function(model, response) {
				var json = (response.responseText) ? JSON.parse(response.responseText) : {};
				App.Mediator.trigger("messaging:showAlert", json.Error, "Red", json.errors);
			}.bind(this));
			return Backbone.Model.prototype.save.apply(this, arguments);
		},

		showValidationErrors: function(model) {
			var errors = [];
			_.each(model.validationError, function(err, field) {
				errors.push({
					message: err,
					field: field
				});
			});
			App.Mediator.showFieldErrors(errors);
		}

	});
});