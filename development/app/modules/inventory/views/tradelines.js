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
			label: "Statement Date",
			name : "statementDate",
			editable: false,
			cell : "date"
		},
		{
			label: "Date",
			name : "dateOpen",
			editable: false,
			cell : "date"
		},
		{
			label: "Available",
			name : "availableAus",
			editable: false,
			cell : "string"
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
		      	var s = text.join(", ");
		        return s;
		      }
		    })			
		},
		{
			label: "Price",
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
			this.collection = new tradelineCollection();
			this.generateTable();
		}
	});
});