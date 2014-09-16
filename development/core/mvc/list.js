define([
	'core/mvc/view'
], function(
	view
) {
	return view.extend({
		hooks: {
			'initialize:before': ['_ensureItemView', 'setupContainer'],
			//'render:after': ['renderCollection'],
			'collection:add': ['appendView'],
			'collection:remove': 'removeView'
		},

		/**
		 * The view that will represent a model
		 * @type {Backbone.View}
		 */
		itemView: null,

		$listEl: null,

		_ensureItemView: function(){
			if(!this.itemView) {
				throw new ("No Item View Specified!", this);
			}
		},

		setupContainer: function(){
			this._collectionViews = [];
		},

		appendView: function(model) {
			var view = new this.itemView({
				model: model,
				parentView: this
			});

			this.doAppend(view);

			this._collectionViews.push(view);
		},

		doAppend: function(view) {
			this.trigger('appendItem:before', view);
			var $listEl = this.$listEl ? this.$(this.$listEl) : this.$el;

			view.$el.appendTo($listEl);
			this.trigger('appendItem:after', view);
		},

		doRemove: function(view){
			this.trigger('removeItem:before', view);
			view.remove();
			this.trigger('removeItem:after', view);
		},

		removeView: function(model){
			var cv = this._collectionViews;

			var view = _(cv).findWhere({
				model: model
			});

			if(!view) {
				return;
			}

			this.doRemove(view);

			cv = _(cv).without(view);
		}
	});
})