// inventory.js
// --------------
// Requires define
// Return Backbone View {Object}


define([
	"dataTable",
	"buyer/collections/tradeline",
], function(
	DataTable,
	tradelineCollection
) {

	return DataTable.extend({
		el: undefined,
		pageSize: 10,
		columns:  [{
			label: "Bank",
			name : "balance",
			cell : "string",
			sformatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		        return model.get("product").bank;
		      }
		    })
		},
		{
			label: "Product Name",
			name : "balance",
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		        return model.get("product").name;
		      }
		    })
		},
		{
			label: "Statement",
			name : "balance",
			cell : "string"
		},
		{
			label: "Date",
			name : "balance",
			cell : "string"
		},
		{
			label: "Current",
			name : "balance",
			cell : "string"
		},
		{
			label: "Max",
			name : "balance",
			cell : "string"
		},
		 {
			label: "Cash Limit",
			name : "cashLimit",
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		        return "$"+model.get("cashLimit");
		      }
		    })
		}, {
			label: "Credit Limit",
			name : "creditLimit",
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		        return "$"+model.get("creditLimit");
		      }
		    })
		},
		{
			label: "Balance",
			name : "balance",
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		        return "$"+model.get("balance");
		      }
		    })
		},
		{
			label: "Ratings",
			name : "bcRating",
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
		      	var s = text.join(", ");
		      	console.log(s);
		        return s;
		      }
		    })			
		},
		{
			label: "Cost",
			name : "cost",
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		        return "$"+model.get("balance");
		      }
		    })
		}
		],
		
		initializeBefore : function(options) {
			this.collection = new tradelineCollection();
			this.generateTable();
		}
	});
});