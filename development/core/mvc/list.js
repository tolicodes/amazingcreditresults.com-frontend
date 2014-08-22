define([
	'core/mvc/view'
], function(
	view
) {
	return view.extend({
		hooks: {
			'initialize:before': ['_ensureItemView', 'setupContainer'],
			'after:render': ['renderCollection'],
			'collection:add': ['appendView']
		},

		/**
		 * The view that will represent a model
		 * @type {Backbone.View}
		 */
		itemView: null,

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
			this._collectionViews.push(new this.itemView({
				model: model,
				appendTo: this.$el,
				parentView: this
			}));
		}
	});
})