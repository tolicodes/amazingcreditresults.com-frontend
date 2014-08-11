
define([
	'backgrid',
	"../models/reset-password",
], function(
	Backgrid,
	resetPasswordModel
){
	return Backbone.View.extend({
		template: _.template("<button>Reset password</button>"),
		
		events: {
			"click": "resetPassword"
		},

		tagName: 'td',

		className: "boolean-cell renderable",

		initialize: function(options) {
			if (options.model) {
				this.model = new resetPasswordModel();
				this.model.userId = options.model.get("id");
			}
		},

		resetPassword: function(e) {
			e.preventDefault();

			this.listenTo(this.model, 'sync', function() {
				App.Mediator.trigger("messaging:showAlert", "Reset Password email send successfully. Please check your inbox..", "Green");
			}.bind(this));

			this.model.save();
		},

		render: function() {
			this.$el.html(this.template());
			this.delegateEvents();
			return this;
		}
	});
});