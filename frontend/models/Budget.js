const pb = require("../api")
const dayjs = require("../dayjs-lib")

/**
 * A Budget has the following properties:
 * 	- start_date: String YYYY-MM-DD
 * 	- end_date: String YYYY-MM-DD
 * 	- currency: the currency of this budget and its wallets
 * 	- wallets: list of 1 or more wallets
 * 	- type: Integer which transactions to track. Either expenses (0), income (1), category (2)
 * 	- category: the category if type=2, otherwise null
 * 	- money: Integer the maximum limit
 */

var Budget = {

	TYPE_INCOME: 0,
	TYPE_EXPENSE: 1,
	TYPE_CATEGORY: 2,

	loadList: function() {
		return pb.collection("budgets").getFullList({
			sort: '-start_date,tag'
		}).then(Budget.loadListHelper);
	},

	loadListHelper: function(budgetsList) {
		Budget.running = [];
		Budget.expired = [];

		for(let i = 0; i < budgetsList.length; i++) {
			if(dayjs(budgetsList[i].end_date).isBefore(dayjs())) {
				Budget.expired.push(budgetsList[i]);
			} else {
				Budget.running.push(budgetsList[i]);
			}
		}
	},
};

module.exports = Budget;