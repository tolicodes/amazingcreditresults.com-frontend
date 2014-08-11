define([
	"dataTable",
	"modules/admin/dashboard/models/reset-password",
	"modules/admin/dashboard/models/welcome-email",
	"modules/admin/dashboard/models/update-buyer"
], function(
	DataTable,
	resetPasswordModel,
	welcomeEmailModel,
	updateBuyerModel
) {

	return DataTable.extend({
		pageSize: 5,

		selectedRows: [],

		columns: [{
			label: "First Name",
			name: "name.givenName",
			cell: "string",
			editable: false,
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
				fromRaw: function(rawValue, model) {
					return model.get("name").givenName;
				}
			})
		}, {
			label: "Last Name",
			name: "name.familyName",
			cell: "string",
			editable: false,
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
				fromRaw: function(rawValue, model) {
					return model.get("name").familyName;
				}
			})
		}, {
			label: "Roles",
			name: "roles",
			cell: "string",
			editable: false,
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
				fromRaw: function(rawValue, model) {
					var roles = [];
					if (model.get("roles").owner) roles.push("owner");
					if (model.get("roles").buyer) roles.push("buyer");
					if (model.get("roles").seller) roles.push("seller");
					return roles.join(", ");
				}
			})
		}, {
			label: "Email",
			name: "email",
			cell: "string",
			editable: false
		}, {
			sortable: false,
			label: "Verified",
			name: "accountVerified",
			cell: "boolean"
		}, {
			sortable: false,
			label: "Edit",
			name: "edit",
			cell: "actionButton",
			callback: function(userId) {
				App.routing.navigate("admin/user/add/" + userId, {
					trigger: true
				});
			}
		}, {
			sortable: false,
			label: "needQuestionnaire",
			name: "needQuestionnaire",
			cell: "boolean"
		}, {
			sortable: false,
			label: "Reset Password Email",
			name: "resetButton",
			cell: "resetButton"
		}, {
			sortable: false,
			label: "Welcome Email",
			name: "actions",
			cell: "welcomeEmail"
		}],

		/**
		 * Abstract
		 */
		url: '',

		parse: function(result) {
			return result.data;
		},

				addResetButton: function(resetPasswordModel) {
			var ResetButtonCell = Backgrid.ResetButtonCell = Backbone.View.extend({
			    template: _.template("<button>Reset password</button>"),
			    events: {
			      "click": "resetPassword"
			    },
			    
			    tagName: 'td',
			    
			    className: "boolean-cell renderable",
			    
			    initialize: function(options) {
			    	if(options.model) {
				    	this.model = new resetPasswordModel();
				    	this.model.userId = options.model.get("id");
				    }
			    },
			    
			    resetPassword: function (e) {
			      e.preventDefault();
				  
					this.listenTo(this.model, 'sync', function() {
				  		App.Mediator.trigger("messaging:showAlert", "Reset Password email send successfully. Please check your inbox..", "Green");
					}.bind(this));
		  
				  this.model.save();
			    },
			    
			    render: function () {
			      this.$el.html(this.template());
			      this.delegateEvents();
			      return this;
			    }
			});
		},

		welcomeEmailButton: function(welcomeEmailModel) {
			var WelcomeEmailCell = Backgrid.WelcomeEmailCell = Backbone.View.extend({
			    template: _.template("<button>Send Welcome Email</button>"),
			    events: {
			      "click": "welcomeEmail"
			    },
			    
			    tagName: 'td',
			    className: "boolean-cell renderable",
			    
			    initialize: function(options) {
			    	if(options.model) {
				    	this.model = new welcomeEmailModel();
				    	this.model.userId = options.model.get("id");
				    }
			    },
			    
			    welcomeEmail: function (e) {
			      e.preventDefault();
					this.listenTo(this.model, 'sync', function() {
				  		App.Mediator.trigger("messaging:showAlert", "Welcome email send successfully. Please check your inbox..", "Green");
					}.bind(this));

				  this.model.save();
			    },
			    
			    render: function () {
			      this.$el.html(this.template());
			      this.delegateEvents();
			      return this;
			    }
			});
		},

		initializeBefore: function() {
			this.addResetButton(resetPasswordModel);
			this.welcomeEmailButton(welcomeEmailModel);
			this.addCheckbox(updateBuyerModel);
			this.addActionButton();
		}
	});
});