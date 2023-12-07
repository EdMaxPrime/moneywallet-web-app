const pb = require("../api")

var Currency = {
	list: [],
	loadList: function() {
		return pb.collection('currencies').getFullList({
			sort: 'iso'
		}).then(function (response) {
			console.log("currency response");
			console.log(response);
			Currency.list = response;
		}).catch(function (error) {
			console.log("currency error");
			console.log(error);
		})
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