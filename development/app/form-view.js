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
			    model: new user(this.data)
			 });
			 
			this.form.render();
			this.$el.html(this.form.el);
			
		},
		
		// validate forms return false if it has errors
		validateForms: function() {
			var errors = this.form.commit();
			console.log(errors);
			return (errors)?false:true;
		},
		
		// return form all values
		getFormValue: function() {
			return this.form.getValue();
		}
		
	});
});
