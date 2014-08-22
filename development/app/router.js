define([
	"backbone",
	"common/layouts/login",
	"modules/admin/login/loginView",
	"core/app/app",

	"less!common/css/style"
], function(
	Backbone,
	loginLayout,
	adminLoginView,
	App
) {

	return Backbone.Router.extend({
		routes: {
			// 404 Page
			"*splat": "routeNotFound",

			"not-authed": "notAuthorized"
		},

		pages: {
			admin: {

			},
			buyer: {

			},
			login: {
				'admin/login': adminLoginView
			}
		},

		layouts: {
			login: loginLayout
		},

		initialize: function() {
			_(this.pages).each(function(pages, layout) {
				_(pages).each(function(pageView, route) {
					var optsArray = route.match(/(\(\?)?:\w+/g);

					//strip #
					optsArray = _.map(optsArray, function(opt) {
						return opt.substr(1);
					});

					this._addRoute(route, layout, pageView, optsArray);
				}, this);
			}, this);
		},

		notAuthorized: function() {
			alert('Not authorized!!!');
		},

		needsAuth: function(layout) {
			return !this.layouts[layout].prototype.noAuth;
		},

		_addRoute: function(route, layout, pageView, optsArray) {
			var args = arguments;

			this.route(route, function() {
				var $el;

				if (!this.needsAuth(layout)) {
					this._routePage.apply(this, args);
				} else {
					App.Auth.isAuthed().then(function(){
						this._routePage.apply(this, args);
					});
				}
			});
		},

		_routePage: function(route, layout, pageView, optsArray) {
			if (this.currentLayout === layout) {
				$el = this._currentLayout.$mainEl;
			} else {
				if (this._currentLayout) {
					this._currentLayout.close();
				}

				this._currentLayout = new this.layouts[layout];
			}

			var opts = {};

			_.each(arguments, function(arg, i) {
				if (!optsArray[i]) {
					return;
				}
				opts[optsArray[i]] = arg;
			});

			this._currentLayout.addView(
				'.main',
				new pageView(opts)
			);
		}
	});
});