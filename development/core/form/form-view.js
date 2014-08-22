// form-view.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"core/mvc/view",
	"backbone",
	"backbone-forms",
	"./custom-templates",
	"backbone-validation"
], function(
	view,
	Backbone,
	BackboneForms,
	customTemplates
) {
	return view.extend({
		hooks: {
			'initialize:before': ['setupForm'],
			'render:after': ['renderForm'],
			'close:before': 'destroyForm',
			'form:submit': ['saveModel']
		},

		options: {
			saveOnSubmit: true
		},

		events: {
			'click [type="submit"]': 'triggerSubmitForm'
		},

		/**
		 * El of this form
		 */
		$formEl: null,

		setupForm: function() {
			this.model = this.formModel && new this.formModel;
			Backbone.Validation.bind(this);

			var formOpts = {
				model: this.model
			};

			this._copyRequired(this.model);

			_(formOpts).extend(this.options);

			this.form = new Backbone.Form(formOpts);

			this.relayTriggers('form');
		},

		_copyRequired: function(model) {
			_(model.validation).each(function(validations, field) {
				if (validations.required) {
					var existingSchema = model.schema[field];

					if (_(existingSchema).isString()) {
						model.schema[field] = {
							type: existingSchema,
							required: true
						};
					} else {
						model.schema[field].required = true;
					}
				}
			}, this);
		},

		/**
		 * Saves model
		 * @return {[type]}
		 */
		saveModel: function() {
			var errors = this.form.commit({
				validate: true
			});

			if (errors) {
				return;
			}

			if (this.options.saveOnSubmit) {
				this.listenToOnce(this.form.model, 'sync', function() {
					this.trigger('form:submit:success', this.model)
				});

				this.listenToOnce(this.form.model, 'error', function() {
					this.trigger('form:submit:fail', this.model)
				});

				this.form.model.save();
			}
		},

		triggerSubmitForm: function(e) {
			e.preventDefault();
			this.form.trigger('submit');
		},

		renderForm: function() {
			this.$formEl = this.$formEl ?
				this.$(this.$formEl) :
				this.$el;

			this.form.render();

			this.form.$el.appendTo(this.$formEl);
		},

		destroyForm: function() {
			this.form.remove();
		}
	});
});