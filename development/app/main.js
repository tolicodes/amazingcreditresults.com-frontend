require([
	'core/app/app',
	'backbone',
	'router',
	'core/messages/messages',
	'core/auth/auth',

	'common/models/user',

	'core/mixin/mixin',

	"css!libs/bootstrap/dist/css/bootstrap"
], function(
	App,
	Backbone,
	Router,
	Messages,
	Auth,

	UserModel
) {
	_(App).extend({
		Router: new Router,
		Messages: new Messages,
		Auth: new Auth({
			UserModel: UserModel
		})
	});

	Backbone.history.start();
});