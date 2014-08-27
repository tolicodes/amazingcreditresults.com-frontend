define([
	'core/mvc/list',
	'./messages-collection',
	'./message-view'
], function(
	list,
	messagesCollection,
	messageView
){
	return list.extend({
		options: {
			hideTimeout: 3000
		},

		className: 'message-area',

		itemView: messageView,

		appendTo: 'body',
		
		hooks: {
			'initialize:before': ['setupCollection'],
			'M:server:error': 'serverError',
			'M:server:rawError': 'rawServerError',
			'M:server:message': 'serverMessage',
			'M:message': 'message'
		},

		setupCollection: function(){
			this.collection = new messagesCollection();
		},

		serverMessage: function(message) {
			this.collection.add({
				type: 'info',
				message: message
			});
		},

		message: function(message, type){
			this.collection.add({
				type: type,
				message: message
			})
		},

		serverError: function(errors, code){
			errors = _(errors).isArray(errors) ? errors : [errors];

			_(errors).each(function(error){
				error.code = code;
				error.type = 'error';
			});

			this.collection.add(errors);
		},

		serverRawError: function(error, code){
			this.collection.add({
				preFormat: true,
				type: 'error',
				message: error,
				code: code
			});
		}
	});
});