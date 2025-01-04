const m = require("mithril")
const BudgetSummary = require("../components/BudgetSummary.jsx")

const Budget = require("../models/Budget")
const Category = require("../models/Category")


/** Names for status constants for AJAX request */
const WAITING = 2,
READY = 3,
ERROR = 4;

/**
 * Creates a name for a budget depending on its category. If the type is expense
 * or income, then that will be the name. If it is a budget for a category, then
 * the name comes from the category.
 * @param budget  a budget object with type and category properties.
 * @return  string name
 */
const budgetName = function(budget) {
	switch(budget.type) {
	case Budget.TYPE_INCOME:
		return "Income";
		break;
	case Budget.TYPE_CATEGORY:
		return Category.getById(budget.category).name;
		break;
	default:
		return "Expense";
		break;
	}
}

module.exports = function() {
	let status = WAITING;

	return {
		oninit: function() {
			Budget.loadList().then(function(result) {
				status = READY;
			})
			.catch(function(error) {
				status = ERROR;
			})
			.finally(m.redraw);
		},
		view: function() {
			if (status == READY) {
				return m("div", {}, Budget.running.map(budget => {
					return m(BudgetSummary, {
						key: budget.id, 
						budget: Object.assign(budget, {used: 100}), 
						name: budgetName(budget),
					});
				}));
			}
			else if (status == WAITING) {
				return m("div", "Loading...");
			}
			else {
				return m("div", "Error");
			}
		}
	};
}