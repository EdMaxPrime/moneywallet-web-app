const m = require("mithril")
const Layout = require("../layouts/Layout")
const TransactionList = require("../components/TransactionList")

const Category = require("../models/Category")
const Currency = require("../models/Currency")
const Transaction = require("../models/Transaction")
const Wallet = require("../models/Wallet")


module.exports = {
	oninit: function() {
		Promise.all([
			Category.loadList(),
			Currency.loadList(),
			Transaction.loadList(),
			Wallet.loadList()
			]).then(m.redraw)
		.catch(reason => console.log("Promise failed ", reason));
	},
	view: function() {
		return (
			<Layout title="Transactions">
				<TransactionList transactions={Transaction.list} />
			</Layout>);
	}
}