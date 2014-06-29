// create buyer.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
  "backbone",
  "hbs!adminManageBuyer/templates/transactions",
  "adminManageBuyer/models/transaction",
  "adminManageBuyer/views/transaction"
], function(
  Backbone,
  template,
  Transaction,
  TransactionView
) {

  return Backbone.View.extend({
    el: '#transactions',

    initialize: function(params) {
      this.user = params.user;
    },

    render: function () {
      this.$el.html(template({transactions: this.user.get('transactions')}));
      this.renderTransactionForm();
      return this;
    },

    renderTransactionForm: function() {
      new TransactionView({user: this.user, list: this}).render();
    }
  })
});
