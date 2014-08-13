define([], function() {
	return {
		mergeSuperHooks: function() {
			var superHooks = this.__super__.hooks;

			_.each(superHooks, function(callbacks, trigger) {
				var childHooks = this.hooks[trigger];
				if (childHooks) {
					this.hooks[trigger] = callbacks.concat(childHooks);
				}
			}, this);
		},

		replaceInitialize: function(proto) {
			var initialize = proto.initialize;

			proto.initialize = function() {
				this.mergeSuperHooks();
				this.implementHooks();

				this.trigger.apply(this, 'initialize:before', arguments);
				initialize.apply(this, arguments);
				this.trigger.apply(this, 'initialize:after', arguments);
			}
		},

		replaceFunctions: function(funcs) {
			funcs = _.isArray(funcs) ? funcs : [funcs];

			_.each(funcs, function(func){
				var initialFunc = this[func];

				this[func] = function(){
					this.trigger.apply(this, func + ':before', arguments);
					initialFunc.apply(this, arguments);
					this.trigger.apply(this, func + ':after', arguments);
				};
			}, this);
		},

		// function to implemnt hooks
		implementHooks: function() {
			_.each(this.hooks, function(callbacks, key) {
				_.each(callbacks, function(callback) {
					this.listenTo(this, key, this[callback]);
				}, this);
			}, this);
		},

		mixInto: function(child) {
			this.replaceInitialize(child.prototype);
			_(child.prototype).extend(this);

			console.log('child', child);
			return child;
		}

		/*
		_extend: function(protoProps, staticProps) {
			var parent = this;
			var child;
		
			if (protoProps && _.has(protoProps, 'constructor')) {
 				child = protoProps.constructor;
			} else {
      			child = function(){ return parent.apply(this, arguments); };
			}

			_.extend(child, parent, staticProps);

    		var Surrogate = function(){ this.constructor = child; };
    		Surrogate.prototype = parent.prototype;
    		child.prototype = new Surrogate;
			
			if (protoProps) _.extend(child.prototype, protoProps);
			
			child.__super__ = parent.prototype;

    		return child;
		},*/
	};
});