// inventory.js
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
		pageSize: 10,
		
		url: function() {
			return this.getUrl("tradeline");
		},
		
		parse: function(result) {
			return result.data;
		},
		
		
		columns:  [{
			label: "Bank",
			name : "bank_name",
			editable: false,
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		      	console.log(model.get("product"));
		        return model.get("product").bank;
		      }
		    })
		},
		{
			label: "Product Name",
			name : "product_name",
			editable: false,
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		        return model.get("product").name;
		      }
		    })
		},
		{
			label: "Statement",
			name : "statement",
			editable: false,
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		        return "--";
		      }
		    })
		},
		{
			label: "Date",
			name : "dateOpen",
			editable: false,
			cell : "date"
		},
		{
			label: "Current",
			name : "usedAus",
			editable: false,
			cell : "string"
		},
		{
			label: "Max",
			name : "totalAus",
			editable: false,
			cell : "string"
		},
		{
			label: "Balance",
			name : "availableAus",
			editable: false,
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		        return "$"+model.get("availableAus");
		      }
		    })
		},
		{
			label: "Ratings",
			name : "bcRating",
			editable: false,
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		        return "BC "+model.get("bcRating") +", MO "+model.get("moRating")+", NC "+model.get("ncRating");
		      }
		    })
		},
		{
			label: "Report",
			name : "balance",
			editable: false,
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		      	var text = [];
		      	if(model.get("product").reportsToExperian && model.get("product").reportsToEquifax && model.get("product").reportsToTransunion) {
		      		text.push("All");
		      	} else if(model.get("product").reportsToExperian) {
		      		text.push("Experian");
		      	} else if(model.get("product").reportsToEquifax) {
		      		text.push("Equifax");
		      	} else if(model.get("product").reportsToTransunion) {
		      		text.push("Transunion");
		      	} else {
		      		text.push("No Data");
		      	}
		      	return text.join(", ");
		      }
		    })			
		},
		{
			label: "Cost",
			name : "price",
			editable: false,
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		        return "$"+model.get("price");
		      }
		    })
		}
		],
		
		initializeBefore : function(options) {
			this.generateTable();
		}
	});
});