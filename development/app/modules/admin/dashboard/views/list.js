// list.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"dataTable",
	"../models/reset-password",
	"../models/welcome-email",
	"../models/update-buyer"
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
		
		columns:  [
					 {
			     name: "",
			     cell: "select-row",
			     headerCell: "select-all" 
 			  },
		{
				label: "First Name",
				name : "name.givenName",
				cell : "string",
				order: -1,
				editable: false,
				// comparatorProvider: function (attr, order) {
				    // return function (left, right) {
				// console.log("------- here ----", left, right);
				      // // no-op
				      // if (order == null) return 0;
// 				
				     // var l = left.get(this.column.modelAttribute()), r = right.get(this.column.modelAttribute()), t;
// 				
				      // // if descending order, swap left and right
				      // if (order === 1) t = l, l = r, r = t;
// 				
				      // // compare as usual
				      // if (l === r) return 0;
				      // else if (l < r) return -1;
				      // return 1;
				    // };
				  // },
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			        return model.get("name").givenName;
			      }
			    })
			}, {
				label: "Last Name",
				name : "lastName",
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
				direction: "descending",
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
					App.routing.navigate("admin/user/"+userId, {
						trigger : true
					});
				}
			}, {
				sortable: false,
				label: "Questionnaire",
				name : "needQuestionnaire",
				getValue: function(model) {
					return model.get("profile").needQuestionnaire;
				},
				cell : "boolean",
				model: updateBuyerModel
			},{
				sortable: false,
				label: "Deactivate",
				name : "isBanned",
				cell : "boolean",
				model: updateBuyerModel
			},{
				sortable: false,
				label: "Reset Password Email",
				name : "resetButton",
				cell : "resetButton"
			},{
				sortable: false,
				label: "Welcome Email",
				name : "actions",
				cell : "welcomeEmail"			
			}],
			
		url: function() {
			return this.getUrl("adminClients");
		},
		
		parse: function(result) {
			return result.data;
		},
		
		initializeBefore: function() {
			this.addResetButton(resetPasswordModel);
			this.welcomeEmailButton(welcomeEmailModel);
			this.addCheckbox();
		}
	});
});
