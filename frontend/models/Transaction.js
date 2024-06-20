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