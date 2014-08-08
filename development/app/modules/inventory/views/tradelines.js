// tradelines.js
// --------------
// Requires define
// Return DataTable View {Object}

define([
	"dataTable"
], function(
	DataTable
) {
	return DataTable.extend({
		el : undefined,
		pageSize : 10,

		url : function() {
			return this.getUrl("tradeline");
		},

		parse : function(result) {
			return result.data;
		},

		columns : [{
			label : "Name",
			name : "name",
			editable : false,
			cell : "string",
			formatter : _.extend({}, Backgrid.CellFormatter.prototype, {
				fromRaw : function(rawValue, model) {
					return model.get("product").name;
				}
			})
		}, {
			label : "Price",
			name : "price",
			editable : false,
			cell : "number",
			headerCell : DataTable.alignedHeaderCell('right'),
			formatter : _.extend({}, Backgrid.CellFormatter.prototype, {
				fromRaw : function(rawValue, model) {
					return "$" + model.get("price");
				}
			})
		}, {
			label : "Years",
			name : "age",
			editable : false,
			cell : "number",
			headerCell : DataTable.alignedHeaderCell('right'),
			formatter : _.extend({}, Backgrid.CellFormatter.prototype, {
				fromRaw : function(rawValue, model) {
					return new Date().getFullYear() - new Date(model.get("dateOpen").split("T")[0]).getFullYear();
				}
			})
		}, {
			label : "Balance",
			name : "availableAus",
			editable : false,
			cell : "number",
			headerCell : DataTable.alignedHeaderCell('right')
		}, {
			sortable : false,
			label : "Add to Cart",
			name : "addToCart",
			cell : "actionButton",
			actionType : "addItemInCart"
		}],

		initializeBefore : function(options) {
			App.routing.off("refreshTradelines");
			App.routing.on("refreshTradelines", function() {
				this.refreshList();
			}.bind(this));
		}
	});
}); 