const pb = require("../api")

var Currency = {
	list: [],
	byId: {},
	loadList: function() {
		return pb.collection('currencies').getFullList({
			sort: 'iso'
		}).then(Currency.loadListHelper)
		.catch(function (error) {
			console.log("currency error");
			console.log(error);
		})
	},

	loadListHelper: function (currencies_list) {
		Currency.list = currencies_list;
		currencies_list.forEach(currency => {
			Currency.byId[ currency["id"] ] = currency;
		});
		return currencies_list;
	},

	/**
	 * Given a string Id, get the currency with this id, or undefined if
	 * it doesn't exist.
	 */
	getById: function(id) {
		return Currency.byId[id];
	},

	/**
	 * Find a currency by the 3 letter ISO name, returns null if it doesn't exist
	 */
	getByISO: function(iso) {
		const currencies = Currency.list.filter(currency => currency["iso"] == iso);
		return currencies.length > 0 ? currencies[0] : null;
	},

	current: {
		iso: "",
		name: "",
		symbol: "",
		decimals: 2,
		icon: {
			type: "color",
			color: "#000000",
			name: "?"
		}
	},
}

module.exports = Currency;