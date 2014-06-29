// create buyer.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
  "formView",
	"adminManageBuyer/models/transaction",
  "hbs!adminManageBuyer/templates/transaction"
], function(
  FormView,
	Transaction,
  template
) {

  return FormView.extend({
    el: '#transaction',

    initialize: function(params) {
      this.user = params.user;
      this.list = params.list;
    },

    events: {
      "click #create-transaction": "createTransaction"
    },

    render: function () {
      this.$el.html(template());
      return this;
    },

    createTransaction: function() {
      new Transaction(this.transactionParams()).save();
      this.user.fetch();
    },

    transactionParams: function() {
      return _.extend(this.formData(), {userId: this.user.id});
    },

    formData: function() {
      return {
        amount: this.getValue('amount'),
        paidBy: this.getValue('paid-by'),
        notes:  this.getValue('notes'),
        date:   this.getValue('date')
      };
    },

    getValue: function(attribute) {
      return this.$('#' + attribute).val();
    }
  })
});
