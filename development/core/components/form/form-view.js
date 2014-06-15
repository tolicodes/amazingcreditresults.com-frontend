// form-view.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"backbone",
	"backboneForms"
	//"./custom-templates"
], function(
	Base, 
	Backbone,
	BackboneForms
) {
	return Base.extend({
		// if we need to insert inside view define the target here
		formArea: undefined,
		
		// form class needs to be added
		formClass: undefined,
		
		// hooks
		extraHooks : {
			'objectModifications' : ['objectModification'],
			'after:compileJSON': ['addRequiredAttribute']
		},
		
		// before render
		objectModification: function() {
			// add schema objects
			if(this.addSchema) {
				_.each(this.addSchema, function(attr, name) {
					this.schema[name] = attr;
				}.bind(this));
			}
		},
		
		formReset: function() {
			this.$el.find("form")[0].reset();
		},
		
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
			
			if(this.formClass) {
				this.form.$el.addClass(this.formClass);
			}
			
			if(this.formArea)
				this.$el.find(this.formArea).html(this.form.el);
			else
				this.$el.html(this.form.el);
				
		},
		
		addRequiredAttribute: function(json){
			console.log(json);
			//_(json).each(function(field){
				
			//});
		},
		
		// reset form values
		
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
