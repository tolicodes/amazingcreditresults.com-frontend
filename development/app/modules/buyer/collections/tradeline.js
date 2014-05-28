// tradeline.js
// --------------
// Requires define
// Return Backbone RelationalModel {Object}

define([
	"relationalModel",
	"buyer/models/tradeline"
	], function(
	RelationalModel,
	tradelineModel
) {

	return RelationalModel.extend({
		model: tradelineModel,
		url: function() {
			return this.getUrl("tradeline");
		},
		
		parse: function(result) {
			return result.data;
		}

	});
});
