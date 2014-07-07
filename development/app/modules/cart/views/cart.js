// cart.js
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
		pageSize : 5,
		selectedRows : [],
		
		columns : [ {
			label : "Bank",
			name : "",
			cell : "string",
			editable : false,
			formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
		      fromRaw: function (rawValue, model) {
		        return model.get("lender").bank;
		      }
		    })			
		},
		 {
			label : "Line Age",
			name : "lineAge",
			cell : "string",
			editable : false
		},
		 {
			label : "Price",
			name : "price",
			cell : "string",
			editable : false
		},
		 {
			label: "Delete",
			name : "delete",
			cell : "actionButton",
			actionType: "delete"
		}
		],

		url : function() {
			return this.getUrl("cart");
		},

		parse : function(result) {
			return result.data;
		},
		
		updateListView: function() {
			this.generateTable();
		},

		initializeBefore: function() {
			App.routing.off("addItemToCart");
			App.routing.on("addItemToCart", function(response) {
				this.updateListView();
			}.bind(this));
			this.trigger("addActionItems");
		}
		
		
	});
});
