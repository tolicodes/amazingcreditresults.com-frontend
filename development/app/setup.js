// application.js

require([
	'backbone', 
	'underscore', 
	'jquery', 
	'application',
	'Mediator',
	'currentUser',
	// bootstrap css file
	"css!libs/bootstrap/dist/css/bootstrap"
	], function(
	Backbone, 
	_,
	$, 
	application,
	mediator,
	CurrentUser
	) {
	$(document).ready(function() {
		App = {};
		// create Mediatior object for messaging
		App.Mediator = new mediator;		
		App.CurrentUser = new CurrentUser();
		App.routing = new application();
		Backbone.history.start({});
	});
});
