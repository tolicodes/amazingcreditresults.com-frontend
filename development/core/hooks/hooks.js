define([
	"core/mediator/mediator"
], function(
	Mediator
) {
	_.mixin({
		/**
	 * Turns arguments into a real array (so that we can do stuff like concat on it)
	 * @param  {arguments} args Arguments
	 * @return {Array}      An array
	 */
		argsToArray: function(args){
			return Array.prototype.slice.call( args, 0 );
		}
	})

	var mixin = {	
		/**
		 * Mixin the mediator
		 * @type {[type]}
		 */
		Mediator: Mediator,

		/**
		 * Relays triggers from object located on this view to the current
		 * view (i.e. when obj.trigger('x') happens this.trigger('obj:x') also happens)
		 * Will only listen to the triggers described in this.hooks
		 * @param  {String} ns The namespace for the relayed events in
		 * 					hooks (ex: 'obj')
		 * @param  {Object} obj (optional) the object that the namespace is
		 * 					referring to (by default will be this[ns])
		 * @return {[type]}
		 */
		relayTriggers: function(ns, obj) {
			if(_.isArray(ns)) {
				_(ns).each(this.relayTriggers);
				return;
			} 

			if (!obj) {
				obj = this[ns];
			}

			var hooks = {};

			_.each(this.hooks, function(actions, trigger) {
				if (trigger.indexOf(ns) === 0) {
					var realTrigger = trigger.substring(ns.length + 1);

					this.listenTo(obj, realTrigger, function() {
						this.trigger.apply(this, [trigger].concat(_.argsToArray(arguments)));
					});
				}
			}, this);
		},

		/**
		 * Inserts before/after triggers into the functions specified
		 * @param  {Array} funcs Array of strings (ex: ['initialize', 'render'])
		 * @return {undefined}       
		 */
		insertTriggers: function(funcs) {
			_(funcs).each(function(func) {
				var oldFunc = this[func];

				this[func] = function() {
					args = _.argsToArray(arguments);
					this.trigger.apply(this, [func + ':before'].concat(args));
					var out = oldFunc.apply(this, args);

					this.trigger.apply(this, [func + ':after'].concat(out).concat(args));
					return out || this;
				};
			}, this);
		},

		/**
		 * Takes Super (parent) hooks and extends them in order of farthest
		 * to closest parent
		 * @return {undefined} 
		 */
		_extendHooks: function() {
			var hooks = {};

			_(this.getSuperChain().reverse()).each(function(proto) {
				_(proto.hooks).each(function(funcs, key) {
					funcs = _(funcs).isArray() ? funcs : [funcs];
					if (!hooks[key]) {
						hooks[key] = [];
					}

					hooks[key] = _(hooks[key].concat(funcs)).uniq();
				});
			});

			this.hooks = hooks;
		},

		/**
		 * Gets the value located at string path
		 * @param  {Object} obj  Object we are traversing (ex: this)
		 * @param  {String} path The string path we want to get (ex: 
		 *                       'cat.feet' would get obj.cat.feet)
		 * @return {Various}      The value
		 */
		getPath: function(obj, path) {
			path = path.split('.');

			for (var i = 0; i < path.length; i++) {
				if (obj[path[i]])  {
					obj = obj[path[i]];
				} else {
					return;
				}
			}

			return obj;
		},

		/**
		 * Saves value to a nested path in the obj
		 * @param  {Object} obj   The object we want to save to
		 * @param  {String} path  String Path (see getPath for example)
		 * @param  {Various} value The value we want to save
		 * @return {Object}       Returns the original object
		 */
		saveToPath: function(obj, path, value) {
			var original = obj;

			path = path.split('.');

			for (var i = 0; i < path.length; i++) {
				if(i + 1 === path.length) {
					obj[path[i]] = value;
				} else if (obj[path[i]]) {
					obj = obj[path[i]];
				} else {
					obj = obj[path[i]] = {};
				}
			}

			return original;
		},

		/**
		 * Merges a list of properties up the prototype chain 
		 * @todo FIX THIS to save to chain
		 * @param  {[type]} properties [description]
		 * @return {[type]}            [description]
		 */
		mergeSuperProperties: function(properties){
			_(properties).each(function(property){
				//this.saveToPath(this, property, this.mergeSuperProperty(property));
				this[property] = this._mergeSuperProperty(property)
			}, this);
		},

		/**
		 * Merges a propoerty from the Super prototype chain
		 * @param  {String} property The property to merge
		 * @return {Object}          The Merged propertyy
		 */
		_mergeSuperProperty: function(property) {
			var prop = {};

			_(this.getSuperChain().reverse()).each(function(proto) {
				_(prop).extend(this.getPath(proto, property));
			}, this);

			return prop;
		},
		
		/**
		 * Gets the super prototype chain as an array
		 * @param  {Boolean} excludeSelf Excludes the current prototype
		 * @return {Array}             The Prototype Chain
		 */
		getSuperChain: function(excludeSelf) {
			var out = [];

			var parent = this.constructor.prototype;

			if (!excludeSelf) {
				out.push(parent);
			}

			while (parent && parent.constructor !== Backbone.View) {
				parent = parent.constructor.__super__;
				
				if(parent) {
					out.push(parent);
				}
			}

			return out;
		},

		/**
		 * Implements hoooks
		 * @todo  fix all functionality
		 * @return {[type]} [description]
		 */
		implementHooks: function() {
			this._extendHooks();

			_.each(this.hooks, function(callbacks, key) {
				var hasStar = key.indexOf(':*') !== -1;

				_.each(callbacks, function(callback) {
					if(hasStar) {
						this.listenTo(this, 'all', _(function(event){
							listenToEvent = key.substring(0, key.length - 2);
							console.log(event);
							if(event.indexOf(listenToEvent) !== -1) {

								this[callback].apply(this, _(arguments).rest());
							}
						}).bind(this));
					} else {
						this.listenTo(this, key, this[callback]);
					}
				}, this);
			}, this);
		},

		/**
		 * Relays mediator
		 * @return {[type]} [description]
		 */
		relayMediator: function(){
			this.relayTriggers('Mediator');
			this.relayTriggers('M', this.Mediator);
		}
	};

	return {
		/**
		 * Mixes hooks functionality into an object.
		 * Usage:
		 * ```
		 * hooks.mixInto(obj); 
		 * ```
		 * @param  {Object} child The object to mix stuff into 
		 * @return {[type]}       [description]
		 */
		mixInto: function(child) {
			if(child.extend) {
				child = child.extend(mixin);
			} else {
				_(child.prototype).extend(mixin);
			}
			
			var initialize = child.prototype.initialize;

			child.prototype.initialize = function(){
				var args = _.argsToArray(arguments);

				this.mergeSuperProperties(['_mergeSuperProperties', '_insertTriggers']);

				this.implementHooks();
				this.insertTriggers(this._insertTriggers);

				this.mergeSuperProperties(this._mergeSuperProperties);
				this.relayMediator();

				this.trigger.apply(this, ['initialize:before'].concat(args));

				var out = initialize.apply(this, arguments);

				this.trigger.apply(this, ['initialize:after'].concat(out).concat(args));

				
				return out;
			}
			
			
			return child;
		}
	};
});