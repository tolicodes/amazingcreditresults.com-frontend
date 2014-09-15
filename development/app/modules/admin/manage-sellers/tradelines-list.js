define([
	'core/data-table/data-table',
	'numeral',
	'common/formatters',
	'core/data-table/action-buttons-cell',
	'../manage-tradelines/tradeline-model',
	'../manage-tradelines/tradeline-modal',
	'../manage-products/product-list-view',
	'backgrid-select2-cell'
], function(
	DataTable,
	numeral,
	formatters,
	ActionButtonsCell,
	TradelineModel,
	TradeLineModalView,
	ProductListView
) {
	return DataTable.extend({
		topButtons: {
			'new': {
				title: 'New Tradeline',
				extraClasses: 'btn-success',
				icon: 'glyphicon glyphicon glyphicon-plus-sign',
				onClick: 'newTradeline'
			}
		},

		newTradeline: function(){
			var modal = this.addView(new TradeLineModalView({
				model: new TradelineModel({
					seller: this.parentView.model.get('id')
				})
			}), '.new-tradeline');

			modal.show();
		},

		columns: [
			{
				name: 'price',
				label: 'Price To Buyer',
				cell: 'string',
				formatter: formatters.CurrencyFormatter
			}, {
				name: 'cost',
				label: 'Paid To Seller',
				cell: 'string',
				formatter: formatters.CurrencyFormatter
			}, {
				name: 'product',
				label: 'Lender',
				cell: 'string',
				editable: false,
				formatter: {
					fromRaw: function(product) {
						return product &&
							product.bank + ' ' + product.name + ' ' + product.type;
					}
				}
			}, {
				name: 'creditLimit',
				label: 'Limit',
				cell: 'string',
				formatter: formatters.CurrencyFormatter
			}, {
				name: 'balance',
				label: 'Balance',
				cell: 'string',
				formatter: formatters.CurrencyFormatter
			}, {
				name: 'statementDate',
				label: 'Statement Day',
				cell: 'string',
				formatter: {
					fromRaw: function(val) {
						return numeral(val).format('0o');
					},
					toRaw: function(val) {
						return parseInt(val);
					}
				}
			}, {
				name: 'dateOpen',
				label: 'Date Open',
				cell: 'string',
				formatter: {
					fromRaw: function(val) {
						return moment(val).format('MM/DD/YY');
					},
					toRaw: function(val) {
						return moment(val).toISOString();
					}
				}
			}, {
				name: 'dateOpen',
				label: 'Line Age',
				cell: 'string',
				editable: false,
				formatter: {
					fromRaw: function(dateOpen) {
						var difference = moment().diff(moment(dateOpen), 'months', true),
							years = parseInt(difference / 12),
							months = parseInt(difference % 12);

						if (!years && !months || (years < 0 || months < 0)) {
							return '0 mo';
						}

						return (years ? years + ' yr ' : '') +
							(months ? months + ' mo' : '');
					}
				}
			}, {
				name: 'currentAus',
				label: 'AUs Available',
				cell: 'string',
				editable: false,
				formatter: {
					fromRaw: function(val, model) {
						return model.get('totalAus') - model.get('currentAus');
					}
				}
			}, {
				name: 'currentAus',
				label: 'Current AUs',
				cell: 'string'
			}, {
				name: 'totalAus',
				label: 'Max AUs',
				cell: 'string'
			}, {
				name: 'product.reportsTo',
				label: 'Reports To',
				cell: 'string',
				editable: false,
				cell: 'string',
				formatter: {
					fromRaw: function(val){
						return val ? val.join(', ') : '';
					}
				}
			}, {
				sortable: false,
				editable: false,
				label: "Actions",
				cell: ActionButtonsCell.extend({
					resourceName: 'tradeline'
				})
			}
		]
	})
})