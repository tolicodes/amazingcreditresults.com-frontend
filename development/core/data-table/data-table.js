define([
	"core/mvc/view",
	"backgrid-paginator",

	"hbs!./templates/data-table",
 
	"backgrid",

	//For color animation (fading success)
	"jquery-color",
	
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
			'initialize:before': 'createCollection',
			'collection:backgrid:edited': 'edited'
		},

		/**
		 * Need to specify columns
		 * @type {[type]}
		 */
		columns: null,

		edited: function(model, col){
			//if(errors) {
			//	this.getCell.$el.tooltip({
			//		title: errors
			//	})
			//} else {
				model.save().done(this.flashGreen.bind(this, model, col));
			//}
		},

		flashGreen: function(model, col){
			this.getCell(model, col).$el
				.css('backgroundColor', '#dff0d8')
				.animate({
					backgroundColor: "white"
				}, 3000);
		},

		getCell: function(model, col) {
			var rows = this._views['.grid'].body.rows;

			var row = _(rows).findWhere({
				model: model
			});

			return _(row.cells).findWhere({
				column: col
			});
		},

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
					columns: this.columns,
					collection: this.collection,
					emptyText: this.options.emptyText
				})).render();
			}
		}
	});
	
	return DataTable;
});