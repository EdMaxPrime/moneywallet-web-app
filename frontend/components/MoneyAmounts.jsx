const m = require("mithril")
const MoneyAmount = require("./MoneyAmount.jsx")

/**
 * Displays a line of text showing money in various currencies. If there is no
 * money, then a - dash is shown. If there is more than one currency, then each
 * is shown in the order provided and with a dash in between. The color of
 * money depends on MoneyAmount.
 * 
 * Provide one of the following attributes
 * 
 * Attributes:
 * @attribute list  expects an array of objects with these properties: money
 * and currencyId
 * @attribute map  expects an object where the keys are currency ID strings
 * and values are money amounts as integers
 */
module.exports = {
	view: function(vnode) {
		let amounts = [];
		// convert attribute (list or map) into component list
		if(vnode.attrs.list) {
			amounts = vnode.attrs.list.map(
				({currencyId, money}) => m(MoneyAmount, {
					key: currencyId, 
					currencyId: currencyId, 
					money: Math.abs(money), 
					direction: money > 0
				}));
		}
		else if(vnode.attrs.map) {
			for(const currencyId in vnode.attrs.map) {
				amounts.push(m(MoneyAmount, {
					key: currencyId,
					currencyId: currencyId, 
					money: Math.abs(vnode.attrs.map[currencyId]),
					direction: vnode.attrs.map[currencyId] > 0
				}))
			}
		}

		// add separators between different currencies
		for(let i = 1; i < amounts.length; i += 2) {
			amounts.splice(i, 0, m("span", {key: i}, " - "))
		}

		// display dash if there is no money, less confusing than empty space
		if(amounts.length == 0) return m("span", "-");
		else return amounts;
	}
}