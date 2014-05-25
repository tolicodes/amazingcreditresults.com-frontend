// tradeline.js
// --------------
// Requires define
// Return Backbone RelationalModel {Object}

define([
	"baseCollection",
	"core/components/messaging/models/messages"
	], function(
	BaseCollection,
	messagingModel
) {

	return BaseCollection.extend({
		model: messagingModel
	});
});
