// create buyer.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
  "backbone",
  "hbs!../templates/transactions",
  "../models/transaction",
  "../views/transaction"
], function(
  Backbone,
  template,
  Transaction,
  TransactionView
) {

  return Backbone.View.extend({
    el: '#transactions',

    render: function () {
      this.$el.html(template({transactions: this.model.get('transactions')}));
      this.renderTransactionForm();
      return this;
    },

    renderTransactionForm: function() {
      new TransactionView({model: this.model, list: this}).render();
    }
  });
});
