({
	formatCurrency : function (number) {
		if (isNaN(number)) {
			number = 0.00;
		}
		number = number.toFixed(2);
		var str = number.toString().split('.');
		if (str[0].length >= 4) {
			str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
		}
		return str.join('.');
	}
})