define([
	"backbone",
	"core/app/app",
	"core/hooks/hooks"
], function(
	Backbone,
	App,
	hooks
) {

	var Router = Backbone.Router.extend({
		routes: {
			/**
			 * 404 Page
			 */
			"*splat": "routeNotFound"
		},

		initialize: function() {
			_(this.pages).each(function(pages, layout) {
				_(pages).each(function(pageView, route) {
					var optsArray = route.match(/(\(\?)?(:\w+)/g);

					//strip #
					optsArray = _.map(optsArray, function(opt) {
						return opt.substr(1);
					});

					this._addRoute(route, layout, pageView, optsArray);
				}, this);
			}, this);
		},

		needsAuthentication: function(layout) {
			return !this.layouts[layout].prototype.noAuthentication;
		},

		_addRoute: function(route, layout, pageView, optsArray) {
			var args = _.argsToArray(arguments);

			this.route(route, function() {
				args.push(_.argsToArray(arguments));

				this.Mediator.trigger.apply(
					this.Mediator, 
					['router:route:before'].concat(args)
				);

				if (!this.needsAuthentication(layout)) {
					this._routePage.apply(this, args);
				} else {
					App.Auth.isAuthenticated().then(function(){
						this._routePage.apply(this, args);
					}.bind(this));
				}
			});
		},

		_routePage: function(route, layout, pageView, optsArray, params) {
			if (this.currentLayout !== layout) {
				if (this._currentLayout) {
					this._currentLayout.close();
				}

				this.currentLayout = layout;
				this._currentLayout = new this.layouts[layout];
			}

			var $mainEl = this._currentLayout.$mainEl;
			var opts = {};

			_.each(params, function(arg, i) {
				if (!optsArray[i]) {
					return;
				}
				opts[optsArray[i]] = arg;
			});

			this._currentLayout.addView(
				new pageView(opts),
				$mainEl
			);

			var args = _.argsToArray(arguments);

			this.Mediator.trigger.apply(
				this.Mediator, 
				['router:route:after'].concat(args)
			);
		}
	});

	return hooks.mixInto(Router);
});