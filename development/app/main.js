require([
	'backbone',

	'core/app/app',
	
	'./router',
	'core/messages/messages',
	'core/auth/auth',
	'core/sessionKey/sessionKey',
	'core/inactivityTimer/inactivityTimer',
	'core/mediator/mediator',

	'common/models/user',

	'core/mixin/mixin',

	"css!libs/bootstrap/dist/css/bootstrap"
], function(
	Backbone,
	App,
	
	Router,
	Messages,
	Auth,
	SessionKey,
	InactivityTimer,
	Mediator,

	UserModel
) {
	_(App).extend({
		Router: new Router,
		Messages: new Messages,
		Auth: new Auth({
			UserModel: UserModel
		}),
		SessionKey: new SessionKey,
		InactivityTimer: new InactivityTimer({
			startTrigger: [Mediator, 'auth:success'],
			stopTrigger: [Mediator, 'logout']
		})
	});

	Backbone.history.start();
});