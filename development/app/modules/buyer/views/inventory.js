// info.js
// --------------
// Requires define
// Return Backbone View {Object}


define([
	"base",
	"buyer/models/product",
	"buyer/models/tradeline",
	"buyer/models/transaction",
	"buyer/models/users"
], function(
	Base,
	productModel,
	tradelineModel,
	transactionModel,
	usersModel	
) {

	return Base.extend({

		// columns:  [{
				// name : "Bar",
				// editable : false,
				// cell : Backgrid.IntegerCell.extend({
					// orderSeparator : ''
				// })
			// }, {
				// name : "Product Name",
				// cell : "string"
			// }, {
				// name : "Statement",
				// cell : "integer"
			// }, {
				// name : "Date",
				// cell : "number"
			// }, {
				// name : "Payment",
				// cell : "date"
			// }, {
				// name : "Current",
				// cell : "uri"
			// }],
// 			
// 			
			/*, {
				name : "Max",
				cell : "uri"
			}, {
				name : "Credit",
				cell : "uri"
			}, {
				name : "Cash",
				cell : "uri"
			}, {
				name : "Balance",
				cell : "uri"
			}, {
				name : "Ratings",
				cell : "uri"
			}, {
				name : "Report",
				cell : "uri"
			}, {
				name : "Cc",
				cell : "uri"
			}*/
			
		url: "http://backbone-paginator.github.io/backbone-pageable/examples/json/pageable-territories.json",
		
		
		initializeBefore : function(options) {
			/*	productModel,
	tradelineModel,
	transactionModel,
	usersModel	
*/

		var product = new productModel();
		product.set({ products : [{
			"id" : 1,
			"name" : "Chase Freedom"
		}, {
			"id" : 2,
			"name" : "Chase Ink"
		}]});
		
		var tradeline = new tradelineModel();
		
		//var transaction = new transactionModel();
		
		var users = new usersModel({species: 'Test', 'userId': tradeline});
		
		users.set({ users : [{
			"id" : 1,
			"name" : "Anatoliy",
			"type" : "seller",
			"tradeLines" : [{
				"id" : 1233,
				"productId" : 2,
				"creditLimit" : 30000,
				"auSlotsTotal" : 15,
				"auSlotsAvailable" : 10
			}]
		}, {
			"id" : 2,
			"name" : "John",
			"type" : "buyer",
			"tradeLinesBought" : [{
				"dateBought" : 012301293,
				"tradeLineId" : 1233,
				"rentedForTime" : 01233,
				"expiration" : 01231231,
				"amountPaid" : 300
			}]
		}],});
		
		alert( users.get( 'tradeline' ).pluck( 'species' ) );
		//console.log()

		}
	});
});