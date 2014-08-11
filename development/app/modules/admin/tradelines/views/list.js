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
				label: "bank",
				name : "bank",
				cell : "string",
				editable: false,
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			        return model.get("product").bank;
			      }
			    })
			}, {
				label: "Type",
				name : "type",
				cell : "string",
				editable: false,
				formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
			      fromRaw: function (rawValue, model) {
			        return model.get("product").type;
			      }
			    })
			}, {
				label: "Available",
				name : "availableAus",
				cell : "string",
				editable: false
			}, {
				label: "Credit Limit",
				name : "creditLimit",
				cell : "string",
				direction: "descending",
				editable: false
			}, {
				label: "Cost",
				name : "cost",
				cell : "string",
				editable: false
			}, {
				sortable: false,
				label: "Edit",
				name : "edit",
				cell : "actionButton",
				callback: function(id) {
					App.routing.navigate("admin/tradelines/create/"+id, {
						trigger : true
					});
				}
			}],
			
		url: function() {
			return this.getUrl("adminTradelines", {}, false, {"seller": this.sellerId});
		},
		
		parse: function(result) {
			return result.data;
		},
		
		initializeBefore: function(options) {
			if(options.sellerId) {
				this.sellerId = options.sellerId;
				this.seller = true;
			}
		}
	});
});
