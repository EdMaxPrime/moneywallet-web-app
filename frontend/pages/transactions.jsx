const m = require("mithril")
const TransactionList = require("../components/TransactionList")
const TransactionListPageable = require("../components/TransactionListPageable")
const TransactionSearch = require("../components/TransactionSearch")

const Transaction = require("../models/Transaction")


// module.exports = {
// 	oninit: function() {
// 		Promise.all([
// 			Transaction.loadList()
// 			]).then(m.redraw)
// 		.catch(reason => console.log("Promise failed ", reason));
// 	},
// 	view: function() {
// 		return (
// 				<TransactionList transactions={Transaction.list} />
// 			);
// 	}
// }

const searchEventListener = function(search) {
	m.route.set("/transactions/search", {searchTerm: search});
}

module.exports = {
	view: function() {
		return (<div>
			<TransactionSearch onSearch={searchEventListener} />
			<TransactionListPageable 
				arg={{sort: '-date'}} 
				fetch={Transaction.loadSome}
				showTotal={true} />
			</div>);
	}
}