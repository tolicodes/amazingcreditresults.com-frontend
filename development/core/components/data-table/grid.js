// data-table.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"backgrid", 
	"pageableCollection", 
	"backgridPaginator",
	"hbs!core/components/data-table/templates/grid"
], function(
		Base, 
		Backgrid, 
		PageableCollection, 
		BackgridPaginator, 
		viewTemplate
) {
	// , 'less!cssPath/backgrid', 'less!cssPath/backgrid-paginator'
	return Base.extend({

		tpl: viewTemplate,

		generateTable: function() {
			var Territories = Backbone.PageableCollection.extend({
				url : this.url,
				mode : this.mode || "client"
			}), territories = new Territories(), grid = new Backgrid.Grid({
				columns : this.columns || {},
				collection : territories
			}), paginator = new Backgrid.Extension.Paginator({
				collection : territories
			});

			this.$el.find("#grid").append(grid.render().$el);
			this.$el.find("#paginator").append(paginator.render().$el);
			
			territories.fetch();

		},

		afterRender: function() {
			var _self = this;
			setTimeout(function() {
				_self.generateTable();				
			}, 100);

		}
	});
});
