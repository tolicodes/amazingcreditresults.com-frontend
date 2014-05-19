// info.js
// --------------
// Requires define
// Return Backbone Model {Object}

define(["relationalModel"], function(RelationalModel) {

	return RelationalModel.extend({
		relations : [
		// {
			// type : Backbone.HasMany,
			// key : 'transaction',
			// relatedModel : 'transaction',
			// reverseRelation : {
				// key : 'userId',
				// includeInJSON : 'id'
			// }
		// },
		{
			type : Backbone.HasMany,
			key : 'tradeline',
			relatedModel : 'tradeline',
			reverseRelation : {
				key : 'userId',
				includeInJSON : true
			}
		}]
		
		// users : [{
			// "id" : 1,
			// "name" : "Anatoliy",
			// "type" : "seller",
			// "tradeLines" : [{
				// "id" : 1233,
				// "productId" : 2,
				// "creditLimit" : 30000,
				// "auSlotsTotal" : 15,
				// "auSlotsAvailable" : 10
			// }]
		// }, {
			// "id" : 2,
			// "name" : "John",
			// "type" : "buyer",
			// "tradeLinesBought" : [{
				// "dateBought" : 012301293,
				// "tradeLineId" : 1233,
				// "rentedForTime" : 01233,
				// "expiration" : 01231231,
				// "amountPaid" : 300
			// }]
		// }],
		
		
		
	});
});
