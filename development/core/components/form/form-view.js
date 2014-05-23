// form-view.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"backbone",
	"backboneForms"
], function(
	Base, 
	Backbone,
	BackboneForms
) {
	return Base.extend({

		afterRender: function() {
			var user = Backbone.Model.extend({
				schema: this.schema
			});
			
			this.form = new Backbone.Form({
			    model: new user((this.model)?this.model.toJSON():{}),
			    'submitButton': this.submitButtonText
			 });
			 
			this.form.on('submit', function(form, titleEditor, extra) {
			  form.preventDefault();
			  
			  if(!this.validateForms()) {
			  	var values = this.getFormValue();
			  	 this.handleFormSubmit(values);
			  }
			}.bind(this));
			 
			 
			this.form.render();
			this.$el.html(this.form.el);
		},
		
		// validate forms return false if it has errors
		validateForms: function() {
			var errors = this.form.commit();
			return !!errors;
		},
		
		// return form all values
		getFormValue: function() {
			return this.form.getValue();
		}
		
	});
});
