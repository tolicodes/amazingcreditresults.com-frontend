// home.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"dataTable"
], function(
	DataTable
) {

	return DataTable.extend({
		el: '.list-view',
		columns:  [{
				name : "id",
				editable : false,
				cell : Backgrid.IntegerCell.extend({
					orderSeparator : ''
				})
			}, {
				name : "name",
				cell : "string"
			}, {
				name : "pop",
				cell : "integer"
			}, {
				name : "percentage",
				cell : "number"
			}, {
				name : "date",
				cell : "date"
			}, {
				name : "url",
				cell : "uri"
			}],
			
		url: "http://backbone-paginator.github.io/backbone-pageable/examples/json/pageable-territories.json",

	});
});
