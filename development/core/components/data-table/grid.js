// data-table.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"backgrid", 
	"pageableCollection", 
	"backgridPaginator",
	"hbs!core/components/data-table/templates/grid",
	"css!libs/backbone-pageable/examples/css/backgrid",
	"css!libs/backgrid-paginator/backgrid-paginator"
], function(
	Base, 
	Backgrid, 
	PageableCollection, 
	BackgridPaginator, 
	viewTemplate
) {
	return Base.extend({

		tpl: viewTemplate,

		generateTable: function() {
			var Territories = Backbone.PageableCollection.extend({
				url : this.url,
				mode : this.mode || "client",
				parse: this.parseFn || function(result) { return result; },
				state: {
    				pageSize: 5
    			}
			}), territories = new Territories(), grid = new Backgrid.Grid({
				columns : this.columns || {},
				collection : territories
			}), paginator = new Backgrid.Extension.Paginator({
				collection : territories
			});

			this.$el.find("#grid").html(grid.render().$el);
			this.$el.find("#paginator").html(paginator.render().$el);
			
			territories.fetch();

		},

		afterRender: function() {
			setTimeout(this.generateTable(), 100);
		}
	});
});
