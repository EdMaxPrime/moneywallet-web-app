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