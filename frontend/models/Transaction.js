const pb = require("../api")

var Transaction = {
	list: [],
	current: {},

	DIRECTION_EXPENSE: false,
	DIRECTION_INCOME: true,

	loadList: function() {
		return pb.collection("transactions").getFullList().then(response => {
			console.log("loaded full transaction list length="+response.length);
			Transaction.list = response;
			return response;
		})
	},

	/**
	 * Retrieves some transaction records. The response is not cached, so the
	 * caller should have their own caching strategy.
	 * @param page  the results are paginated, and this is the 1-based page number
	 * @param perPage  the number of items per page. Result may have fewer
	 * @param options  and object with filter, sort, expand, and fields. Consult
	 * the PocketBase API documentation for details
	 * @return a Promise that resolves to a JSON object. On success, it will
	 * have these fields:
	 *   totalItems: the total number of items, even beyond this page
	 *   totalPages: the total number of pages
	 *   page: the current page number
	 *   items: a list of Transaction records
	 */
	loadSome: function(page, perPage, options) {
		return pb.collection("transactions").getList(page, perPage, options)
	},

	/**
	 * Asynchronous load transactions from the API. Only fetches transactions
	 * which meet the filter's criteria. They are not cached.
	 * 
	 * @param filter  an object with these optional properties: 
	 * startDate: string YYYY-MM-DD, 
	 * endDate: string YYYY-MM-DD,
	 * wallets: string id of the wallet
	 * @return Promise that resolves to a list of Transaction objects
	 */
	getWithFilter: function(filter) {
		let conditions = [];
		if(filter.startDate) conditions.push("date >= {:startDate}");
		if(filter.endDate) conditions.push("date <= {:endDate}");
		if(filter.wallets) conditions.push("wallet = {:wallets}");
		if(typeof filter.category == "string") conditions.push("category = {:category}");
		if(filter.event) conditions.push("event = {:event}");
		if(filter.confirmed === true || filter.confirmed === false) conditions.push("confirmed = {:confirmed}");

		return pb.collection("transactions").getFullList({
			filter: pb.filter(
				conditions.join(" && "),
				filter)
		});
	},

	/**
	 * Helper function to add lists
	 */
	append: function(transaction_list) {
		Transaction.list = Transaction.list.concat(transaction_list);
	},

	create: function() {
		return pb.collection("transactions").create(Transaction.current);
	},
};

module.exports = Transaction;