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
	return view.extend({
		tpl: tpl,

		options: {
			'emptyText': 'No Records Found.'
		},

		className: 'data-table',

		hooks: {
			'initialize:before': 'createCollection',
			'initialize:after': 'drawTopButtons',
			'collection:backgrid:edited': 'edited'
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
		},

		/**
		 * The buttons that go on top
		 * @type {Object}
		 *       key: Name of 
		 *       value: {Object} options
		 *       	extraClasses {String}: Classes to apply to the button
		 *       	icon {String}: Classes for the icon on the button
		 *       	title {String}: Title to put on the button
		 *       	onClick {String|Function}: Click handler (can be string
		 *       			referring to the instance or function)
		 */
		topButtons: null,

		/**
		 * The Collection Constructor for the datatable. If specified it 
		 * will be created and will be used to fetch
		 * @type {Backbone.Collection}
		 */
		Collection: null,

		/**
		 * Need to specify columns
		 * @type {[type]}
		 */
		columns: null,

		/**
		 * When the data table is edited we want to save the Model and
		 * flash green otherwise Red
		 * @param  {Backbone.Model} model The Model
		 * @param  {Backgrid.Column} col  Column Object
		 * @return {[type]}       [description]
		 */
		edited: function(model, col){
			model.save()
				.done(this.flashColor.bind(this, model, col, '#dff0d8'))
				.fail(this.flashColor.bind(this, model, col), 'red');
		},

		/**
		 * Flashes a cell the color
		 * @param  {Backbone.Model} model 	The Model
		 * @param  {Backgrid.Column} col  	Column Object
		 * @param  {String} color 			Color it should be
		 * @return {[type]}       [description]
		 */
		flashColor: function(model, col, color){
			this.getCell(model, col).$el
				.css('backgroundColor', color)
				.animate({
					backgroundColor: "white"
				}, 3000);
		},

		/**
		 * Get a cell by Model object and column object
		 * @param  {[type]} model [description]
		 * @param  {[type]} col   [description]
		 * @return {[type]}       [description]
		 */
		getCell: function(model, col) {
			var rows = this._views['.grid'].body.rows;

			var row = _(rows).findWhere({
				model: model
			});

			return _(row.cells).findWhere({
				column: col
			});
		},

		/**
		 * Reads the this.topButtons array and turns them into buttons at the
		 * top the datatable (in the .top-buttons section)
		 * @return {[type]} [description]
		 */
		drawTopButtons: function() {
			_(this.topButtons).each(function(options, name){
				var $button = $(
					'<button class="btn ' + 
						name + ' ' + options.extraClasses + '">' + 
					'<i class="' + options.icon  + '"></i>' +
					'<span>' + options.title + '</span>' +
					'</button>'
				).on('click', function(){
					var func = options.onClick;
					func = _.isString(func) ? this[func] : func
					return func.apply(this);
				}.bind(this));


				this.$('.top-buttons').append($button)
			}, this);
		},

		/**
		 * Creates a new instance of the collection if a Collection is 
		 * specified and fetches it
		 * @return {[type]} [description]
		 */
		createCollection: function(){
			if(this.Collection && !this.collection) {
				this.collection = new this.Collection();
			}

			this.collection.fetch();
		}
	});
});