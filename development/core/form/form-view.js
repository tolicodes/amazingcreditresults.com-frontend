// form-view.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"core/mvc/view",
	"backbone",
	"backbone-forms",
	"./custom-templates",
	"./custom-editors",
	"backbone-validation"
], function(
	view,
	Backbone,
	BackboneForms,
	customTemplates
) {
	return view.extend({
		hooks: {
			'render:after': ['setupForm', 'renderForm', '_addRequiredMarker'],
			'close:before': 'destroyForm',
			'form:submit': ['saveModel']
		},

		options: {
			saveOnSubmit: true,
			renderOn: 'append'
		},

		events: {
			'click [type="submit"]': 'triggerSubmitForm'
		},

		/**
		 * El of this form
		 */
		$formEl: null,

		setModel: function(model) {
			this.model = model;
			this.form.model = model;
		},

		setupForm: function() {
			if(!this.model && this.FormModel) {
				this.model =  new this.FormModel;
				
				this.relayTriggers('model');
			}

			Backbone.Validation.bind(this);

			var formOpts = {
				model: this.model
			};

			_(formOpts).extend(this.options);

			this.form = new Backbone.Form(formOpts);

			this.relayTriggers('form');
		},

		_addRequiredMarker: function() {
			_(_(this.model).result('validation')).each(function(validations, field) {
				if (validations.required) {
					this.form.fields[field].$('label').append('<span class="required">*</span>');
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
			this.$formEl.html(this.form.$el);
		},

		destroyForm: function() {
			this.form && this.form.remove();
		}
	});
});