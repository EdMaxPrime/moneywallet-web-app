const Category = require("./Category.js")
const Currency = require("./Currency.js")
const Transaction = require("./Transaction.js")
const Wallet = require("./Wallet.js")

module.exports = {
	getCategoryOfTransaction: function(transaction) {
		return Category.getById(transaction["category"]);
	},

	/**
	 * Gets the currency used by a transaction. Precondition: the transaction's
	 * wallet and currency must be loaded.
	 * @param transaction  a transaction with a wallet id
	 * @return  a currency object
	 */
	getCurrencyOfTransaction: function(transaction) {
		return Currency.getById(Wallet.getById(transaction["wallet"])["currency"]);
	},

	/**
	 * Formats a money amount as human-readable. Precondition: the currency must
	 * be loaded.
	 * @param money  a positive integer, not premultiplied by the currency's 
	 * cents/dollars system
	 * @param currencyId  the string id of the currency, or the Currency object
	 * @return  string
	 */
	formatMoneyAmount: function(money, currencyId) {
		const currency = typeof currencyId == "string" ? Currency.getById(currencyId) : currencyId;
		let amount = (typeof money == "number")? money.toString() : money;
		amount = amount.padStart(currency["decimals"] + 1, "0"); // pad with leading zeroes
		return currency["symbol"] + 
			amount.substring(0, amount.length - currency["decimals"]) + 
			"." +
			amount.substring(amount.length - currency["decimals"]);
	},

	/**
	 * Formats a money amount depending on the currency. For example, an input 
	 * of {money: 100,  currency: USD} becomes "$1.00"
	 */
	formatTransactionAmount: function(transaction) {
		return this.formatMoneyAmount(transaction["money"], Wallet.getById(transaction["wallet"])["currency"]);
	},

};