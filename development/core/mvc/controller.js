define([
	'backbone',
	'core/hooks/hooks',
	'core/mediator/mediator'
], function(
	Backbone,
	hooks,
	Mediator
){
	var Controller = function(options) {
		this.initialize.apply(this, arguments);
	};

	Controller.prototype = {
		hooks: {
			'initialize:before': ['_addInstanceOptions', 'copyOptions']
		},

		_addInstanceOptions: function(options) {
			this.options = this.options || {};

			_(this.options).extend(options);
		},

		copyOptions: function(options){
			_(this.options).extend(
				_(options || {}).pick(['model', 'collection'])
			);
		},

		initialize: function(){

		}
	};

	_(Controller.prototype).extend(Backbone.Events, {
		Mediator: Mediator
	});

	Controller.extend = Backbone.View.extend;

	return hooks.mixInto(Controller);
});