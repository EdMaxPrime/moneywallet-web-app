const Category = require("./Category.js")
const Currency = require("./Currency.js")
const Transaction = require("./Transaction.js")
const Wallet = require("./Wallet.js")

module.exports = {
	getCategoryOfTransaction: function(transaction) {
		return Category.getById(transaction["category"]);
	},

	formatTransactionAmount: function(transaction) {
		const currency = Currency.getById(Wallet.getById(transaction["wallet"])["currency"]);
		console.log("format transaction ", transaction);
		console.log("format currency ", currency);
		const amount = transaction["money"].toString();
		return currency["symbol"] + 
			amount.substring(0, amount.length - currency["decimals"]) + 
			"." +
			amount.substring(amount.length - currency["decimals"]);
	},
};