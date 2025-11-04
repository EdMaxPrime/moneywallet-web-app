// Mithril Component imports
const m = require("mithril")
const BudgetSummary = require("../components/BudgetSummary.jsx")
const {Tabs} = require("mithril-materialized")

// Pocketbase API imports
const Budget = require("../models/Budget")
const Util = require("../models/index")


/** Names for status constants for AJAX request */
const WAITING = 2,
READY = 3,
ERROR = 4;


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
				// show list of active running budgets
				return m(Tabs, {
					tabs: [
						{
							title: "Running",
							vnode: m("div", {}, Budget.running.map(budget => {
								return m(BudgetSummary, {
									key: budget.budget_id, 
									budget: budget, 
									name: Util.budgetName(budget),
								})
							}))
						},
						{
							title: "Expired",
							vnode: m("div", {}, Budget.expired.map(budget => {
								return m(BudgetSummary, {
									key: budget.budget_id, 
									budget: budget, 
									name: Util.budgetName(budget),
								})
							}))
						}
					]
				});
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