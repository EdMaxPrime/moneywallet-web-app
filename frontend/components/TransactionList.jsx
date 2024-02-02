const m = require("mithril")
const TransactionItem = require("../components/TransactionItem")

//const data = [{desc: "first"}, {desc: "second"}, {desc: "third"}];

module.exports = {
	view: function(vnode) {
		// first, group the transactions by time period
		const timePeriod = "monthly";
		
		// finally, render the transactions
		const data = vnode.attrs.transactions;
		console.log("transaction list with " + data.length + " transactions");
		return (
			<ul class="collection with-header">
				<li class="collection-header"><h6>Sun Dec 4, 2023</h6></li>
				{data.map(t => <TransactionItem key={t["id"]} t={t}/>)}
				<li class="collection-header"><h6>Sat Dec 10, 2023</h6></li>
				{data.map(t => <TransactionItem t={t}/>)}
			</ul>);
	}
}