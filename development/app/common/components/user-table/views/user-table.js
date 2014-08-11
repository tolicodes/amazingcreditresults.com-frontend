define([
	"dataTable",
	"adminDashboard/models/update-buyer",
	"./reset-password-button-cell",
	"./welcome-email-cell"
], function(
	DataTable,
	updateBuyerModel,
	resetPasswordButtonCell,
	welcomeEmailCell
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
			/*
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
				fromRaw: function(rawValue, model) {
					return model.get("name").familyName;
				}
			})*/
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
				App.routing.navigate("admin/seller/" + userId, {
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
			cell: resetPasswordButtonCell
		}, {
			sortable: false,
			label: "Welcome Email",
			name: "actions",
			cell: welcomeEmailCell
		}],

		/**
		 * Abstract
		 */
		url: '',

		parse: function(result) {
			return result.data;
		},

		welcomeEmailButton: function(welcomeEmailModel) {
			
		},

		initializeBefore: function() {
			this.welcomeEmailButton();
			this.addCheckbox(updateBuyerModel);
			this.addActionButton();
		}
	});
});