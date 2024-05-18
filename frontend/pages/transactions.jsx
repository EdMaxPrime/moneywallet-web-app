const m = require("mithril")
const TransactionList = require("../components/TransactionList")

const Transaction = require("../models/Transaction")


module.exports = {
	oninit: function() {
		Promise.all([
			Transaction.loadList()
			]).then(m.redraw)
		.catch(reason => console.log("Promise failed ", reason));
	},
	view: function() {
		return (
				<TransactionList transactions={Transaction.list} />
			);
	}
}