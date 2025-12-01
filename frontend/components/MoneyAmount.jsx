const m = require("mithril")

const Util = require("../models/index.js")


/**
 * Attributes: "direction" and ("t" or ("money" and "currencyId"))
 * @attribute direction = 0 for income styling, 1 for expense styling
 * 
 * @attribute money = a positive integer (not premultiplied by the currency's decimal)
 * @attribute currencyId = a string id of the currency this amount is in
 * 
 * @attribute t = a Transaction model object
 * 
 * @attribute color (optional, default true) true to add color styling
 * based on the direction, false to leave black
 * 
 * Example: 
 * 		<MoneyAmount direction={1} t={transaction} />
 * 		<MoneyAmount direction={1} money={100} currencyId={stringId} />
 */
module.exports = {
	view: function(vnode) {
		let text;
		try {
			text = ("t" in vnode.attrs)? Util.formatTransactionAmount(vnode.attrs.t) : Util.formatMoneyAmount(vnode.attrs.money, vnode.attrs.currencyId);
		} catch(e) {
			text = "?"; //default
		}
		const color = !("color" in vnode.attrs && vnode.attrs.color === false);

		return m("span", 
			{
				className: color? (vnode.attrs.direction == 0? "red-text text-darken-1" : "cyan-text text-darken-4") : null,
			},
			text
		);
	}
};