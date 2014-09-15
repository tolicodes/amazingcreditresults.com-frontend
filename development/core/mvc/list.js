define([
	'core/mvc/view'
], function(
	view
) {
	return view.extend({
		hooks: {
			'initialize:before': ['_ensureItemView', 'setupContainer'],
			'after:render': ['renderCollection'],
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

		renderCollection: function(){
			this.collection.each(this.appendView);
		},

		appendView: function(model) {
			var $listEl = this.$listEl ? this.$(this.$listEl) : this.$el;

			this._collectionViews.push(new this.itemView({
				model: model,
				appendTo: $listEl,
				parentView: this
			}));
		},

		removeView: function(model){
			var cv = this._collectionViews;

			var view = _(cv).findWhere({
				model: model
			});

			if(!view) {
				return;
			}

			view.remove();

			cv = _(cv).without(view);
		}
	});
})