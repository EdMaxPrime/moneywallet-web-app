const m = require("mithril")
const BudgetSummary = require("../components/BudgetSummary.jsx")

module.exports = function() {
	return {
		view: function() {
			return m("div", [
				m(BudgetSummary, {id: 1, used: 1090, money: 1400, currency: "lv25l90oi4x8sz3", name: "Food and Drinks", end_date: "2024-12-31"}),
				m(BudgetSummary, {id: 2, used: 1090, money: 1000, currency: "lv25l90oi4x8sz3", name: "Public Transit", end_date: "2024-12-31"})
			]);
		}
	};
}