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
			label: "Bar",
			name : "balance",
			cell : "string"
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
			cell : "string"
		}, {
			label: "Cost",
			name : "cost",
			cell : "string"
		},
		{
			label: "Balance",
			name : "balance",
			cell : "string"
		},
		{
			label: "Ratings",
			name : "bcRating",
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		      	var val = "SH GOLD, BC Silver";
		      	//if(model.get("bcRating"))
		      	//
		        //return model.get("bcRating") +"-"+model.get("moRating")+"--"+model.get("ncRating");
		      }
		    })
		},
		{
			label: "Report",
			name : "balance",
			cell : "string"
		},
		{
			label: "CC",
			name : "balance",
			cell : "string"
		}
		],
		
		initializeBefore : function(options) {
			this.collection = new tradelineCollection();
			this.generateTable();
		}
	});
});