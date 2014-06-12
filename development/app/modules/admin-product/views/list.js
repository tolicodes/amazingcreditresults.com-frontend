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
	
		
		pageSize: 5,
		selectedRows: [],
		columns:  [
			 {
			     name: "",
			     cell: "select-row",
			     headerCell: "select-all" 
 			  },
 			 {
				label: "Issuing Bank",
				name : "bank",
				cell : "string",
				editable: false
			}, {
				label: "Product Name",
				name : "name",
				cell : "string",
				editable: false
			}, {
				label: "NC",
				name : "ncRating",
				cell : "string",
				editable: false,
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			        return model.get("name").givenName;
			      }
			    })
			}, {
				label: "BC",
				name : "bcRating",
				cell : "string",
				editable: false,
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			        return model.get("name").givenName;
			      }
			    })
			}, {
				label: "MO",
				editable: false,
				name : "moRating",
				cell : "string",
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			        return model.get("name").givenName;
			      }
			    })
			}, {
				label: "Report To",
				name : "edit",
				editable: false,
				cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		      	var text = [];
		      	if(model.get("reportsToExperian") && model.get("reportsToEquifax") && model.get("reportsToTransunion")) {
		      		text.push("All");
		      	} else if(model.get("reportsToExperian")) {
		      		text.push("Experian");
		      	} else if(model.get("reportsToEquifax")) {
		      		text.push("Equifax");
		      	} else if(model.get("reportsToTransunion")) {
		      		text.push("Transunion");
		      	} else {
		      		text.push("No Data");
		      	}
		      	return text.join(", ");
		      }
		    })			
			}, {
				label: "Slots",
				name : "type",
				editable: false,
				cell : "string"
			},{
				label: "Notes",
				name : "resetButton",
				editable: false,
				cell : "string"
			}
			//,{
			//	label: "Actions",
			//	name : "delete",
			//	cell : "actionButton"			
			//}
			],
			
		url: "api/v1/owner/products",
		
		parse: function(result) {
			return result.data;
		},
		
		initializeBefore: function() {
			//this.addActionButton(function(cardId) {
				//App.routing.navigate("admin/user/"+userId, {
				//	trigger : true
				//});
			//});
		}
	});
});
