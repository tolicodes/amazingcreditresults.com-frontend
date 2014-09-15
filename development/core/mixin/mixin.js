define([
	'backbone'
], function(
	Backbone
) {
	var constructors = [Backbone.View, Backbone.Model, Backbone.Collection, Backbone.Router];

	_(constructors).each(function(constructor) {
		constructor.mixIn = function(mixin) {
			if (mixin.mixInto) {
				mixin.mixInto(constructor);
			}
			return constructor;
		};
	});
});