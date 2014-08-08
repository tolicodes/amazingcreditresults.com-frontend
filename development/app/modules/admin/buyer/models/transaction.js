// reset password.js
// --------------
// Requires define
// Return Backbone Model {Object}

define([
  "baseModel"
], function(
  BaseModel
  ) {
  return BaseModel.extend({
    initialize: function(params) {
      _.each(['userId', 'amount', 'date', 'paidBy', 'notes'], function(propertyName) {
        this[propertyName] = params[propertyName];
      }, this);

      BaseModel.prototype.initialize.apply(this, arguments);
    },

    url : function() {
      return this.getUrl("createTransaction", {id: this.userId});
    }
  });
});
