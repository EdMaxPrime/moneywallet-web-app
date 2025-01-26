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

	/**
	 * Fetch all budgets with a few extra fields: progress (how much was consumed),
	 * category, category_name, category_type, category_icon.
	 * This returns a promise that is handled internally. When it resolves, the
	 * budgets can be accessed in "running" and "expired" arrays. If it rejects,
	 * the data will be an empty array.
	 * @return Promise
	 */
	loadList: function() {
		return pb.collection("budgets_progress").getFullList({
			sort: '-start_date,tag'
		}).then(Budget.loadListHelper);
	},

	loadListHelper: function(budgetsList) {
		Budget.running = [];
		Budget.expired = [];
		Budget.byId = {};

		for(let i = 0; i < budgetsList.length; i++) {
			Budget.byId[budgetsList[i].id] = budgetsList[i];
			if(dayjs(budgetsList[i].end_date).isBefore(dayjs())) {
				Budget.expired.push(budgetsList[i]);
			} else {
				Budget.running.push(budgetsList[i]);
			}
		}
	},

	getById: function(id) {
		return Budget.byId[id];
	},

	getTransactions: function(budget) {
		if (budget == null || !budget) {
			return [];
		}
		// create filter for dates, and wallets; user handled by API rules
		const walletJoinExpression = budget.wallets.map(wallet => "'" + wallet + "' = wallet").join(" || ");
		const commonFilter = "date >= {:start_date} && date <= {:end_date} (" + walletJoinExpression + ") ";
		// add category/direction to filter and send API
		if (budget.type != Budget.TYPE_CATEGORY) {
			return pb.collection("transactions").getFullList({
				filter: pb.filter(commonFilter + " && direction = {:type}", budget),
				sort: '-date',
			});
		}
		else {
			return pb.collection("transactions").getFullList({
				filter: pb.filter(commonFilter + " && category = {:category}", budget),
				sort: '-date',
			});
		}
	},
};

module.exports = Budget;