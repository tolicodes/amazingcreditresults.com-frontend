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
			        return model.get("ncRating");
			      }
			    })
			}, {
				label: "BC",
				name : "bcRating",
				cell : "string",
				editable: false,
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			        return model.get("bcRating");
			      }
			    })
			}, {
				label: "MO",
				editable: false,
				name : "moRating",
				cell : "string",
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			        return model.get("moRating");
			      }
			    })
			},
			{
				label: "Report To",
				name : "reportTo",
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
				name : "notes",
				editable: false,
				cell : "string"
			}
			],
			
		url: function() {
			return this.getUrl("products");
		},
		
		parse: function(result) {
			return result.data;
		},
		
		initializeBefore: function() {
		}
	});
});
