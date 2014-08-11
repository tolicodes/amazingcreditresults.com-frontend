define([
	'backgrid',
	"adminDashboard/models/welcome-email"
], function(
	Backgrid,
	welcomeEmailModel
) {
	return Backbone.View.extend({
		template: _.template("<button>Send Welcome Email</button>"),
		events: {
			"click": "welcomeEmail"
		},

		tagName: 'td',
		className: "boolean-cell renderable",

		initialize: function(options) {
			if (options.model) {
				this.model = new welcomeEmailModel();
				this.model.userId = options.model.get("id");
			}
		},

		welcomeEmail: function(e) {
			e.preventDefault();
			this.listenTo(this.model, 'sync', function() {
				App.Mediator.trigger("messaging:showAlert", "Welcome email send successfully. Please check your inbox..", "Green");
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