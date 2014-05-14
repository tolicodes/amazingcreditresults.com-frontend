// home.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"backbone", 
	"buyer/models/info", 
	"backgrid", 
	"pageableCollection", 
	"backgridPaginator",
	"hbs!grid/templates/grid"
], function(
		Backbone, 
		model, 
		Backgrid, 
		PageableCollection, 
		BackgridPaginator, 
		viewTemplate
) {
	// , 'less!cssPath/backgrid', 'less!cssPath/backgrid-paginator'
	return Backbone.View.extend({

		events : {
		},
		
		// main initialize function
		initialize: function() {
			
		},
		
		el: 'body',

		renderGrid : function(options) {
			var _self = this;

			var columns = [{
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
			}];

			var Territories = Backbone.PageableCollection.extend({
				url : "http://backbone-paginator.github.io/backbone-pageable/examples/json/pageable-territories.json",
				mode : "client"
			});

			var territories = new Territories();

			var grid = new Backgrid.Grid({
				columns : columns,
				collection : territories
			});

			var paginator = new Backgrid.Extension.Paginator({
				collection : territories
			});

			$("#grid").append(grid.render().$el);
			$("#paginator").append(paginator.render().$el);

			territories.fetch();

		},

		render : function() {
			this.$el.html(viewTemplate());
			this.renderGrid();				
		}
	});
});
