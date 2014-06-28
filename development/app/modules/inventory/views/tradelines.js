// inventory.js
// --------------
// Requires define
// Return DataTable View {Object}


define([
	"dataTable",
	"inventory/collections/tradeline"
], function(
	DataTable,
	tradelineCollection
) {

	return DataTable.extend({
		el: undefined,
		pageSize: 10,
		columns:  [{
			label: "",
			name : "name",
			editable: false,
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		      	console.log(model.get("product"));
		        return model.get("product").name;
		      }
		    })
		},
		{
			label: "",
			name : "price",
			editable: false,
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		        return "$" + model.get("price");
		      }
		    })

		},
		{
			label: "",
			name : "age",
			editable: false,
			cell : "string",
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		        return new Date().getFullYear() - new Date(model.get("dateOpen").split("T")[0]).getFullYear();
		      }
		    })
		},
		{
			label: "",
			name : "availableAus",
			editable: false,
			cell : "string"
		},
 		{
			label: "",
			name : "addToCart",
			cell : "actionButton",
			actionType: "addItemInCart"
		}
		],
		

		
		initializeBefore : function(options, cart) {
			this.cart = cart;
			this.collection = new tradelineCollection();
			this.generateTable();
		}
	});
});