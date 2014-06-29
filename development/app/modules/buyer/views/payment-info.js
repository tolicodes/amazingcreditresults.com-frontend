define([
  "backbone",
  "hbs!buyer/templates/payment-info"
], function(
  Backbone,
  template
  ) {

  return Backbone.View.extend({
    el : '.payment-info',

    initialize: function(params) {
      this.user = params.user
    },

    render: function() {
      this.$el.html(template(this.user.toJSON()));
      return this;
    }
  });
});
