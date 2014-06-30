// inventory.js
// --------------
// Requires define
// Return DataTable View {Object}


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
			label: "Name",
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
			label: "Price",
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
			label: "Years",
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
			label: "balance",
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
		
		updateListView: function() {
			this.generateTable();
		},		
		
		initializeBefore : function(options, cart) {
			App.routing.off("refreshTradelines");
			App.routing.on("refreshTradelines", function(response) {
				this.updateListView();
			}.bind(this));

			this.cart = cart;
			this.generateTable();
		}
	});
});