// info.js
// --------------
// Requires define
// Return Backbone View {Object}


define([
	"dataTable"
], function(
	DataTable
) {

	return DataTable.extend({

		columns:  [{
				name : "Bar",
				editable : false,
				cell : Backgrid.IntegerCell.extend({
					orderSeparator : ''
				})
			}, {
				name : "Product Name",
				cell : "string"
			}, {
				name : "Statement",
				cell : "integer"
			}, {
				name : "Date",
				cell : "number"
			}, {
				name : "Payment",
				cell : "date"
			}, {
				name : "Current",
				cell : "uri"
			}],
			
			
			/*, {
				name : "Max",
				cell : "uri"
			}, {
				name : "Credit",
				cell : "uri"
			}, {
				name : "Cash",
				cell : "uri"
			}, {
				name : "Balance",
				cell : "uri"
			}, {
				name : "Ratings",
				cell : "uri"
			}, {
				name : "Report",
				cell : "uri"
			}, {
				name : "Cc",
				cell : "uri"
			}*/
			
		url: "http://backbone-paginator.github.io/backbone-pageable/examples/json/pageable-territories.json",

	});
});