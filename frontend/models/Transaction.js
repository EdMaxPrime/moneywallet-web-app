const pb = require("../api")

var Transaction = {
	list: [],
	current: {},

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
	 * Retrieves transactions that belong to a set of categories
	 * @param categories a list of strings, each is a category id
	 */
	getByCategory: function(categories) {
		return pb.collection("transactions").getList(1, 30, {
			filter: categories.map(category => "category = \"" + category + "\"").join(" || ")
		}).then(response => {
			return response.items;
		})
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