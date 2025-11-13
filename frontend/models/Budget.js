const pb = require("../api")
const dayjs = require("../dayjs-lib")

/**
 * Utility class to manage budgets that are related. Outside users can only
 * create it with Budget.reset().
 * You must provide a MoneyFormatter function because we can't import it from
 * the main module because of circular imports.
 */
const ComplexBudget = function() {
	this.id = "";
	this.money = 0;
	this.moneyText = "";
	this.start_date = null;
	this.end_date = null;
	this.wallet_ids = [];
	this.wallets = [];
	this.currencyId = null;
	// function to produce human-readable money. By default, assume hundredths
	this.moneyFormatter = (money, currencyId, numberOnly) => (money / 100).toFixed(2);
	this.children = [];

	/**
	 * Determine whether a currency constraint exists for the parent budget.
	 * This will affect the wallets that can be chosen.
	 * @return true if a currency is chosen, false if not
	 */
	this.currencyIsChosen = function() {
		return this.currencyId != null;
	}

	/**
	 * Sets the wallets to be used by the budget.
	 * @param wallets  an array of Wallet objects
	 */
	this.setWallets = function(wallets) {
		if(wallets.length == 0) {
			this.currencyId = null;
		} else {
			this.currencyId = wallets[0]["currency"];
		}
		this.wallets = wallets;
		this.wallet_ids = wallets.map(wallet => wallet.id);
	}

	/**
	 * This budget is in a consistent valid state if the wallets all use one
	 * currency. If they use different currencies, then it is an invalid state
	 * @return boolean true if valid, false if not
	 */
	this.walletsAreConsistent = function() {
		for(let wallet of this.wallets) {
			if(wallet["currency"] != this.currencyId) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Adds a category budget to the list. If the category was added previously
	 * then it won't be added a second time, nor will it be updated.
	 * 
	 * @param categoryId  string id of the category, should be unique
	 * @param moneyText  the text the user entered in the form, for convenience
	 * @param money  integer amount of the budget
	 * 
	 * @return boolean true if the budget was added succesfully, false otherwise
	 */
	this.addCategory = function(categoryId, moneyText, money) {
		// check if already present
		if(this.children.some(childBudget => childBudget.categoryId == categoryId)) {
			return false;
		}
		this.children.push({
			budgetId: null,
			saved: false,
			categoryId: categoryId,
			moneyText: moneyText,
			money: money,
			percent: this.money != 0? (money / this.money) : 0,
		});
		return true;
	}

	this.setCategoryMoney = function(categoryId, moneyText, money) {
		for(const childBudget of this.children) {
			if(childBudget.categoryId == categoryId) {
				childBudget.moneyText = moneyText;
				childBudget.money = money;
				childBudget.percent = this.money != 0? (100 * money / this.money) : 0;
				break;
			}
		}
	}

	this.setCategoryPercent = function(categoryId, percent) {
		for(const childBudget of this.children) {
			if(childBudget.categoryId == categoryId) {
				childBudget.percent = percent;
				childBudget.money = (percent / 100) * this.money;
				childBudget.moneyText = this.moneyFormatter(childBudget.money, this.currencyId, true); //(childBudget.money / 100).toFixed(2); //potentially problematic for currencies that don't have 2 decimal places, but we don't have access to formatting functions
				break;
			}
		}
	}

	/**
	 * If the total budget amount has changed, this will synchronize the child
	 * category budgets. The money amount will be recalculated based on the
	 * percent.
	 */
	this.updateBudgetMoneyKeepPercent = function() {
		for(const childBudget of this.children) {
			childBudget.money = (childBudget.percent / 100) * this.money;
			childBudget.moneyText = this.moneyFormatter(childBudget.money, this.currencyId, true);
		}
	}

	/**
	 * If the total budget amount has changed, this will synchronize the child
	 * category budgets. The percent will be recalculated based on the money
	 * amount.
	 */
	this.updateBudgetPercentKeepMoney = function() {
		for(const childBudget of this.children) {
			childBudget.percent = this.money != 0? (100 * childBudget.money / this.money) : 0;
		}
	}

	/**
	 * Calculates the money that was allocated among the categories. This may
	 * be less than the grand total.
	 * @return integer money amount
	 */
	this.getMoneyAllocated = function() {
		return this.children.reduce((sum, current) => sum + current.money, 0);
	}

	/**
	 * Calculates the percent of the grand total that has been allocated.
	 * @return floating point number between 0 and 1 (100%)
	 */
	this.getPercentAllocated = function() {
		return this.money > 0? (this.getMoneyAllocated() / this.money) : 0;
	}

	/**
	 * This budget is overallocated if the sum of the category budgets exceeds
	 * the total money limit.
	 * @return  true if over budget
	 */
	this.overallocated = function() {
		return this.getMoneyAllocated() > this.money;
	}

	/**
	 * Save all category budgets associated with this. It also saves an expense
	 * budget with the grand total amount.
	 * 
	 * @return Promise that resolves when the API call completes. The error
	 * may be a string, or it may be an object.
	 */
	this.save = function() {
		return new Promise((function(resolve, reject) {
			// first, validate
			let errors = "";
			if(!this.currencyIsChosen()) {
				errors += " Please choose at least one wallet to track. ";
			}
			if(!this.walletsAreConsistent()) {
				errors += " Some of the wallets you have chosen to track use different currencies - please choose wallets that share a currency. ";
			}
			if(this.start_date == null || this.end_date == null) {
				errors += " Missing a date range. ";
			}
			if(this.money == 0) {
				errors += " Please enter a total budget. ";
			} else if(this.money < 0) {
				errors += " Please enter a total budget greater than 0. ";
			}
			else if(this.overallocated()) {
				errors += " You have budgeted more in your categories than your total budget allows for - decrease your category budgets, or, increase the total budget. ";
			}

			if(errors != "") {
				reject(errors);
				return;
			}

			// create a mini budget for each category
			const budgets = this.children.map(childBudget => ({
				user_owner: pb.authStore.model.id,
				start_date: this.start_date,
				end_date: this.end_date,
				currency: this.currencyId,
				wallets: this.wallet_ids,
				type: Budget.TYPE_CATEGORY,
				category: childBudget.categoryId,
				money: childBudget.money,
				tag: "",
				data_source: ""
			}));
			// add an "all expenses" budget to cover the grand total
			budgets.push({
				user_owner: pb.authStore.model.id,
				start_date: this.start_date,
				end_date: this.end_date,
				currency: this.currencyId,
				wallets: this.wallet_ids,
				type: Budget.TYPE_EXPENSE,
				category: "",
				money: this.money,
				tag: "",
				data_source: ""
			});
			resolve(Promise.allSettled(budgets.map(budgetModel => pb.collection("budgets").create(budgetModel))));
		}).bind(this)); // "this" must be bound at definition, otherwise will use different value when called
	}

}

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

	/** The current budget being edited */
	current: new ComplexBudget(),

	/**
	 * Used to create a new budget to edit.
	 */
	reset: function() {
		Budget.current = new ComplexBudget();
	}
};

module.exports = Budget;