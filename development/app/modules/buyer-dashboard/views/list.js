// list.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"dataTable",
	"modules/admin/dashboard/models/reset-password",
	"modules/admin/dashboard/models/welcome-email"
	], function(
	DataTable,
	resetPasswordModel,
	welcomeEmailModel
	) {

	return DataTable.extend({

		el: ".list-view",

		columns:  [{
				label: "First Name",
				name : "name.givenName",
				cell : "string",
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			        return model.get("name").givenName;
			      }
			    })
			}, {
				label: "Last Name",
				name : "name.familyName",
				cell : "string",
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			        return model.get("name").familyName;
			      }
			    })
			}, {
				label: "Email",
				name : "email",
				cell : "string"
			}, {
				label: "Verified",
				name : "accountVerified",
				cell : "boolean"
			}, {
				label: "needQuestionnaire",
				name : "needQuestionnaire",
				cell : "boolean"
			},{
				label: "Reset Password Email",
				name : "resetButton",
				cell : "resetButton"
			},{
				label: "Welcome Email",
				name : "actions",
				cell : "welcomeEmail"			
			}],
			
		url: "api/v1/admin/clients",
		
		parse: function(result) {
			return result.clients;
		},
		
		initializeBefore: function() {
			this.addResetButton(resetPasswordModel);
			this.welcomeEmailButton(welcomeEmailModel);
		}
	});
});
