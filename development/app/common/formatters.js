define([

], function(

){
	return {
		CurrencyFormatter: {
			toRaw: function(val){
				return numeral().unformat(val);
			},
			fromRaw: function(val){
				return numeral(val).format('$0,0');
			}
		}
	};
})