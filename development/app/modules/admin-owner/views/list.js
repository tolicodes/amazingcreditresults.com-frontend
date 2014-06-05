// list.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"dataTable"
	], function(
	DataTable
	) {

	return DataTable.extend({

		el: undefined,

		columns:  [{
				label: "First Name",
				name : "name.givenName",
				cell : "string",
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			      	console.log(rawValue, model);
			        return model.get("name").givenName;
			      }
			    })
			}, {
				label: "Last Name",
				name : "name.familyName",
				cell : "string",
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			      	console.log(rawValue, model);
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
				cell : "boolean",
				editable: false
			}, {
				label: "needQuestionnaire",
				name : "needQuestionnaire",
				editable: false,
				cell : "boolean"
			}],
			
		url: "api/v1/admin/clients",
		
		parse: function(result) {
			return result.clients;
		}

	});
});
