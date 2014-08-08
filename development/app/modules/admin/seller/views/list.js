// list.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"dataTable",
	"admin/dashboard/models/reset-password",
	"admin/dashboard/models/welcome-email",
	"admin/dashboard/models/update-buyer"
	], function(
	DataTable,
	resetPasswordModel,
	welcomeEmailModel,
	updateBuyerModel
	) {

	return DataTable.extend({

		el: undefined,
		
		pageSize: 5,

		selectedRows: [],
		
		columns:  [{
				label: "First Name",
				name : "name.givenName",
				cell : "string",
				editable: false,
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			        return model.get("name").givenName;
			      }
			    })
			}, {
				label: "Last Name",
				name : "name.familyName",
				cell : "string",
				editable: false,
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			        return model.get("name").familyName;
			      }
			    })
			}, {
				label: "Roles",
				name : "roles",
				cell : "string",
				editable: false,
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			        var roles = [];
			        if(model.get("roles").owner) roles.push("owner");
			        if(model.get("roles").buyer) roles.push("buyer");
			        if(model.get("roles").seller) roles.push("seller");
			        return roles.join(", ");
			      }
			    })
			}, {
				label: "Email",
				name : "email",
				cell : "string",
				editable: false
			}, {
				label: "Logged In",
				name : "loggedIn",
				cell : "string",
				editable: false,
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			        return (model.get("loggedIn"))?model.get("loggedIn"):"Has Not Logged In";
			      }
			    })
			}, {
				sortable: false,
				label: "Edit",
				name : "edit",
				cell : "actionButton",
				callback: function(userId) {
					App.routing.navigate("admin/seller/add/"+userId, {
						trigger : true
					});
				}
			}, {
				sortable: false,
				label: "needQuestionnaire",
				name : "needQuestionnaire",
				cell : "boolean"
			},
			{
				sortable: false,
				label: "Reset Password Email",
				name : "resetButton",
				cell : "resetButton"
			},{
				sortable: false,
				label: "Welcome Email",
				name : "actions",
				cell : "welcomeEmail"			
			},
			{
				sortable: false,
				label: "Tradelines",
				name : "tradelies",
				cell : "actionButton",
				callback: function(id) {
					App.routing.navigate("admin/tradelines/seller/"+id, {
						trigger : true
					});
				}
			}
			],
			
		url: function() {
			return this.getUrl("seller");
		},
		
		parse: function(result) {
			return result.data;
		},
		
		initializeBefore: function() {
			this.addResetButton(resetPasswordModel);
			this.welcomeEmailButton(welcomeEmailModel);
			this.addCheckbox(updateBuyerModel);
			this.addActionButton();
		}
	});
});
