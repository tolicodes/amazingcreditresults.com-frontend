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

		parse: function(result) { 
			
			console.log(result);
			return result; 
		},

		generateTable: function() {
			var Territories = Backbone.PageableCollection.extend({
				url : this.url || "",
				mode : this.mode || "client",
				parse: this.parse,
				state: {
    				pageSize: this.pageSize || 5
    			}
			}), territories = new Territories(), grid = new Backgrid.Grid({
				columns : this.columns || {},
				collection : territories
			}), paginator = new Backgrid.Extension.Paginator({
				collection : territories
			});

			this.$el.find("#grid").html(grid.render().$el);
			this.$el.find("#paginator").html(paginator.render().$el);
			
			if(this.collection) {
				this.listenTo(this.collection, 'sync', function(){
					var data  = this.collection.toJSON();
					for(var i in data) {
						territories.add(data[i]);		
					}
					//console.log("territories collection", territories.toJSON());
				}.bind(this));
				
				this.collection.fetch();
				
				//territories.fetch();
				
			} else {
				territories.fetch();
			}
		},

		afterRender: function() {
			setTimeout(this.generateTable(), 100);
		}
	});
});
