define([
	"core/mvc/view",
	"backgrid-paginator",

	"hbs!./templates/data-table",
 
	"backgrid",
	
	"css!libs/backbone.paginator/examples/css/backgrid",
	"css!libs/backgrid-paginator/backgrid-paginator"
], function(
	view,
	BackgridPaginator,
	
	tpl
) {
	var DataTable = view.extend({
		tpl: tpl,

		options: {
			'emptyText': 'No Records Found.'
		},

		className: 'data-table',

		hooks: {
			'initialize:before': 'createCollection'
		},

		/**
		 * Need to specify columns
		 * @type {[type]}
		 */
		columns: null,

		createCollection: function(){
			if(this.Collection) {
				this.collection = new this.Collection();
			}
			this.collection.fetch();
		},

		views: {
			'.paginator': function(){
				return (new Backgrid.Extension.Paginator({
					collection: this.collection
				})).render();
			},
			'.grid': function(){
				return (new Backgrid.Grid({
					columns: this.columns || {},
					collection: this.collection,
					emptyText: this.options.emptyText
				})).render();
			}
		}
	});
	
	return DataTable;
});