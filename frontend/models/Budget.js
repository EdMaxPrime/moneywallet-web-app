const pb = require("../api")

/**
 * A Budget has the following properties:
 * 	- startDate: String YYYY-MM-DD
 * 	- endDate: String YYYY-MM-DD
 * 	- currency: the currency of this budget and its wallets
 * 	- wallets: list of 1 or more wallets
 * 	- type: Integer which transactions to track. Either expenses (0), income (1), category (2)
 * 	- category: the category if type=2, otherwise null
 * 	- money: Integer the maximum limit
 */

var Budget = {
	
};

module.exports = Budget;