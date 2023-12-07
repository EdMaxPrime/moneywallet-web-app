const m = require("mithril")
const Layout = require("../layouts/Layout")
const TransactionItem = require("../components/TransactionItem")

const data = [{desc: "first"}, {desc: "second"}, {desc: "third"}];

module.exports = {
	view: function() {
		return (
			<Layout title="Transactions">
				<ul class="collection with-header">
					<li class="collection-header"><h6>Sun Dec 4, 2023</h6></li>
					{data.map(t => <TransactionItem t={t}/>)}
					<li class="collection-header"><h6>Sat Dec 10, 2023</h6></li>
					{data.map(t => <TransactionItem t={t}/>)}
				</ul>
			</Layout>);
	}
}