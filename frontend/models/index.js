const pb = require("../api.js")
const Budget = require("./Budget.js")
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

	parentEntitiesLoaded: false,
	loadParentEntities: function() {
		let callback = (function(data) {
			this.parentEntitiesLoaded = true;

			Category.loadListHelper(data.expand.categories_via_user_owner);
			// get list of currencies, without duplicates (unique id), from child entity of wallet ("expand")
			const currencyIds = {};
			const currencies = [];
			data.expand.wallets_via_user_owner.forEach(wallet => {
				if(!currencyIds.hasOwnProperty(wallet.expand.currency.id)) {
					currencies.push(wallet.expand.currency);
					currencyIds[wallet.expand.currency.id] = true;
				}
			}); 
			Currency.loadListHelper(currencies);
			Wallet.loadListHelper(data.expand.wallets_via_user_owner);

			return data;
		}).bind(this);

		if(this.parentEntitiesLoaded) {
			return Promise.resolve(true); // if we already loaded the data, then immediately return an auto-resolving Promise
		}

		return pb.collection("users").getOne(pb.authStore.model.id, {
			expand: "wallets_via_user_owner.currency,categories_via_user_owner",
		}).then(callback)
		.catch(function(error) {
			console.log("Load parent entities", error);
			return error;
		})
	},

	/**
	 * Creates a name for a budget depending on its category. If the type is expense
	 * or income, then that will be the name. If it is a budget for a category, then
	 * the name comes from the category. NOTE: Categories must be loaded.
	 * @param budget  a budget object with type and category properties. 
	 * OR just the ID.
	 * @return  string name
	 */
	budgetName: function(budget) {
		if (typeof budget == "string") { // convert id to budget object
			budget = Budget.getById(budget);
		}
		switch(parseInt(budget.type)) {
		case Budget.TYPE_INCOME:
			return "Income";
			break;
		case Budget.TYPE_CATEGORY:
			if (budget.hasOwnProperty("category_name")) {
				return budget["category_name"];
			} else {
				return Category.getById(budget.category).name;
			}
			break;
		default:
			return "Expense";
			break;
		}
	},

};