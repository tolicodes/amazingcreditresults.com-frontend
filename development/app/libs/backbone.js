//     Backbone.js 1.0.0

//     (c) 2010-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.0.0';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = root.jQuery || root.Zepto || root.ender || root.$;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = true;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = {};
        return this;
      }

      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeners = this._listeners;
      if (!listeners) return this;
      var deleteListener = !name && !callback;
      if (typeof name === 'object') callback = this;
      if (obj) (listeners = {})[obj._listenerId] = obj;
      for (var id in listeners) {
        listeners[id].off(name, callback, this);
        if (deleteListener) delete this._listeners[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args);
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeners = this._listeners || (this._listeners = {});
      var id = obj._listenerId || (obj._listenerId = _.uniqueId('l'));
      listeners[id] = obj;
      if (typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var defaults;
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    _.extend(this, _.pick(options, modelOptions));
    if (options.parse) attrs = this.parse(attrs, options) || {};
    if (defaults = _.result(this, 'defaults')) {
      attrs = _.defaults({}, attrs, defaults);
    }
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // A list of options to be attached directly to the model, if provided.
  var modelOptions = ['url', 'urlRoot', 'collection'];

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = true;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      // If we're not waiting and attributes exist, save acts as `set(attr).save(null, opts)`.
      if (attrs && (!options || !options.wait) && !this.set(attrs, options)) return false;

      options = _.extend({validate: true}, options);

      // Do not persist invalid models.
      if (!this._validate(attrs, options)) return false;

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options || {}, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.url) this.url = options.url;
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, merge: false, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.defaults(options || {}, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      models = _.isArray(models) ? models.slice() : [models];
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults(options || {}, setOptions);
      if (options.parse) models = this.parse(models, options);
      if (!_.isArray(models)) models = models ? [models] : [];
      var i, l, model, attrs, existing, sort;
      var at = options.at;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        if (!(model = this._prepareModel(models[i], options))) continue;

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(model)) {
          if (options.remove) modelMap[existing.cid] = true;
          if (options.merge) {
            existing.set(model.attributes, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }

        // This is a new model, push it to the `toAdd` list.
        } else if (options.add) {
          toAdd.push(model);

          // Listen to added models' events, and index models for lookup by
          // `id` and by `cid`.
          model.on('all', this._onModelEvent, this);
          this._byId[model.cid] = model;
          if (model.id != null) this._byId[model.id] = model;
        }
      }

      // Remove nonexistent models if appropriate.
      if (options.remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          splice.apply(this.models, [at, 0].concat(toAdd));
        } else {
          push.apply(this.models, toAdd);
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      if (options.silent) return this;

      // Trigger `add` events.
      for (i = 0, l = toAdd.length; i < l; i++) {
        (model = toAdd[i]).trigger('add', model, this, options);
      }

      // Trigger `sort` if the collection was sorted.
      if (sort) this.trigger('sort', this, options);
      return this;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      options.previousModels = this.models;
      this._reset();
      this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: this.length}, options));
      return model;
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: 0}, options));
      return model;
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function(begin, end) {
      return this.models.slice(begin, end);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj.id != null ? obj.id : obj.cid || obj];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Figure out the smallest index at which a model should be inserted so as
    // to maintain order.
    sortedIndex: function(model, value, context) {
      value || (value = this.comparator);
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _.sortedIndex(this.models, model, iterator, context);
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(resp) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options || (options = {});
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model._validate(attrs, options)) {
        this.trigger('invalid', this, attrs, options);
        return false;
      }
      return model;
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf',
    'isEmpty', 'chain'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(e.g. model, collection, id, className)* are
    // attached directly to the view.  See `viewOptions` for an exhaustive
    // list.
    _configure: function(options) {
      if (this.options) options = _.extend({}, _.result(this, 'options'), options);
      _.extend(this, _.pick(options, viewOptions));
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && window.ActiveXObject &&
          !(window.external && window.external.msActiveXFilteringEnabled)) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        callback && callback.apply(router, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional){
                     return optional ? match : '([^\/]+)';
                   })
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param) {
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname;
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.substr(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        this.iframe = Backbone.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;
      var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        this.location.replace(this.root + this.location.search + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(this.getHash());
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: options};
      fragment = this.getFragment(fragment || '');
      if (this.fragment === fragment) return;
      this.fragment = fragment;
      var url = this.root + fragment;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function (model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

}).call(this);





/**
 * Backbone Forms v0.12.0
 *
 * Copyright (c) 2013 Charles Davison, Pow Media Ltd
 *
 * License and more information at:
 * http://github.com/powmedia/backbone-forms
 */
;(function(root) {

  //DEPENDENCIES
  //CommonJS
  if (typeof exports !== 'undefined' && typeof require !== 'undefined') {
    var $ = root.jQuery || root.Zepto || root.ender || require('jquery'),
        _ = root._ || require('underscore'),
        Backbone = root.Backbone || require('backbone');
  }

  //Browser
  else {
    var $ = root.jQuery,
        _ = root._,
        Backbone = root.Backbone;
  }


  //SOURCE
  //==================================================================================================
//FORM
//==================================================================================================

var Form = Backbone.View.extend({

  /**
   * Constructor
   * 
   * @param {Object} [options.schema]
   * @param {Backbone.Model} [options.model]
   * @param {Object} [options.data]
   * @param {String[]|Object[]} [options.fieldsets]
   * @param {String[]} [options.fields]
   * @param {String} [options.idPrefix]
   * @param {Form.Field} [options.Field]
   * @param {Form.Fieldset} [options.Fieldset]
   * @param {Function} [options.template]
   */
  initialize: function(options) {
    var self = this;
    options = options || {};

	if(options.formValues) this.formValues = options.formValues;
	
    //Find the schema to use
    var schema = this.schema = (function() {
      //Prefer schema from options
      if (options.schema) return _.result(options, 'schema');
      //Then schema on model
      var model = options.model;
      if (model && model.schema) {
         return (_.isFunction(model.schema)) ? model.schema() : model.schema;
      }
      
      //Then schema on formValues
     // var formValues = options.formValues;
      //if (formValues && formValues.schema) {
      //  return (_.isFunction(formValues.schema)) ? formValues.schema() : formValues.schema;
      //}

      //Then built-in schema
      if (self.schema) {
        return (_.isFunction(self.schema)) ? self.schema() : self.schema;
      }

      //Fallback to empty schema
      return {};
    })();

    //Store important data
    _.extend(this, _.pick(options, 'model', 'data', 'idPrefix'));

    //Override defaults
    var constructor = this.constructor;
    this.template = options.template || this.template || constructor.template;
    this.Fieldset = options.Fieldset || this.Fieldset || constructor.Fieldset;
    this.Field = options.Field || this.Field || constructor.Field;
    this.NestedField = options.NestedField || this.NestedField || constructor.NestedField;

    //Check which fields will be included (defaults to all)
    var selectedFields = this.selectedFields = options.fields || _.keys(schema);

    //Create fields
    var fields = this.fields = {};

    _.each(selectedFields, function(key) {
      var fieldSchema = schema[key];
      fields[key] = this.createField(key, fieldSchema);
    }, this);

    //Create fieldsets
    var fieldsetSchema = options.fieldsets || [selectedFields],
        fieldsets = this.fieldsets = [];

    _.each(fieldsetSchema, function(itemSchema) {
      this.fieldsets.push(this.createFieldset(itemSchema));
    }, this);
  },
  
  /**
   * Creates a Fieldset instance
   *
   * @param {String[]|Object[]} schema       Fieldset schema
   *
   * @return {Form.Fieldset}
   */
  createFieldset: function(schema) {
    var options = {
      schema: schema,
      fields: this.fields
    };

    return new this.Fieldset(options);
  },

  /**
   * Creates a Field instance
   *
   * @param {String} key
   * @param {Object} schema       Field schema
   *
   * @return {Form.Field}
   */
  createField: function(key, schema) {
    var options = {
      form: this,
      key: key,
      schema: schema,
      idPrefix: this.idPrefix
    };

    if (this.model) {
      options.model = this.model;
    } else if (this.data) {
      options.value = this.data[key];
    } else {
      options.value = null;
    }

    var field = new this.Field(options);
    this.listenTo(field.editor, 'all', this.handleEditorEvent);
    return field;
  },

  /**
   * Callback for when an editor event is fired.
   * Re-triggers events on the form as key:event and triggers additional form-level events
   *
   * @param {String} event
   * @param {Editor} editor
   */
  handleEditorEvent: function(event, editor) {
    //Re-trigger editor events on the form
    var formEvent = editor.key+':'+event;

    this.trigger.call(this, formEvent, this, editor, Array.prototype.slice.call(arguments, 2));

    //Trigger additional events
    switch (event) {
      case 'change':
        this.trigger('change', this);
        break;

      case 'focus':
        if (!this.hasFocus) this.trigger('focus', this);
        break;

      case 'blur':
      	this.updateFields(editor);
        if (this.hasFocus) {
          //TODO: Is the timeout etc needed?
          var self = this;
          setTimeout(function() {
            var focusedField = _.find(self.fields, function(field) {
              return field.editor.hasFocus;
            });

            if (!focusedField) self.trigger('blur', self);
          }, 0);
        }
        break;
    }
  },
  
  updateFields: function(editor) {
  	if(this.formValues) this.formValues.updateFormValues(editor);
  	if(this.validate) this.validate({fields: [editor]});
  },

  render: function() {
    var self = this,
        fields = this.fields;

    //Render form
    var $form = $($.trim(this.template(_.result(this, 'templateData'))));

    //Render standalone editors
    $form.find('[data-editors]').add($form).each(function(i, el) {
      var $container = $(el),
          selection = $container.attr('data-editors');

      if (_.isUndefined(selection)) return;

      //Work out which fields to include
      var keys = (selection == '*')
        ? self.selectedFields || _.keys(fields)
        : selection.split(',');

      //Add them
      _.each(keys, function(key) {
        var field = fields[key];

        $container.append(field.editor.render().el);
      });
    });

    //Render standalone fields
    $form.find('[data-fields]').add($form).each(function(i, el) {
      var $container = $(el),
          selection = $container.attr('data-fields');

      if (_.isUndefined(selection)) return;

      //Work out which fields to include
      var keys = (selection == '*')
        ? self.selectedFields || _.keys(fields)
        : selection.split(',');

      //Add them
      _.each(keys, function(key) {
        var field = fields[key];

        $container.append(field.render().el);
      });
    });

    //Render fieldsets
    $form.find('[data-fieldsets]').add($form).each(function(i, el) {
      var $container = $(el),
          selection = $container.attr('data-fieldsets');

      if (_.isUndefined(selection)) return;

      _.each(self.fieldsets, function(fieldset) {
        $container.append(fieldset.render().el);
      });
    });

    //Set the main element
    this.setElement($form);
    //Set class
    $form.addClass(this.className);
    return this;
  },
  
  
  /**
   *  Show error message
   * */
	

	ShowValidateMessage: function(options) {
   		if(!options) return;
   		
   		var self = this,
        field = options.field,
        errorsMessage = options.message;
console.error(field, errorsMessage);
return;
    //Collect errors from schema validation
    //_.each(fields, function(field) {
     // var error = field.validate();
      //if (error) {
       // errors[field.key] = error;
      //}
    //});

    //Get errors from default Backbone model validator
    if (!options.skipModelValidate && model && model.validate) {
      var modelErrors = model.validate(this.getValue());

      if (modelErrors) {
        var isDictionary = _.isObject(modelErrors) && !_.isArray(modelErrors);

        //If errors are not in object form then just store on the error object
        if (!isDictionary) {
          errors._others = errors._others || [];
          errors._others.push(modelErrors);
        }

        //Merge programmatic errors (requires model.validate() to return an object e.g. { fieldKey: 'error' })
        if (isDictionary) {
          _.each(modelErrors, function(val, key) {
            //Set error on field if there isn't one already
            if (fields[key] && !errors[key]) {
              fields[key].setError(val);
              errors[key] = val;
            } else {
              //Otherwise add to '_others' key
              errors._others = errors._others || [];
              var tmpErr = {};
              tmpErr[key] = val;
              errors._others.push(tmpErr);
            }
          });
        }
      }
    }
	
    return _.isEmpty(errors) ? null : errors;
  },


  /**
   * Validate the data
   *
   * @return {Object}       Validation errors
   */
  validate: function(options) {
    var self = this,
        fields = this.fields,
        model = this.model,
        errors = {};

    options = options || {};

    //Collect errors from schema validation
    _.each(fields, function(field) {
      var error = field.validate();
      if (error) {
        errors[field.key] = error;
      }
    });

    //Get errors from default Backbone model validator
    if (!options.skipModelValidate && model && model.validate) {
      var modelErrors = model.validate(this.getValue());

      if (modelErrors) {
        var isDictionary = _.isObject(modelErrors) && !_.isArray(modelErrors);

        //If errors are not in object form then just store on the error object
        if (!isDictionary) {
          errors._others = errors._others || [];
          errors._others.push(modelErrors);
        }

        //Merge programmatic errors (requires model.validate() to return an object e.g. { fieldKey: 'error' })
        if (isDictionary) {
          _.each(modelErrors, function(val, key) {
            //Set error on field if there isn't one already
            if (fields[key] && !errors[key]) {
              fields[key].setError(val);
              errors[key] = val;
            }

            else {
              //Otherwise add to '_others' key
              errors._others = errors._others || [];
              var tmpErr = {};
              tmpErr[key] = val;
              errors._others.push(tmpErr);
            }
          });
        }
      }
    }
	
    return _.isEmpty(errors) ? null : errors;
  },

  /**
   * Update the model with all latest values.
   *
   * @param {Object} [options]  Options to pass to Model#set (e.g. { silent: true })
   *
   * @return {Object}  Validation errors
   */
  commit: function(options) {
    //Validate
    options = options || {};

    var validateOptions = {
        skipModelValidate: !options.validate
    };

    var errors = this.validate(validateOptions);
    if (errors) return errors;

    //Commit
    var modelError;

    var setOptions = _.extend({
      error: function(model, e) {
        modelError = e;
      }
    }, options);

    this.model.set(this.getValue(), setOptions);
    
    if (modelError) return modelError;
  },

  /**
   * Get all the field values as an object.
   * Use this method when passing data instead of objects
   *
   * @param {String} [key]    Specific field value to get
   */
  getValue: function(key) {
    //Return only given key if specified
    if (key) return this.fields[key].getValue();

    //Otherwise return entire form
    var values = {};
    _.each(this.fields, function(field) {
      values[field.key] = field.getValue();
    });

    return values;
  },

  /**
   * Update field values, referenced by key
   *
   * @param {Object|String} key     New values to set, or property to set
   * @param val                     Value to set
   */
  setValue: function(prop, val) {
    var data = {};
    if (typeof prop === 'string') {
      data[prop] = val;
    } else {
      data = prop;
    }

    var key;
    for (key in this.schema) {
      if (data[key] !== undefined) {
        this.fields[key].setValue(data[key]);
      }
    }
  },

  /**
   * Returns the editor for a given field key
   *
   * @param {String} key
   *
   * @return {Editor}
   */
  getEditor: function(key) {
    var field = this.fields[key];
    if (!field) throw 'Field not found: '+key;

    return field.editor;
  },

  /**
   * Gives the first editor in the form focus
   */
  focus: function() {
    if (this.hasFocus) return;

    //Get the first field
    var fieldset = this.fieldsets[0],
        field = fieldset.getFieldAt(0);

    if (!field) return;

    //Set focus
    field.editor.focus();
  },

  /**
   * Removes focus from the currently focused editor
   */
  blur: function() {
    if (!this.hasFocus) return;

    var focusedField = _.find(this.fields, function(field) {
      return field.editor.hasFocus;
    });

    if (focusedField) focusedField.editor.blur();
  },

  /**
   * Manages the hasFocus property
   *
   * @param {String} event
   */
  trigger: function(event) {
    if (event === 'focus') {
      this.hasFocus = true;
    }
    else if (event === 'blur') {
      this.hasFocus = false;
    }

    return Backbone.View.prototype.trigger.apply(this, arguments);
  },

  /**
   * Override default remove function in order to remove embedded views
   *
   * TODO: If editors are included directly with data-editors="x", they need to be removed
   * May be best to use XView to manage adding/removing views
   */
  remove: function() {
    _.each(this.fieldsets, function(fieldset) {
      fieldset.remove();
    });

    _.each(this.fields, function(field) {
      field.remove();
    });

    return Backbone.View.prototype.remove.apply(this, arguments);
  }

}, {

  //STATICS
  template: _.template('\
    <form data-fieldsets class="autoform"></form>\
  ', null, this.templateSettings),

  templateSettings: {
    evaluate: /<%([\s\S]+?)%>/g, 
    interpolate: /<%=([\s\S]+?)%>/g, 
    escape: /<%-([\s\S]+?)%>/g
  },

  editors: {}

});

  
//==================================================================================================
//VALIDATORS
//==================================================================================================

Form.validators = (function() {
  var validators = {};
  validators.errMessages = {
    required: 'Required',
    regexp: 'Invalid',
    email: 'Invalid email address',
    url: 'Invalid URL',
    match: _.template('Must match field "<%= field %>"', null, Form.templateSettings)
  };
  
  validators.required = function(options) {
    options = _.extend({
      type: 'required',
      message: this.errMessages.required
    }, options);
     
    return function required(value) {
      options.value = value;
      var err = {
        type: options.type,
        message: _.isFunction(options.message) ? options.message(options) : options.message
      };
      if (value === null || value === undefined || value === false || value === '') return err;
    };
  };
  
  validators.regexp = function(options) {
    if (!options.regexp) throw new Error('Missing required "regexp" option for "regexp" validator');
    options = _.extend({
      type: 'regexp',
      message: this.errMessages.regexp
    }, options);
    
    return function regexp(value) {
      options.value = value;
      var err = {
        type: options.type,
        message: _.isFunction(options.message) ? options.message(options) : options.message
      };
      
      //Don't check empty values (add a 'required' validator for this)
      if (value === null || value === undefined || value === '') return;
      if (!options.regexp.test(value)) return err;
    };
  };
  
  validators.email = function(options) {
    options = _.extend({
      type: 'email',
      message: this.errMessages.email,
      regexp: /^[\w\-]{1,}([\w\-\+.]{1,1}[\w\-]{1,}){0,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/
    }, options);
    
    return validators.regexp(options);
  };
  
  validators.url = function(options) {
    options = _.extend({
      type: 'url',
      message: this.errMessages.url,
      regexp: /^(http|https):\/\/(([A-Z0-9][A-Z0-9_\-]*)(\.[A-Z0-9][A-Z0-9_\-]*)+)(:(\d+))?\/?/i
    }, options);
    
    return validators.regexp(options);
  };
  
  validators.match = function(options) {
    if (!options.field) throw new Error('Missing required "field" options for "match" validator');
    
    options = _.extend({
      type: 'match',
      message: this.errMessages.match
    }, options);
    
    return function match(value, attrs) {
      options.value = value;
      
      var err = {
        type: options.type,
        message: _.isFunction(options.message) ? options.message(options) : options.message
      };
      
      //Don't check empty values (add a 'required' validator for this)
      if (value === null || value === undefined || value === '') return;
      
      if (value !== attrs[options.field]) return err;
    };
  };

  return validators;

})();


//==================================================================================================
//FIELDSET
//==================================================================================================

Form.Fieldset = Backbone.View.extend({

  /**
   * Constructor
   *
   * Valid fieldset schemas:
   *   ['field1', 'field2']
   *   { legend: 'Some Fieldset', fields: ['field1', 'field2'] }
   *
   * @param {String[]|Object[]} options.schema      Fieldset schema
   * @param {Object} options.fields           Form fields
   */
  initialize: function(options) {
    options = options || {};

    //Create the full fieldset schema, merging defaults etc.
    var schema = this.schema = this.createSchema(options.schema);

    //Store the fields for this fieldset
    this.fields = _.pick(options.fields, schema.fields);
    
    //Override defaults
    this.template = options.template || this.constructor.template;
  },

  /**
   * Creates the full fieldset schema, normalising, merging defaults etc.
   *
   * @param {String[]|Object[]} schema
   *
   * @return {Object}
   */
  createSchema: function(schema) {
    //Normalise to object
    if (_.isArray(schema)) {
      schema = { fields: schema };
    }

    //Add null legend to prevent template error
    schema.legend = schema.legend || null;

    return schema;
  },

  /**
   * Returns the field for a given index
   *
   * @param {Number} index
   *
   * @return {Field}
   */
  getFieldAt: function(index) {
    var key = this.schema.fields[index];

    return this.fields[key];
  },

  /**
   * Returns data to pass to template
   *
   * @return {Object}
   */
  templateData: function() {
    return this.schema;
  },

  /**
   * Renders the fieldset and fields
   *
   * @return {Fieldset} this
   */
  render: function() {
    var schema = this.schema,
        fields = this.fields;

    //Render fieldset
    var $fieldset = $($.trim(this.template(_.result(this, 'templateData'))));
	
    //Render fields
    $fieldset.find('[data-fields]').add($fieldset).each(function(i, el) {
      var $container = $(el),
          selection = $container.attr('data-fields');

      if (_.isUndefined(selection)) return;

      _.each(fields, function(field) {
        $container.append(field.render().el);
      });
    });

    this.setElement($fieldset);

    return this;
  },

  /**
   * Remove embedded views then self
   */
  remove: function() {
    _.each(this.fields, function(field) {
      field.remove();
    });

    Backbone.View.prototype.remove.call(this);
  }
  
}, {
  //STATICS

  template: _.template('\
    <fieldset data-fields>\
      <% if (legend) { %>\
        <legend><%= legend %></legend>\
      <% } %>\
    </fieldset>\
  ', null, Form.templateSettings)

});

//==================================================================================================
//FIELD
//==================================================================================================

Form.Field = Backbone.View.extend({

  /**
   * Constructor
   * 
   * @param {Object} options.key
   * @param {Object} options.form
   * @param {Object} [options.schema]
   * @param {Function} [options.schema.template]
   * @param {Backbone.Model} [options.model]
   * @param {Object} [options.value]
   * @param {String} [options.idPrefix]
   * @param {Function} [options.template]
   * @param {Function} [options.errorClassName]
   */
  initialize: function(options) {
    options = options || {};
    //Store important data
    _.extend(this, _.pick(options, 'form', 'key', 'model', 'value', 'idPrefix'));

    //Create the full field schema, merging defaults etc.
    var schema = this.schema = this.createSchema(options.schema);
    //Override defaults
    this.template = options.template || schema.template || this.constructor.template;
    this.errorClassName = options.errorClassName || this.constructor.errorClassName;

    //Create editor
    this.editor = this.createEditor();
  },

  /**
   * Creates the full field schema, merging defaults etc.
   *
   * @param {Object|String} schema
   *
   * @return {Object}
   */
  createSchema: function(schema) {
    if (_.isString(schema)) schema = { type: schema };
    //Set defaults
    if(_.isUndefined(schema.showLable) || schema.showLable) {
	    schema = _.extend({
	      type: 'Text',
	      title: (schema.label)?schema.label:''
	    }, schema);
    }
    //Get the real constructor function i.e. if type is a string such as 'Text'
    schema.type = (_.isString(schema.type)) ? Form.editors[schema.type] : schema.type;
    return schema;
  },

  /**
   * Creates the editor specified in the schema; either an editor string name or
   * a constructor function
   *
   * @return {View}
   */
  createEditor: function() {
    var options = _.extend(
      _.pick(this, 'schema', 'form', 'key', 'model', 'value'),
      { id: this.createEditorId() }
    );
    var constructorFn = this.schema.type;
    return new constructorFn(options);
  },

  /**
   * Creates the ID that will be assigned to the editor
   *
   * @return {String}
   */
  createEditorId: function() {
    var prefix = this.idPrefix,
        id = this.key;
    //Replace periods with underscores (e.g. for when using paths)
    id = id.replace(/\./g, '_');

    //If a specific ID prefix is set, use it
    if (_.isString(prefix) || _.isNumber(prefix)) return prefix + id;
    if (_.isNull(prefix)) return id;

    //Otherwise, if there is a model use it's CID to avoid conflicts when multiple forms are on the page
    if (this.model) return this.model.cid + '_' + id;
    return id;
  },

  /**
   * Create the default field title (label text) from the key name.
   * (Converts 'camelCase' to 'Camel Case')
   *
   * @return {String}
   */
  createTitle: function() {
    var str = (this.schema && this.schema.label)?this.schema.label:this.key;
    //Add spaces
    str = str.replace(/([A-Z])/g, ' $1');
    //Uppercase first character
    str = str.replace(/^./, function(str) { return str.toUpperCase(); });
    return str;
  },

  /**
   * Returns the data to be passed to the template
   *
   * @return {Object}
   */
  templateData: function() {
    var schema = this.schema;
    return {
      help: schema.help || '',
      title: schema.title,
      fieldAttrs: schema.fieldAttrs,
      editorAttrs: schema.editorAttrs,
      key: this.key,
      editorId: this.editor.id
    };
  },

  /**
   * Render the field and editor
   *
   * @return {Field} self
   */
  render: function() {
    var schema = this.schema,
        editor = this.editor;

//	  console.log(schema,editor);

    //Only render the editor if Hidden
    if (schema.type == Form.editors.Hidden) {
      return this.setElement(editor.render().el);
    }

    //Render field
    var $field = $($.trim(this.template(_.result(this, 'templateData'))));
    if (schema.fieldClass) $field.addClass("input-field "+schema.fieldClass);
    if (schema.fieldAttrs) $field.attr(schema.fieldAttrs);

    //Render editor
    $field.find('[data-editor]').add($field).each(function(i, el) {
      var $container = $(el),
          selection = $container.attr('data-editor');
      if (_.isUndefined(selection)) return;
      $container.append(editor.render().el);

	    if(schema.tooltip && schema.tooltip != ""){
		    $container.find('input,label,textarea,.dropdown-wrapper').qtip({
			    content: schema.tooltip,
			    show: 'mousedown',
			    position: {
				    my: "bottom center",
				    at: "top center"
			    },
			    style: {
		//		    classes: 'header-dropdown'
			    }
		    });
	    }

    });
    this.setElement($field);
    
    if(this.schema.hideElement)
    	this.$el.addClass("hide");
    
    return this;
  },
  
  showField: function() {
  	this.$el.removeClass("hide");
  },

  /**
   * Check the validity of the field
   *
   * @return {String}
   */
  validate: function() {
    var error = this.editor.validate();

    if (error) {
      this.setError(error.message);
    } else {
      this.clearError();
    }
    return error;
  },

  /**
   * Set the field into an error state, adding the error class and setting the error message
   *
   * @param {String} msg     Error message
   */
  setError: function(msg) {
    //Nested form editors (e.g. Object) set their errors internally
    if (this.editor.hasNestedForm) return;

	  console.log(this.$el);

    //Add error CSS class
    this.$el.addClass(this.errorClassName);
	  var self = this;

	  //Set error message
	  this.$('[data-error]').html(msg).fadeIn();
	  setTimeout(function(){
		  self.$('[data-error]').fadeOut(1000);
	  },3000);


  },

  /**
   * Clear the error state and reset the help message
   */
  clearError: function() {
    //Remove error CSS class
   this.$el.removeClass(this.errorClassName);

    //Clear error message
    this.$('[data-error]').empty();
  },

  /**
   * Update the model with the new value from the editor
   *
   * @return {Mixed}
   */
  commit: function() {
    return this.editor.commit();
  },

  /**
   * Get the value from the editor
   *
   * @return {Mixed}
   */
  getValue: function() {
    return this.editor.getValue();
  },

  /**
   * Set/change the value of the editor
   *
   * @param {Mixed} value
   */
  setValue: function(value) {
    this.editor.setValue(value);
  },

  /**
   * Give the editor focus
   */
  focus: function() {
    this.editor.focus();
  },

  /**
   * Remove focus from the editor
   */
  blur: function() {
    this.editor.blur();
  },

  /**
   * Remove the field and editor views
   */
  remove: function() {
    this.editor.remove();

    Backbone.View.prototype.remove.call(this);
  }

}, {
  //STATICS

  template: _.template('\
    <div class="field-row">\
      <label for="<%= editorId %>"><%= title %></label>\
      <div>\
        <span data-editor></span>\
        <div data-error></div>\
        <div><%= help %></div>\
      </div>\
    </div>\
  ', null, Form.templateSettings),

  /**
   * CSS class name added to the field when there is a validation error
   */
  errorClassName: 'error'

});


//==================================================================================================
//NESTEDFIELD
//==================================================================================================

Form.NestedField = Form.Field.extend({

  template: _.template($.trim('\
    <div>\
      <span data-editor></span>\
      <% if (help) { %>\
        <div><%= help %></div>\
      <% } %>\
      <div data-error></div>\
    </div>\
  '), null, Form.templateSettings)

});

/**
 * Base editor (interface). To be extended, not used directly
 *
 * @param {Object} options
 * @param {String} [options.id]         Editor ID
 * @param {Model} [options.model]       Use instead of value, and use commit()
 * @param {String} [options.key]        The model attribute key. Required when using 'model'
 * @param {Mixed} [options.value]       When not using a model. If neither provided, defaultValue will be used
 * @param {Object} [options.schema]     Field schema; may be required by some editors
 * @param {Object} [options.validators] Validators; falls back to those stored on schema
 * @param {Object} [options.form]       The form
 */
Form.Editor = Form.editors.Base = Backbone.View.extend({

  defaultValue: null,

  hasFocus: false,

  initialize: function(options) {
    var options = options || {};

    //Set initial value
    if (options.model) {
      if (!options.key) throw "Missing option: 'key'";
      this.model = options.model;
      this.value = this.model.get(options.key);
    } else if (options.value !== undefined) {
      this.value = options.value;
    }

    if (this.value === undefined) this.value = this.defaultValue;

    //Store important data
    _.extend(this, _.pick(options, 'key', 'form'));
    var schema = this.schema = options.schema || {};

    this.validators = options.validators || schema.validators;

    //Main attributes
    this.$el.attr('id', this.id);
    this.$el.attr('name', this.getName());
    if (schema.editorClass) this.$el.addClass(schema.editorClass);
    if (schema.editorAttrs) this.$el.attr(schema.editorAttrs);
  },

	setFieldWidth: function(){
		if(this.field_width) this.$el.css({'width':this.field_width});
	},
  /**
   * Get the value for the form input 'name' attribute
   *
   * @return {String}
   *
   * @api private
   */
  getName: function() {
    var key = this.key || '';

    //Replace periods with underscores (e.g. for when using paths)
    return key.replace(/\./g, '_');
  },

  /**
   * Get editor value
   * Extend and override this method to reflect changes in the DOM
   *
   * @return {Mixed}
   */
  getValue: function() {
    return this.value;
  },

  /**
   * Set editor value
   * Extend and override this method to reflect changes in the DOM
   *
   * @param {Mixed} value
   */
  setValue: function(value) {
    this.value = value;
  },

  /**
   * Give the editor focus
   * Extend and override this method
   */
  focus: function() {
    throw 'Not implemented';
  },
  
  /**
   * Remove focus from the editor
   * Extend and override this method
   */
  blur: function() {
    throw 'Not implemented';
  },

  /**
   * Update the model with the current value
   *
   * @param {Object} [options]              Options to pass to model.set()
   * @param {Boolean} [options.validate]    Set to true to trigger built-in model validation
   *
   * @return {Mixed} error
   */
  
  commit: function(options) {
    var error = this.validate();
    if (error) return error;

    this.listenTo(this.model, 'invalid', function(model, e) {
      error = e;
    });
    this.model.set(this.key, this.getValue(), options);

    if (error) return error;
  },

  /**
   * Check validity
   *
   * @return {Object|Undefined}
   */
  validate: function() {
    var $el = this.$el,
        error = null,
        value = this.getValue(),
        formValues = this.form ? this.form.getValue() : {},
        validators = this.validators,
        getValidator = this.getValidator;

    if (validators) {
      //Run through validators until an error is found
      _.every(validators, function(validator) {
        error = getValidator(validator)(value, formValues);

        return error ? false : true;
      });
    }
    return error;
  },

  /**
   * Set this.hasFocus, or call parent trigger()
   *
   * @param {String} event
   */
  trigger: function(event) {
    if (event === 'focus') {
      this.hasFocus = true;
    }
    else if (event === 'blur') {
      this.hasFocus = false;
    }
    return Backbone.View.prototype.trigger.apply(this, arguments);
  },

  /**
   * Returns a validation function based on the type defined in the schema
   *
   * @param {RegExp|String|Function} validator
   * @return {Function}
   */
  getValidator: function(validator) {
    var validators = Form.validators;

    //Convert regular expressions to validators
    if (_.isRegExp(validator)) {
      return validators.regexp({ regexp: validator });
    }
    
    //Use a built-in validator if given a string
    if (_.isString(validator)) {
      if (!validators[validator]) throw new Error('Validator "'+validator+'" not found');
      
      return validators[validator]();
    }

    //Functions can be used directly
    if (_.isFunction(validator)) return validator;

    //Use a customised built-in validator if given an object
    if (_.isObject(validator) && validator.type) {
      var config = validator;
      
      return validators[config.type](config);
    }
    
    //Unkown validator type
    throw new Error('Invalid validator: ' + validator);
  }
});

/**
 * Text
 * 
 * Text input with focus, blur and change events
 */
Form.editors.Text = Form.Editor.extend({
  tagName: 'input',
  defaultValue: '',
  previousValue: '',
  events: {
    'keyup':    'determineChange',
    'keypress': function(event) {
      var self = this;
      setTimeout(function() {
        self.determineChange();
      }, 0);
    },
    'select': function(event) {
      this.trigger('select', this);
    },
    'focus': function(event) {
      this.trigger('focus', this);
    },
    'blur': function(event) {
      this.trigger('blur', this);
    },
    'change': 'change'
  },
  
  change: function(e) {
  	if(this.changeEvent) this.changeEvent(e);
  	if(this.validate) this.validate();
  },
  
  // validate field from sever
  validateField: function(editor, error_message) {
  	this.serverValidate({field: editor, message: error_message});
  	//alert("validate field");
  	// var error = this.editor.validate();

   // if (error) {
     // this.setError(error_message);
    //} else {
      //this.clearError();
    //}
    //return error;
  },
  
  initialize: function(options) {
    _.bindAll(this);
    Form.editors.Base.prototype.initialize.call(this, options);
    var schema = this.schema;
    //Allow customising text type (email, phone etc.) for HTML5 browsers
    var type = 'text';
    if (schema && schema.editorAttrs && schema.editorAttrs.type) type = schema.type;
    if (schema && schema.dataType) type = schema.dataType;
    if (schema && schema.changeEvent) this.changeEvent = schema.changeEvent;

	this.setAllAttr(this.schema.attr);
    this.$el.attr('type', type);

    this.setOptions(options.schema.form_values);
    
    if(this.defaultValue) this.value = this.defaultValue;
    
    if(this.schema.bindDatePicker) {
		this.bindDatePickerFn();
    }
  },
  
  setOptions : function(options) {
	for (var i in options) {
		this[i] = options[i];
	}
  },
  
  bindDatePickerFn: function() {
	this.$el.datepicker({
		dateFormat: 'M d, yy',
		changeMonth : true,
		changeYear : true
	});
	
	//changeEvent
  },
  
  setAllAttr: function(options) {
  	for(var i in options) {
  		this.$el.attr(i, options[i]);
  	}
  },

  /**
   * Adds the editor to the DOM
   */
  render: function() {
    this.setValue(this.value);
	this.setFieldWidth();
    return this;
  },

  determineChange: function(event) {
    var currentValue = this.$el.val();
    var changed = (currentValue !== this.previousValue);

    if (changed) {
      this.previousValue = currentValue;
      this.trigger('change', this);
    }
  },
 

  /**
   * Returns the current editor value
   * @return {String}
   */
  getValue: function() {
  	if(this.schema.bindDatePicker)
  		return this.$el.datepicker('getDate');
  	else
    	return this.$el.val();
  },

  /**
   * Sets the value of the form element
   * @param {String}
   */
  setValue: function(value) {
    this.$el.val(value);
  },

  focus: function() {
    if (this.hasFocus) return;
    this.$el.focus();
  },

  blur: function() {
    if (!this.hasFocus) return;

    this.$el.blur();
  },

  select: function() {
    this.$el.select();
  }

});

/**
 * Location editor
 */
Form.editors.Location = Form.editors.Text.extend({

  tagName: 'div',
  locationId: null,
  map_id: "",

  template: '<textarea placeholder="Address" class="location-h address-h" rows="3" cols="25"><%= address %></textarea>\
			 <span class="address-error hide address-error-status-h"></span>\
			 <a href="javascript: void(0);" class="verify-address-h">Verify Address</a>\
			 <div id="<%= map_id %>" style="width: 97%; height: 250px; margin-top: 20px; display:none;"></div>',

  events: {
	'click .verify-address-h': 'verifyAddress',
	'blur .verify-address-h': 'verifyAddress'
  },	
  
  // Verify Address
  verifyAddress: function() {
		var _self = this, address = _self.$el.find('.address-h').val();
		
		var verifyAddress = require('usercontrol/location/models/verify-adress');
			_self.locationId = undefined;
			
			_self.adressModel = new verifyAddress();
			_self.adressModel.address = address;
			_self.adressModel.url();
			_self.adressModel.set({address: address});
			_self.adressModel.showError = function(model, error) {
			try {
				_self.$el.find('.set-address-h').addClass('link-disabled');
				_self.$el.find('.address-error-status-h').removeClass('hide').html(error.responseJSON.exec_data.error_array[0].error);
			} catch(e) {  }
				_self.$el.find('.address-h').addClass('address-field-error').removeClass('address-verified');
			};
			_self.adressModel.save({dataType:"json"});
			_self.$el.find('.address-h').removeClass('address-verified');
			$.when(_self.adressModel.request).done(function() {
				console.log(_self.adressModel.toJSON());
				_self.locationId = _self.adressModel.get("payload").id;
				if(_self.locationId) {
					_self.$el.find('.address-error-status-h').addClass('hide');
					_self.$el.find('.address-h').removeClass('address-field-error').addClass('address-verified');
					_self.location.latitude = _self.adressModel.get("payload").lat;
					_self.location.longitude = _self.adressModel.get("payload").lon;
					_self.$el.find('.set-address-h').removeClass('link-disabled');
					if(_self.map) {
						var pos = new google.maps.LatLng(_self.location.latitude,_self.location.longitude);
						_self.refreshAndPosition(pos);
					} else {
						_self.createMap();
					}
					_self.trigger("blur", _self);
				}
			});
  },
  
	createMap: function() {
		this.$el.find('#' + this.map_id).show();

		var _self = this;
		var pos = new google.maps.LatLng(_self.location.latitude, _self.location.longitude),
			mapOptions = {
				zoom: 13,
				scaleControl: true,
				zoomControl: true,
				scrollwheel: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

		this.map = new google.maps.Map(document.getElementById(this.map_id), mapOptions);
		this.marker = new google.maps.Marker({position: pos, map: this.map});
		this.marker.setMap(this.map);

		_self.refreshAndPosition(pos);
	},

	refreshAndPosition: function(pos){
		var self = this;
		setTimeout(function(){
			google.maps.event.trigger(self.map,"resize");
			self.marker.setPosition(pos);
			self.map.panTo(pos);
		},50);
	},
  
  
  determineChange: function(event) {
    var _self = this, currentValue = this.$el.val();
    _self.$el.addClass('ui-autocomplete-loading');
	if(this.getData) this.getData(currentValue, function(data) {
		_self.cities = [];
		
		for (var key in data) {
			_self.cities.push(data[key]);
		}
		var cityArr = [];
		_self.cities.forEach(function(value, index) {
			cityArr.push(value['city']);
		});
		
		// Destroy existing autocomplete from text box before attaching it again
		// try catch as for the first time it gives error
		try { _self.$el.autocomplete("destroy"); } catch(ex) {}
		_self.$el.autocomplete({
			source : cityArr
		});
		//Trigger keydown to display the autocomplete dropdown just created
		_self.$el.trigger('keydown');
	});
  },
  
  /* Autocomplete  */ 
  autoComplete: function() {
  	$(e.target).autocomplete({
		source : arr
	});
  },

  /**
   * Override Text constructor so type property isn't set (issue #261)
   */
  initialize: function(options) {
  	_.bindAll(this);
    Form.editors.Base.prototype.initialize.call(this, options);

	this.map_id = "map-canvas-" + Math.floor((Math.random() * 10000) + 1);

     var schema = options.schema;
    //Allow customising text type (email, phone etc.) for HTML5 browsers
    if (schema && schema.getData) this.getData = schema.getData;  
    
	this.setFormOptions(options.schema.form_values);

		  this.value = this.defaultValue || '';

	this.location = {
		latitude: undefined,
		longitude: undefined
	};

	if(options.callback) this.callback = options.callback;
	this.location.latitude = (!_.isUndefined(schema.latitude))?schema.latitude:undefined;
	this.location.longitude = (!_.isUndefined(schema.longitude))?schema.longitude:undefined;
	this.locationId = (!_.isUndefined(schema.locationId))?schema.locationId:undefined;
  },
  
  setFormOptions: function(fields) {
  	if(fields) {
  		for(var i in fields) {
  			this[i] = fields[i];
  		}
  	}
  },
  
  
  render: function() {
  	// compile temoplate
	var self = this, markup = _.template(this.template, {address:this.value,map_id:this.map_id});//Mustache.to_html(self.template, this.data);
	this.$el.html(markup);
	if(this.location.latitude !== undefined && this.location.longitude !== undefined){
		var count = 0;
		var timer = setInterval(function(){
			count++;
			if($('#' + self.map_id).length){
				self.createMap();
				clearInterval(timer);
			} else if(count > 20){
				clearInterval(timer);
			}
		},300);

	}
	return this;
  },
  
    /**
   * Returns the current editor value
   * @return {String}
   */
  getValue: function() {
    return this.locationId;
  },

  /**
   * Sets the value of the form element
   * @param {String}
   */
  
  
  
  
  setValue: function(value) {
  // this.locationId = value;
   this.$el.find(".address-h").val(value);
   this.$el.find(".verify-address-h").trigger("click");
  },

  focus: function() {
    if (this.hasFocus) return;
    this.$el.focus();
  },

  blur: function() {
    if (!this.hasFocus) return;
    this.$el.blur();
  },

  select: function() {
    this.$el.select();
  }
});


/**
 * Auto Complete editor
 */
Form.editors.AutoComplete = Form.editors.Text.extend({

  tagName: 'input',
  defaultValue: '',
  previousValue: '',

  events: {
    'keyup':    'determineChange',
    'keypress': function(event) {
      // var self = this;
	  // $(event.target).addClass('ui-autocomplete-loading');
      // setTimeout(function() {
        // self.determineChange();
      // }, 0);
    },
    'select':   function(event) {
      this.trigger('select', this);
    },
    'focus':    function(event) {
      this.trigger('focus', this);
    },
    'blur':    function(event) {
      this.trigger('checkForEmpty', this);
    }
  },

	/**METHOD** Provide if a pressed key is valid for autocomplete hit or not
	 Parameters:
	 key-code : key code of the key just pressed
	 Returns:
	 boolean true will continues auto complete and stops in false
	 **/
	isValidAutoCompleteKey: function (event) {
		if (event) {
			var code = (event.keyCode ? event.keyCode : event.which);
			if (( code >= 59 && code <= 90)// alphabets
				|| (code >= 96 && code <= 105)// numeric
				|| (code == 8)// backspace
				|| (code == 32 )// spacebar
				|| (code == 46) //delete
				) {
				return true;
			}
		}
		return false;
	},
	
	checkForEmpty: function() {
		alert("sdasd");
		var _self = this, currentValue = this.$el.val();
    	console.error(currentValue);
		if(currentValue == "") {
			if(_self.afterSetValue && _.isFunction(_self.afterSetValue)) _self.afterSetValue("hide");
			_self.$el.removeClass('ui-autocomplete-loading');
		}
	},

	determineChange: function(event) {
		
		if(!this.isValidAutoCompleteKey(event)) return;

		    var _self = this, currentValue = this.$el.val();
			if(this.getData && currentValue != "") {
				_self.$el.addClass('ui-autocomplete-loading');
				 this.getData(currentValue, function(data) {
				    console.error("callback",data,currentValue);

				_self.records = [];
				if(!_self.keyNameInPayload) _self.keyNameInPayload = 'name';
				var attr = _self.keyNameInPayload;

				var sublabel = _self.subLabelInPayload ? _self.subLabelInPayload : null;

				for (var key in data) {
					_self.records.push(data[key]);
				}

				var arr = [];

				if(_self.initialInsert && typeof(_self.initialInsert) === 'object') arr.push(_self.initialInsert);

				_self.records.forEach(function(value, index) {
					var v = (value.payload)?value.payload[attr]:value[attr],
						sub = (sublabel && value.payload) ? value.payload[sublabel] : sublabel ? value[sublabel] : "";
						id = (value.payload)?value.payload['id']:value['id'];
					arr.push({
						value: v,
						l: sub,
						id: id,
						full_return:value.payload
					});
				});

				if(_self.finalInsert && typeof(_self.finalInsert) === 'object') arr.push(_self.finalInsert);

				 console.log(arr);
				 var selectOrChange = function( event, ui ) {
					 if(_self.afterSetValue && _.isFunction(_self.afterSetValue)) _self.afterSetValue("show");

					 console.log("select or change");
					 if(ui.item){
						 _self.$el.parent().find(".indicator-h").removeClass("invalid").addClass("valid");

						 var id = (ui.item.id)?ui.item.id:ui.item.value;
						 _self.$el.attr("data-id", id);
						 _self.trigger("blur", _self);

						 if(ui.item.customCallback && typeof(ui.item.customCallback)==='function') ui.item.customCallback(id,ui.item);
						 else if(_self.callback) _self.callback(id,ui.item);
					 }
					 //_self.$el.removeClass('ui-autocomplete-loading');
				 };

				 // Destroy existing autocomplete from text box before attaching it again
				 // try catch as for the first time it gives error

				 try { _self.$el.autocomplete("destroy"); } catch(ex) {   }


					 if(!arr.length){
						 console.log("No Results");
						 if(_self.noResultsCallback &&_.isFunction(_self.noResultsCallback)) _self.noResultsCallback(currentValue);
					 }
					 else{
						 _self.$el.autocomplete({
							 source : arr,
							 select: selectOrChange,
							 change: selectOrChange,
							 response: function(event,ui){
								 if(!ui.content.length){
									 //reset id
									 _self.$el.attr("data-id", "");
									 if(_self.callback) _self.callback(0);
								 }
								 console.log("hopefully this is every key stroke",ui)
							 }
						 }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
							 var returnVal = $( "<li>" );
							 var inner = '<a>';

							 console.log(typeof(item.value));

							 if(typeof(item.value)==="string") inner += item.value;
							 else if(typeof(item.value)==="function") inner += item.value(currentValue);

							 if(item.l != "") inner += "<br><span class='sub-label'>" + item.l + "</span>";

							 inner += "</a>";

							 return returnVal.append( inner ).appendTo( ul );
						 };
					 }



				//Trigger keydown to display the autocomplete dropdown just created
				_self.$el.trigger('keydown');
			});
		} else {
				if(_self.afterSetValue && _.isFunction(_self.afterSetValue)) _self.afterSetValue("hide");
				_self.$el.removeClass('ui-autocomplete-loading');
		}
  },
  
  /* Autocomplete  */ 
  // autoComplete: function(e) {
  	// $(e.target).autocomplete({
		// source : arr,
		// select: function( event, ui ) {
			// console.log("select called");
			// _self.$el.attr("data-id",  (ui.item.id)?ui.item.id:ui.item.value);
		// }
	// });
  // },
  
  setOptions : function(options) {
	for (var i in options) {
		this[i] = options[i];
	}
  },

  /**
   * Override Text constructor so type property isn't set (issue #261)
   */
  
  initialize: function(options) {
    Form.editors.Base.prototype.initialize.call(this, options);
     var _self = this, schema = options.schema;
     
    //Allow customising text type (email, phone etc.) for HTML5 browsers
    //if (schema && schema.form_values && schema.form_values) this.getData = schema.getData;    
    this.$el.attr('type', 'text');
    this.setOptions(options.schema.form_values);
    this.setFieldWidth();
    if(this.automaticFetch) {
    	_self.automaticFetchFn(_self);
    }

    // append error image
    //this.$el.after().append('<span class="indicator_h invalid"></span>');
  },
  
  	getData: function(value, callback) {
		var _self = this;
		if(this.source_collection) {
			if(this.collectionFetchOb) {
				try { _self.$el.autocomplete("destroy"); } catch(ex) {   }
				 this.collectionFetchOb.abort();
			}
			this.collection = new this.source_collection();
			_self.$el.addClass('ui-autocomplete-loading');
			
			// set the payload
			if(this.request_fields) {
				for(var i in this.request_fields) {
					this.collection[this.request_fields[i].key] = (this.request_fields[i].value && typeof this.request_fields[i].value == "function")?this.request_fields[i].value(this):this.request_fields[i].value;
				}
			}
			
			if(!_self.$el.parent().find(".indicator-h").length) {
				_self.$el.after('<span class="indicator-h field-error-img"></span>');
			}

			_self.$el.parent().find(".indicator-h").removeClass("valid").addClass("invalid");
			if(_self.afterSetValue && _.isFunction(_self.afterSetValue)) _self.afterSetValue("hide");
			this.collectionFetchOb = this.collection.fetch();
			
			$.when(_self.collection.request).done(function() {
				if(_self.request_finished) _self.request_finished();				
				if (callback) callback(_self.collection.toJSON());
				_self.$el.removeClass('ui-autocomplete-loading');
			});
		}
	},
	
	// checkForData: function(loadNewRecords) {
		// var _self = this;
		// _self.getData('', function(data) {
			// _self.data.records = data;
			// if (!_self.selectedValue) {
				// if (_self.data.records && _self.data.records.length)
					// var val = _self.data.records[0].payload[_self.data.recordId];
					// // for multiple push into array
					// if (_self.multiple) {
						// _self.selectedValue = [];
						// _self.selectedValue.push(val);
					// } else {
						// _self.selectedValue = val;
					// }
				// // show selected value
				// _self.showDefaultValueSelected();	
			// }
			// _self.render();
		// });
	// },
  
  
    /**
   * Returns the current editor value
   * @return {String}
   */
  getValue: function() {
  	return this.$el.attr("data-id");
  },

  /**
   * Sets the value of the form element
   * @param {String}
   */
  setValue: function(value, text) {

	  if(!this.$el.parent().find(".indicator-h").length) this.$el.after('<span class="indicator-h field-error-img"></span>');
		//if(!this.$el.parent().find(".clearvalue-h").length) this.$el.after('<span class="clearvalue-h">clear</span>');

	    if(!value && value == "")
	        this.$el.parent().find(".indicator-h").removeClass("valid").addClass("invalid");
		else
	        this.$el.parent().find(".indicator-h").removeClass("invalid").addClass("valid");

	    this.$el.attr("data-id", value);
	    this.$el.val(text);

	    if(this.afterSetValue && _.isFunction(this.afterSetValue)) this.afterSetValue("show");

  },

  focus: function() {
    if (this.hasFocus) return;
    this.$el.focus();
  },

  blur: function() {
    if (!this.hasFocus) return;
    this.$el.blur();
  },

  select: function() {
    this.$el.select();
  }

});


/**
 * Drop Down editor
 */
Form.editors.DropDown = Form.editors.Text.extend({
  tagName: 'div',
  determineChange: function(event) {
    var _self = this, currentValue = this.$el.val();
  },
  
  template: '<div class="dropdown-container">\
		<input type="hidden" class="hidden-input-dropdown-h" value="" />\
		<div class="drop-down-outer">\
			<div class="region-dark dropdown-header-box">\
				<%=dropView.title%>\
			</div>\
			<div class="down-arrow-outer">\
				<a href="javascript: void(0);" class="down-arrow up-down-arrow-h">\
					<span class="icon-white icon-chevron-down"></span>\
				</a></div>\
		<div class="common-container">\
			<ul class="common-dropdown">\
				<% if(records) { var len = records.length; for(var i = 0; i < len; i++) { %>\
				<li class="<%=(records[i].payload[recordId] == selectedValue)?"selected":""%>">\
					<a data-id="<%=records[i].payload[recordId]%>" href="javascript: void(0);"><%=records[i].payload[recordValue]%></a>\
				</li>\
				<% } } %>\
			</ul>\
		</div>\
	</div>',
  
    // for multiple values selection this should be true else false 
  	multiple : false,
		// stack to store all selected options
	selectedOptions : [],
	
	// dropdown outer class
	className: 'dropdown-wrapper',

	/*Bind Events on controls present in current view template*/
	events : {
		"click .up-down-arrow-h" : "showDropdown",
		"click li a" : "selectOptions"
	},

	// set selected options  from dropdown
	selectOptions : function(e) {
		var val = $(e.target).data("id");
		if (this.multiple) {
			this.setMultipleOptions(val, e);
			this.setValue(this.selectedOptions.join(", "));
		} else {
			this.setSingleOption(val, e);
			this.setValue(val);
		}
		
		this.showSelectedValue();
		if (this.callback)
			this.callback(this.selectedOptions);
			
		this.trigger("blur", this);
			
	},
	
	showSelectedValue: function() {
		// show vaue selected
		var html = this.$el.find('.common-dropdown li.selected').text() || this.title;
		this.$el.find('.dropdown-header-box').html(html);
	},

	// set multipe dropdown options
	setMultipleOptions : function(val, e) {
		var index = this.checkifExists(val);
		if (index == -1) {
			$(e.target).parent().addClass('selected');
			this.selectedOptions.push(val);
		} else {
			$(e.target).parent().removeClass('selected');
			this.selectedOptions.splice(index, 1);
		}
	},

	// to set single select dropdown
	setSingleOption : function(val, e) {
		var index = this.checkifExists(val);
		if (index == -1) {
			this.selectedOptions = [];
			this.$el.find(".common-dropdown li").removeClass('selected');
			$(e.target).parent().addClass('selected');
			this.selectedOptions.push(val);
			this.$el.find(".hidden-input-dropdown-h").val(val);
			this.hideDropdown();
		}
	},

	// return index if record found in selected index
	checkifExists : function(val) {
		var index = -1;
		for (var i in this.selectedOptions) {
			if (this.selectedOptions[i] == val) {
				index = i;
				break;
			}
		}
		return index;
	},

	/*initialize gets called by default when constructor is initialized*/
	initialize : function(options) {
		Form.editors.Base.prototype.initialize.call(this, options);
		var _self = this;
		_self.selectedOptions = [];
		_self.setOptions(options.schema.form_values);
		
		// If records are defined if not check for getData function if it's defined then call that and wait for array on objects
		_self.checkForData();
		_self.$el.find(".hidden-input-dropdown-h").attr("id", _self.elementId);
	},
	
	getData: function(value, callback) {
		var _self = this;
		if(this.source_collection) {
			this.collection = new this.source_collection();
			
			// set the payload
			if(this.request_fields) {
				for(var i in this.request_fields) {
					this.collection[this.request_fields[i].key] = (this.request_fields[i].value && typeof this.request_fields[i].value == "function")?this.request_fields[i].value():this.request_fields[i].value;
				}
			}
			
			this.collection.fetch();

			this.collection.processResult = function() {
				console.log("COLLECTION: ",_self.collection);
				var data = _self.collection.ParseForDropdown();
				if(_self.request_finished) _self.request_finished();				
				if(callback) callback(data);
			};
		}
	},
	
	checkForData: function(loadNewRecords) {
		var _self = this;
		if(_self.data.records && !loadNewRecords)
			_self.render();
		else {
			_self.getData('', function(data) {
				_self.data.records = data;
				if (!_self.selectedValue) {
					if (_self.data.records && _self.data.records.length)
						var val = _self.data.records[0].payload[_self.data.recordId];
						// for multiple push into array
						if (_self.multiple) {
							_self.selectedValue = [];
							_self.selectedValue.push(val);
						} else {
							_self.selectedValue = val;
						}
					// show selected value
					_self.showDefaultValueSelected();	
				}
				_self.render();
			});
		}
	},

	// hide dropdown
	hideDropdown : function(e) {
		if (!e || !this.$el.find($(e.target)).parents(".dropdown-container").length) {
			this.$el.find(".dropdown-container").removeClass('increase-dropown-zindex');
			this.$el.find(".up-down-arrow-h span").removeClass('icon-chevron-up').addClass('icon-chevron-down');
			this.$el.find(".common-dropdown").slideUp();
		}
	},

	// toggle dropdown
	showDropdown : function(e) {
		e.preventDefault();
		var self = this;
		if ($(e.currentTarget).find("span").hasClass('icon-chevron-down')) {
			$(e.currentTarget).find("span").removeClass('icon-chevron-down').addClass('icon-chevron-up');
			$(".dropdown-container").removeClass('increase-dropown-zindex');
			self.$el.find(".dropdown-container").addClass('increase-dropown-zindex');
			$("html").bind('click', function(e) {
				self.hideDropdown(e);
			});
		} else {
			self.$el.find(".dropdown-container").removeClass('increase-dropown-zindex');
			$(e.currentTarget).find("span").removeClass('icon-chevron-up').addClass('icon-chevron-down');
		}
		$(e.currentTarget).parents('.dropdown-container').find('.common-dropdown').slideToggle();
	},

	// set default values selected
	defaultSelected : function(val) {
		if (_self.multiple) {
			if (_self.selectedValue && _.isArray(_self.selectedValue)) {
				for (var i in _self.selectedValue) {
					if (_self.selectedValue[i] == this.payload[_self.data.recordId]) {
						return "selected";
					}
				}
			}
		} else {
			if (_self.selectedValue && _self.selectedValue == this.payload[_self.data.recordId])
				return "selected";
		}
	},

	//render displays the view in browser
	render : function() {
		var self = this;
		this.data.dropView = self;
		this.selectedValue = this.data.selectedValue;
		this.selectedOptions = [];
		if (typeof this.selectedValue == "undefined" || !this.selectedValue) {
			if (this.data.records && this.data.records.length)
				var val = this.data.records[0].payload[this.data.recordId];
				// for multiple push into array
				if (this.multiple) {
					this.selectedValue = [];
					this.selectedValue.push(val);
				} else {
					this.selectedValue = val;
				}
			}
			
		// compile temoplate
		var self = this, markup = _.template(this.template, this.data);//Mustache.to_html(self.template, this.data);
		this.$el.html(markup);
		// set input value
		this.setValue(this.data.selectedValue);
		
		// set selected option in selected array
		this.selectedOptions.push(this.selectedValue);
		
		// show selected value
		this.showSelectedValue();
		
		if ($("#" + this.elementId).length) {
			// call callback if exists and pass the selected array Keys
			if (self.callback) self.callback(this.selectedOptions);
		} else {
			// if there is no selected value passed then select the first record by default
			setTimeout(function() {
				self.showDefaultValueSelected();
				if (self.callback) self.callback(self.selectedOptions);
			}, 200);
		}
		return this;
	},
	
	showDefaultValueSelected: function() {
		var self = this;
		if(!self.$el.find('li.selected').length) {
			var $li = self.$el.find('.common-dropdown li:first-child');
			$li.addClass('selected');
		} else {
			var $li = self.$el.find('li.selected');
		}
		var id = $li.find('a').data("id");
		if(id) {
			self.$el.find('.hidden-input-dropdown-h').val($li.find('a').data("id"));
			self.showSelectedValue();
		}
	},

	// **Method** `setOptions` - called by BaseView's initialize method
	setOptions : function(options) {
		for (var i in options) {
			this[i] = options[i];
		}
	},
  
	/**
   * Returns the current editor value
   * @return {String}
   */
  
  getValue: function() {
    return this.$el.find(".hidden-input-dropdown-h").val();
  },

  /**
   * Sets the value of the form element
   * @param {String}
   */
  setValue: function(value) {
  	this.$el.find(".common-dropdown li").removeClass("selected");
  	this.$el.find(".common-dropdown a[data-id="+value+"]").parent("li").addClass("selected");
  	var selectedVal = this.$el.find(".common-dropdown li.selected a").data("id");
  	
  	if( selectedVal && selectedVal != "" ) { 
  		this.$el.find(".hidden-input-dropdown-h").val(selectedVal);
  	} else {
  		this.$el.find(".common-dropdown li:first-child").addClass("selected");
  		this.$el.find(".hidden-input-dropdown-h").val(this.$el.find(".common-dropdown li.selected a").data("id"));
  	}
    this.showSelectedValue();
  },

  select: function() {
    this.$el.select();
  }

});


/**
 * TextArea editor
 */
Form.editors.TextArea = Form.editors.Text.extend({

  tagName: 'textarea',

  /**
   * Override Text constructor so type property isn't set (issue #261)
   */
  initialize: function(options) {
    Form.editors.Base.prototype.initialize.call(this, options);
  }

});

/**
 * Password editor
 */
Form.editors.Password = Form.editors.Text.extend({

  initialize: function(options) {
    Form.editors.Text.prototype.initialize.call(this, options);

    this.$el.attr('type', 'password');
  }

});

/**
 * NUMBER
 * 
 * Normal text input that only allows a number. Letters etc. are not entered.
 */
Form.editors.Number = Form.editors.Text.extend({

  defaultValue: 0,

  events: _.extend({}, Form.editors.Text.prototype.events, {
    'keypress': 'onKeyPress',
    'change': 'onKeyPress'
  }),

  initialize: function(options) {
    Form.editors.Text.prototype.initialize.call(this, options);

    var schema = this.schema;

    this.$el.attr('type', 'number');

    if (!schema || !schema.editorAttrs || !schema.editorAttrs.step) {
      // provide a default for `step` attr,
      // but don't overwrite if already specified
      this.$el.attr('step', 'any');
    }
  },

  /**
   * Check value is numeric
   */
  onKeyPress: function(event) {
    var self = this,
        delayedDetermineChange = function() {
          setTimeout(function() {
            self.determineChange();
          }, 0);
        };

    //Allow backspace
    if (event.charCode === 0) {
      delayedDetermineChange();
      return;
    }

    //Get the whole new value so that we can prevent things like double decimals points etc.
    var newVal = this.$el.val();
    if( event.charCode != undefined ) {
      newVal = newVal + String.fromCharCode(event.charCode);
    }

    var numeric = /^[0-9]*\.?[0-9]*?$/.test(newVal);

    if (numeric) {
      delayedDetermineChange();
    }
    else {
      event.preventDefault();
    }
  },

  getValue: function() {
    var value = this.$el.val();

    return value === "" ? null : parseFloat(value, 10);
  },

  setValue: function(value) {
    value = (function() {
      if (_.isNumber(value)) return value;

      if (_.isString(value) && value !== '') return parseFloat(value, 10);

      return null;
    })();

    if (_.isNaN(value)) value = null;

    Form.editors.Text.prototype.setValue.call(this, value);
  }
});

/**
 * Submit editor
 */
Form.editors.Submit = Form.editors.Text.extend({
  tag: 'input',
  defaultValue: 'Create',
  className: "submit-btn",
  events: {
  	"click" : "submitHandler"
  },
  
  submitHandler: function(e) {
  	e.preventDefault();
  	if(this.onSubmit) this.onSubmit(e);
  },
  
  initialize: function(options) {
  	if(options.schema && options.schema.attr && options.schema.attr.value) {
    	this.defaultValue = options.schema.attr.value;
    }
    
    if(options.schema && options.schema.onSubmit) {
    	this.onSubmit = options.schema.onSubmit;
    }
    
    Form.editors.Text.prototype.initialize.call(this, options);
    this.$el.attr('type', 'submit');
    this.$el.attr('value', 'Create');
    //this.setAllAttr(options.schema.attr);
  }
  
  //setAllAttr: function(options) {
  //	for(var i in options) {
  //		this.$el.attr(i, options[i]);
  //	}
  //}
});

/**
 * Submit editor
 */
Form.editors.Button = Form.editors.Text.extend({
  tag: 'input',
  defaultValue: '',
  className: "submit-btn",
 events: {
  	"click" : "submitHandler"
  },
  initialize: function(options) {
  		if(options.schema && options.schema.attr && options.schema.attr.value) {
    	this.defaultValue = options.schema.attr.value;
    }
    if(options.schema && options.schema.onClick) {
    	this.onClick = options.schema.onClick;
    }
    
    Form.editors.Text.prototype.initialize.call(this, options);
    this.$el.attr('type', 'button');
    this.$el.attr('value', 'Cancel');
    
    this.setAllAttr(this.schema.attr);
  },
  
   submitHandler: function(e) {
  	e.preventDefault();
  	if(this.onClick) this.onClick(e);
  },
  
  setAllAttr: function(options) {
  	for(var i in options) {
  		this.$el.attr(i, options[i]);
  	}
  }
});


/**
 * Hidden editor
 */
Form.editors.Hidden = Form.editors.Text.extend({

  defaultValue: '',
  initialize: function(options) {
    Form.editors.Text.prototype.initialize.call(this, options);
    this.$el.attr('type', 'hidden');
    if(this.value) this.$el.attr('value', this.value);
    this.setOptions(options.schema.options);
  },
  
  setOptions : function(options) {
	for (var i in options) {
		this[i] = options[i];
	}
  },

  focus: function() {

  },

  blur: function() {

  }

});

/**
 * Checkbox editor
 *
 * Creates a single checkbox, i.e. boolean value
 */
Form.editors.Checkbox = Form.editors.Base.extend({

  defaultValue: false,

  tagName: 'input',

  events: {
    'click':  function(event) {
      this.trigger('change', this);
    },
    'focus':  function(event) {
      this.trigger('focus', this);
    },
    'blur':   function(event) {
      this.trigger('blur', this);
    }
  },

  initialize: function(options) {
    Form.editors.Base.prototype.initialize.call(this, options);

    this.$el.attr('type', 'checkbox');
  },

  /**
   * Adds the editor to the DOM
   */
  render: function() {
    this.setValue(this.value);

    return this;
  },

  getValue: function() {
    return this.$el.prop('checked');
  },

  setValue: function(value) {
    if (value) {
      this.$el.prop('checked', true);
    }else{
      this.$el.prop('checked', false);
    }
  },

  focus: function() {
    if (this.hasFocus) return;

    this.$el.focus();
  },

  blur: function() {
    if (!this.hasFocus) return;

    this.$el.blur();
  }

});

/**
 * Select editor
 *
 * Renders a <select> with given options
 *
 * Requires an 'options' value on the schema.
 *  Can be an array of options, a function that calls back with the array of options, a string of HTML
 *  or a Backbone collection. If a collection, the models must implement a toString() method
 */
Form.editors.Select = Form.editors.Base.extend({

  tagName: 'select',

  events: {
    'change': function(event) {
      this.trigger('change', this);
    },
    'focus':  function(event) {
      this.trigger('focus', this);
    },
    'blur':   function(event) {
      this.trigger('blur', this);
    }
  },

  initialize: function(options) {
    Form.editors.Base.prototype.initialize.call(this, options);
    if (!this.schema || !this.schema.options) throw "Missing required 'schema.options'";
  },

  render: function() {
    this.setOptions(this.schema.options);
    return this;
  },

  /**
   * Sets the options that populate the <select>
   *
   * @param {Mixed} options
   */
  setOptions: function(options) {
    var self = this;

    //If a collection was passed, check if it needs fetching
    if (options instanceof Backbone.Collection) {
      var collection = options;

      //Don't do the fetch if it's already populated
      if (collection.length > 0) {
        this.renderOptions(options);
      } else {
        collection.fetch({
          success: function(collection) {
            self.renderOptions(options);
          }
        });
      }
    }

    //If a function was passed, run it to get the options
    else if (_.isFunction(options)) {
      options(function(result) {
        self.renderOptions(result);
      }, self);
    }

    //Otherwise, ready to go straight to renderOptions
    else {
      this.renderOptions(options);
    }
  },

  /**
   * Adds the <option> html to the DOM
   * @param {Mixed}   Options as a simple array e.g. ['option1', 'option2']
   *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
   *                      or as a string of <option> HTML to insert into the <select>
   *                      or any object
   */
  renderOptions: function(options) {
    var $select = this.$el,
        html;

    html = this._getOptionsHtml(options);

    //Insert options
    $select.html(html);

    //Select correct option
    this.setValue(this.value);
  },

  _getOptionsHtml: function(options) {
    var html;
    //Accept string of HTML
    if (_.isString(options)) {
      html = options;
    }

    //Or array
    else if (_.isArray(options)) {
      html = this._arrayToHtml(options);
    }

    //Or Backbone collection
    else if (options instanceof Backbone.Collection) {
      html = this._collectionToHtml(options);
    }

    else if (_.isFunction(options)) {
      var newOptions;

      options(function(opts) {
        newOptions = opts;
      }, this);

      html = this._getOptionsHtml(newOptions);
    //Or any object
    }else{
      html=this._objectToHtml(options);
    }

    return html;
  },


  getValue: function() {
    return this.$el.val();
  },

  setValue: function(value) {
    this.$el.val(value);
  },

  focus: function() {
    if (this.hasFocus) return;

    this.$el.focus();
  },

  blur: function() {
    if (!this.hasFocus) return;

    this.$el.blur();
  },

  /**
   * Transforms a collection into HTML ready to use in the renderOptions method
   * @param {Backbone.Collection}
   * @return {String}
   */
  _collectionToHtml: function(collection) {
    //Convert collection to array first
    var array = [];
    collection.each(function(model) {
      array.push({ val: model.id, label: model.toString() });
    });

    //Now convert to HTML
    var html = this._arrayToHtml(array);

    return html;
  },
  /**
   * Transforms an object into HTML ready to use in the renderOptions method
   * @param {Object}
   * @return {String}
   */
  _objectToHtml: function(obj) {
    //Convert object to array first
    var array = [];
    for(var key in obj){
      if( obj.hasOwnProperty( key ) ) {
        array.push({ val: key, label: obj[key] });
      }
    }

    //Now convert to HTML
    var html = this._arrayToHtml(array);

    return html;
  },



  /**
   * Create the <option> HTML
   * @param {Array}   Options as a simple array e.g. ['option1', 'option2']
   *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
   * @return {String} HTML
   */
  _arrayToHtml: function(array) {
    var html = [];

    //Generate HTML
    _.each(array, function(option) {
      if (_.isObject(option)) {
        if (option.group) {
          html.push('<optgroup label="'+option.group+'">');
          html.push(this._getOptionsHtml(option.options));
          html.push('</optgroup>');
        } else {
          var val = (option.val || option.val === 0) ? option.val : '';
          html.push('<option value="'+val+'">'+option.label+'</option>');
        }
      }
      else {
        html.push('<option>'+option+'</option>');
      }
    }, this);

    return html.join('');
  }

});

/**
 * Radio editor
 *
 * Renders a <ul> with given options represented as <li> objects containing radio buttons
 *
 * Requires an 'options' value on the schema.
 *  Can be an array of options, a function that calls back with the array of options, a string of HTML
 *  or a Backbone collection. If a collection, the models must implement a toString() method
 */
Form.editors.Radio = Form.editors.Select.extend({
  tagName: 'ul',
  events: {
    'change input[type=radio]': function() {
      this.trigger('change', this);
    },
    'click': 'clickHandler',    
    'focus input[type=radio]': function() {
      if (this.hasFocus) return;
      this.trigger('focus', this);
    },
    'blur input[type=radio]': function() {
      if (!this.hasFocus) return;
      var self = this;
      setTimeout(function() {
        if (self.$('input[type=radio]:focus')[0]) return;
        self.trigger('blur', self);
      }, 0);
    }
  },

  getValue: function() {
    return this.$('input[type=radio]:checked').val();
  },

  setValue: function(value) {
    this.$('input[type=radio]').val([value]);
  },

  focus: function() {
    if (this.hasFocus) return;
    var checked = this.$('input[type=radio]:checked');
    if (checked[0]) {
      checked.focus();
      return;
    }
    this.$('input[type=radio]').first().focus();
  },

  blur: function() {
    if (!this.hasFocus) return;
    this.$('input[type=radio]:focus').blur();
  },
  
  initialize: function(options) {
  	Form.editors.Base.prototype.initialize.call(this, options);
    if (!this.schema || !this.schema.options) throw "Missing required 'schema.options'";

  	this.clickHandler = (this.schema.onClickFn)?this.schema.onClickFn:function() {
  		//alert("click handler is not defined");
  	};
  	
  },

  /**
   * Create the radio list HTML
   * @param {Array}   Options as a simple array e.g. ['option1', 'option2']
   *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
   * @return {String} HTML
   */
  _arrayToHtml: function (array) {
    var html = [];
    var self = this;

    _.each(array, function(option, index) {
      var itemHtml = '<li>';
      if (_.isObject(option)) {
        var val = (option.val || option.val === 0) ? option.val : '';
        itemHtml += ('<input type="radio" name="'+self.getName()+'" value="'+val+'" id="'+self.id+'-'+index+'" />');
        itemHtml += ('<label for="'+self.id+'-'+index+'">'+option.label+'</label>');
      } else {
        itemHtml += ('<input type="radio" name="'+self.getName()+'" value="'+option+'" id="'+self.id+'-'+index+'" />');
        itemHtml += ('<label for="'+self.id+'-'+index+'">'+option+'</label>');
      }
      itemHtml += '</li>';
      html.push(itemHtml);
    });

    return html.join('');
  }

});

/**
 * Checkboxes editor
 *
 * Renders a <ul> with given options represented as <li> objects containing checkboxes
 *
 * Requires an 'options' value on the schema.
 *  Can be an array of options, a function that calls back with the array of options, a string of HTML
 *  or a Backbone collection. If a collection, the models must implement a toString() method
 */
Form.editors.Checkboxes = Form.editors.Select.extend({

  tagName: 'ul',

  groupNumber: 0,

  events: {
    'click input[type=checkbox]': function() {
      this.trigger('change', this);
    },
    'focus input[type=checkbox]': function() {
      if (this.hasFocus) return;
      this.trigger('focus', this);
    },
    'blur input[type=checkbox]':  function() {
      if (!this.hasFocus) return;
      var self = this;
      setTimeout(function() {
        if (self.$('input[type=checkbox]:focus')[0]) return;
        self.trigger('blur', self);
      }, 0);
    }
  },

  getValue: function() {
    var values = [];
    this.$('input[type=checkbox]:checked').each(function() {
      values.push($(this).val());
    });
    return values;
  },

  setValue: function(values) {
    if (!_.isArray(values)) values = [values];
    this.$('input[type=checkbox]').val(values);
  },

  focus: function() {
    if (this.hasFocus) return;

    this.$('input[type=checkbox]').first().focus();
  },

  blur: function() {
    if (!this.hasFocus) return;

    this.$('input[type=checkbox]:focus').blur();
  },

  /**
   * Create the checkbox list HTML
   * @param {Array}   Options as a simple array e.g. ['option1', 'option2']
   *                      or as an array of objects e.g. [{val: 543, label: 'Title for object 543'}]
   * @return {String} HTML
   */
  _arrayToHtml: function (array) {
    var html = [];
    var self = this;

    _.each(array, function(option, index) {
      var itemHtml = '<li>';
			var close = true;
      if (_.isObject(option)) {
        if (option.group) {
          var originalId = self.id;
          self.id += "-" + self.groupNumber++; 
          itemHtml = ('<fieldset class="group"> <legend>'+option.group+'</legend>');
          itemHtml += (self._arrayToHtml(option.options));
          itemHtml += ('</fieldset>');
          self.id = originalId;
					close = false;
        }else{
          var val = (option.val || option.val === 0) ? option.val : '';
          itemHtml += ('<input type="checkbox" name="'+self.getName()+'" value="'+val+'" id="'+self.id+'-'+index+'" />');
          itemHtml += ('<label for="'+self.id+'-'+index+'">'+option.label+'</label>');
        }
      }
      else {
        itemHtml += ('<input type="checkbox" name="'+self.getName()+'" value="'+option+'" id="'+self.id+'-'+index+'" />');
        itemHtml += ('<label for="'+self.id+'-'+index+'">'+option+'</label>');
      }
			if(close){
				itemHtml += '</li>';
			}
      html.push(itemHtml);
    });

    return html.join('');
  }

});

/**
 * Object editor
 *
 * Creates a child form. For editing Javascript objects
 *
 * @param {Object} options
 * @param {Form} options.form                 The form this editor belongs to; used to determine the constructor for the nested form
 * @param {Object} options.schema             The schema for the object
 * @param {Object} options.schema.subSchema   The schema for the nested form
 */
Form.editors.Object = Form.editors.Base.extend({
  //Prevent error classes being set on the main control; they are internally on the individual fields
  hasNestedForm: true,

  initialize: function(options) {
    //Set default value for the instance so it's not a shared object
    this.value = {};

    //Init
    Form.editors.Base.prototype.initialize.call(this, options);

    //Check required options
    if (!this.form) throw 'Missing required option "form"';
    if (!this.schema.subSchema) throw new Error("Missing required 'schema.subSchema' option for Object editor");
  },

  render: function() {
    //Get the constructor for creating the nested form; i.e. the same constructor as used by the parent form
    var NestedForm = this.form.constructor;

    //Create the nested form
    this.nestedForm = new NestedForm({
      schema: this.schema.subSchema,
      data: this.value,
      idPrefix: this.id + '_',
      Field: NestedForm.NestedField
    });

    this._observeFormEvents();
    this.$el.html(this.nestedForm.render().el);
    if (this.hasFocus) this.trigger('blur', this);
    return this;
  },

  getValue: function() {
    if (this.nestedForm) return this.nestedForm.getValue();
    return this.value;
  },

  setValue: function(value) {
    this.value = value;
    this.render();
  },

  focus: function() {
    if (this.hasFocus) return;
    this.nestedForm.focus();
  },

  blur: function() {
    if (!this.hasFocus) return;
    this.nestedForm.blur();
  },

  remove: function() {
    this.nestedForm.remove();
    Backbone.View.prototype.remove.call(this);
  },

  serverValidate: function(options) {
    return this.nestedForm.ShowValidateMessage(options);
  },
	

  validate: function() {
    return this.nestedForm.validate();
  },

  _observeFormEvents: function() {
    if (!this.nestedForm) return;
    
    this.nestedForm.on('all', function() {
      // args = ["key:change", form, fieldEditor]
      var args = _.toArray(arguments);
      args[1] = this;
      // args = ["key:change", this=objectEditor, fieldEditor]

      this.trigger.apply(this, args);
    }, this);
  }

});

/**
 * NestedModel editor
 *
 * Creates a child form. For editing nested Backbone models
 *
 * Special options:
 *   schema.model:   Embedded model constructor
 */
Form.editors.NestedModel = Form.editors.Object.extend({
  initialize: function(options) {
    Form.editors.Base.prototype.initialize.call(this, options);

    if (!this.form) throw 'Missing required option "form"';
    if (!options.schema.model) throw 'Missing required "schema.model" option for NestedModel editor';
  },

  render: function() {
    //Get the constructor for creating the nested form; i.e. the same constructor as used by the parent form
    var NestedForm = this.form.constructor;

    var data = this.value || {},
        key = this.key,
        nestedModel = this.schema.model;

    //Wrap the data in a model if it isn't already a model instance
    var modelInstance = (data.constructor === nestedModel) ? data : new nestedModel(data);

    this.nestedForm = new NestedForm({
      model: modelInstance,
      idPrefix: this.id + '_',
      fieldTemplate: 'nestedField'
    });

    this._observeFormEvents();

    //Render form
    this.$el.html(this.nestedForm.render().el);

    if (this.hasFocus) this.trigger('blur', this);

    return this;
  },

  /**
   * Update the embedded model, checking for nested validation errors and pass them up
   * Then update the main model if all OK
   *
   * @return {Error|null} Validation error or null
   */
  commit: function() {
    var error = this.nestedForm.commit();
    if (error) {
      this.$el.addClass('error');
      return error;
    }
    return Form.editors.Object.prototype.commit.call(this);
  }

});

/**
 * Date editor
 *
 * Schema options
 * @param {Number|String} [options.schema.yearStart]  First year in list. Default: 100 years ago
 * @param {Number|String} [options.schema.yearEnd]    Last year in list. Default: current year
 *
 * Config options (if not set, defaults to options stored on the main Date class)
 * @param {Boolean} [options.showMonthNames]  Use month names instead of numbers. Default: true
 * @param {String[]} [options.monthNames]     Month names. Default: Full English names
 */
Form.editors.Date = Form.editors.Base.extend({

  events: {
    'change select':  function() {
      this.updateHidden();
      this.trigger('change', this);
    },
    'focus select':   function() {
      if (this.hasFocus) return;
      this.trigger('focus', this);
    },
    'blur select':    function() {
      if (!this.hasFocus) return;
      var self = this;
      setTimeout(function() {
        if (self.$('select:focus')[0]) return;
        self.trigger('blur', self);
      }, 0);
    }
  },

  initialize: function(options) {
    options = options || {};

    Form.editors.Base.prototype.initialize.call(this, options);
    var Self = Form.editors.Date,
        today = new Date();

    //Option defaults
    this.options = _.extend({
      monthNames: Self.monthNames,
      showMonthNames: Self.showMonthNames
    }, options);

    //Schema defaults
    this.schema = _.extend({
      yearStart: today.getFullYear() - 100,
      yearEnd: today.getFullYear()
    }, options.schema || {});

    //Cast to Date
    if (this.value && !_.isDate(this.value)) {
      this.value = new Date(this.value);
    }

    //Set default date
    if (!this.value) {
      var date = new Date();
      date.setSeconds(0);
      date.setMilliseconds(0);
      this.value = date;
    }

    //Template
    this.template = options.template || this.constructor.template;
  },

  render: function() {
    var options = this.options,
        schema = this.schema;

    var datesOptions = _.map(_.range(1, 32), function(date) {
      return '<option value="'+date+'">' + date + '</option>';
    });

    var monthsOptions = _.map(_.range(0, 12), function(month) {
      var value = (options.showMonthNames)
          ? options.monthNames[month]
          : (month + 1);

      return '<option value="'+month+'">' + value + '</option>';
    });

    var yearRange = (schema.yearStart < schema.yearEnd)
      ? _.range(schema.yearStart, schema.yearEnd + 1)
      : _.range(schema.yearStart, schema.yearEnd - 1, -1);

    var yearsOptions = _.map(yearRange, function(year) {
      return '<option value="'+year+'">' + year + '</option>';
    });

    //Render the selects
    var $el = $($.trim(this.template({
      dates: datesOptions.join(''),
      months: monthsOptions.join(''),
      years: yearsOptions.join('')
    })));

    //Store references to selects
    this.$date = $el.find('[data-type="date"]');
    this.$month = $el.find('[data-type="month"]');
    this.$year = $el.find('[data-type="year"]');

    //Create the hidden field to store values in case POSTed to server
    this.$hidden = $('<input type="hidden" name="'+this.key+'" />');
    $el.append(this.$hidden);

    //Set value on this and hidden field
    this.setValue(this.value);

    //Remove the wrapper tag
    this.setElement($el);
    this.$el.attr('id', this.id);
    this.$el.attr('name', this.getName());

    if (this.hasFocus) this.trigger('blur', this);

    return this;
  },

  /**
   * @return {Date}   Selected date
   */
  getValue: function() {
    var year = this.$year.val(),
        month = this.$month.val(),
        date = this.$date.val();

    if (!year || !month || !date) return null;

    return new Date(year, month, date);
  },

  /**
   * @param {Date} date
   */
  setValue: function(date) {
    this.$date.val(date.getDate());
    this.$month.val(date.getMonth());
    this.$year.val(date.getFullYear());
    this.updateHidden();
  },

  focus: function() {
    if (this.hasFocus) return;

    this.$('select').first().focus();
  },

  blur: function() {
    if (!this.hasFocus) return;

    this.$('select:focus').blur();
  },

  /**
   * Update the hidden input which is maintained for when submitting a form
   * via a normal browser POST
   */
  updateHidden: function() {
    var val = this.getValue();

    if (_.isDate(val)) val = val.toISOString();

    this.$hidden.val(val);
  }

}, {
  //STATICS
  template: _.template('\
    <div>\
      <select data-type="date"><%= dates %></select>\
      <select data-type="month"><%= months %></select>\
      <select data-type="year"><%= years %></select>\
    </div>\
  ', null, Form.templateSettings),

  //Whether to show month names instead of numbers
  showMonthNames: true,

  //Month names to use if showMonthNames is true
  //Replace for localisation, e.g. Form.editors.Date.monthNames = ['Janvier', 'Fevrier'...]
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
});

/**
 * DateTime editor
 *
 * @param {Editor} [options.DateEditor]           Date editor view to use (not definition)
 * @param {Number} [options.schema.minsInterval]  Interval between minutes. Default: 15
 */
Form.editors.DateTime = Form.editors.Base.extend({

  events: {
    'change select':  function() {
      this.updateHidden();
      this.trigger('change', this);
    },
    'focus select':   function() {
      if (this.hasFocus) return;
      this.trigger('focus', this);
    },
    'blur select':    function() {
      if (!this.hasFocus) return;
      var self = this;
      setTimeout(function() {
        if (self.$('select:focus')[0]) return;
        self.trigger('blur', self);
      }, 0);
    }
  },

  initialize: function(options) {
    options = options || {};

    Form.editors.Base.prototype.initialize.call(this, options);

    //Option defaults
    this.options = _.extend({
      DateEditor: Form.editors.DateTime.DateEditor
    }, options);

    //Schema defaults
    this.schema = _.extend({
      minsInterval: 15
    }, options.schema || {});

    //Create embedded date editor
    this.dateEditor = new this.options.DateEditor(options);

    this.value = this.dateEditor.value;

    //Template
    this.template = options.template || this.constructor.template;
  },

  render: function() {
    function pad(n) {
      return n < 10 ? '0' + n : n;
    }

    var schema = this.schema;

    //Create options
    var hoursOptions = _.map(_.range(0, 24), function(hour) {
      return '<option value="'+hour+'">' + pad(hour) + '</option>';
    });

    var minsOptions = _.map(_.range(0, 60, schema.minsInterval), function(min) {
      return '<option value="'+min+'">' + pad(min) + '</option>';
    });

    //Render time selects
    var $el = $($.trim(this.template({
      hours: hoursOptions.join(),
      mins: minsOptions.join()
    })));

    //Include the date editor
    $el.find('[data-date]').append(this.dateEditor.render().el);

    //Store references to selects
    this.$hour = $el.find('select[data-type="hour"]');
    this.$min = $el.find('select[data-type="min"]');

    //Get the hidden date field to store values in case POSTed to server
    this.$hidden = $el.find('input[type="hidden"]');

    //Set time
    this.setValue(this.value);

    this.setElement($el);
    this.$el.attr('id', this.id);
    this.$el.attr('name', this.getName());

    if (this.hasFocus) this.trigger('blur', this);

    return this;
  },

  /**
   * @return {Date}   Selected datetime
   */
  getValue: function() {
    var date = this.dateEditor.getValue();

    var hour = this.$hour.val(),
        min = this.$min.val();

    if (!date || !hour || !min) return null;

    date.setHours(hour);
    date.setMinutes(min);

    return date;
  },

  /**
   * @param {Date}
   */
  setValue: function(date) {
    if (!_.isDate(date)) date = new Date(date);

    this.dateEditor.setValue(date);

    this.$hour.val(date.getHours());
    this.$min.val(date.getMinutes());

    this.updateHidden();
  },

  focus: function() {
    if (this.hasFocus) return;

    this.$('select').first().focus();
  },

  blur: function() {
    if (!this.hasFocus) return;

    this.$('select:focus').blur();
  },

  /**
   * Update the hidden input which is maintained for when submitting a form
   * via a normal browser POST
   */
  updateHidden: function() {
    var val = this.getValue();
    if (_.isDate(val)) val = val.toISOString();

    this.$hidden.val(val);
  },

  /**
   * Remove the Date editor before removing self
   */
  remove: function() {
    this.dateEditor.remove();

    Form.editors.Base.prototype.remove.call(this);
  }

}, {
  //STATICS
  template: _.template('\
    <div class="bbf-datetime">\
      <div class="bbf-date-container" data-date></div>\
      <select data-type="hour"><%= hours %></select>\
      :\
      <select data-type="min"><%= mins %></select>\
    </div>\
  ', null, Form.templateSettings),

  //The date editor to use (constructor function, not instance)
  DateEditor: Form.editors.Date
});



  //Metadata
  Form.VERSION = '0.12.0';


  //Exports
  Backbone.Form = Form;
  if (typeof exports !== 'undefined') exports = Form;

})(window || global || this);

