define([
  "backbone",
  "hbs!buyer/templates/payment-info"
], function(
  Backbone,
  template
  ) {

  return Backbone.View.extend({
    el : '.payment-info',

    render: function() {
      this.$el.html(template(this.model && this.model.toJSON()));
      return this;
    }
  });
});
