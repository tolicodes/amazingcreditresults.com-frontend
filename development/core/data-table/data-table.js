define([
	"core/mvc/view",
	"backgrid",
	"backgrid-paginator",

	"hbs!./templates/data-table",
	
	"css!libs/backbone.paginator/examples/css/backgrid",
	"css!libs/backgrid-paginator/backgrid-paginator"
], function(
	view,
	Backgrid,
	BackgridPaginator,
	
	tpl
) {
	var DataTable = view.extend({
		tpl: tpl,

		options: {
			'emptyText': 'No Records Found.'
		},

		hooks: {
			//'initialize:before': 'createCollection'
		},

		/**
		 * Need to specify columns
		 * @type {[type]}
		 */
		columns: null,

		createCollection: function(){
			if(this.Collection) {
				this.collection = new Collection();
			}
		},

		generateTable: function() {
			this.paginator = new Backgrid.Extension.Paginator({
				collection: this.collection
			});

			this.grid = new Backgrid.Grid({
				columns: this.columns || {},
				collection: this.collection,
				emptyText: this.options.emptyText
			});

			this.addView(this.grid.render(), '.grid');
			this.addView(this.paginator.render(), '.paginator');
		}
	});
	
	return DataTable;
});