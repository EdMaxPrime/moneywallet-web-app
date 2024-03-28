const m = require("mithril")

const Util = require("../models/index.js")


/**
 * Attributes: "direction" and ("t" or ("money" and "currencyId"))
 * direction = 0 for income styling, 1 for expense styling
 * money = a positive integer (not premultiplied by the currency's decimal)
 * currencyId = a string id of the currency this amount is in
 * t = a Transaction model object
 * 
 * Example: 
 * 		<MoneyAmount direction={1} t={transaction} />
 * 		<MoneyAmount direction={1} money={100} currencyId={stringId} />
 */
module.exports = {
	view: function(vnode) {
		return m("span", 
			{
				className: vnode.attrs.direction == 1? "red-text text-darken-1" : "cyan-text text-darken-4",
			},
			("t" in vnode.attrs)? Util.formatTransactionAmount(vnode.attrs.t) : Util.formatMoneyAmount(vnode.attrs.money, vnode.attrs.currencyId)
		);
	}
};