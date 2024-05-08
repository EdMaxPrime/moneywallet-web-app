const m = require("mithril");
const TransactionList = require("./TransactionList")


const WAITING_FIRST = 1, // waiting for initial data to load
WAITING = 2, 
READY = 3, // data is loaded
ERROR = 4; // there was an error fetching data

module.exports = function() {
	let currentPage = 1;
	let numberOfPages = 0;
	let itemsPerPage = 10;

	let status = WAITING_FIRST;

	let transactions = []; // initially, no data = it is empty

	const loadMoreData = function(vnode) {
		status = WAITING_FIRST;
		vnode.attrs.fetch(vnode.attrs.arg)
		.then(function(data) {
			transactions = data;
			status = READY;
		})
		.catch(function(error) {
			status = ERROR;
			console.log("Error loading data for paged transaction list: ", error);
		})
		.finally(m.redraw);
	}

	return {
		oninit: loadMoreData,
		onupdate: function(vnode) {
			console.log("updating transaction list pageable");
			// TODO: check if attributes actually changed before sending request
		},
		view: function(vnode) {
			if(status == WAITING_FIRST) {
				return m("span", "Loading...");
			}
			else if(status == READY) {
				return <TransactionList transactions={transactions} />
			}
			else {
				return m("span", "Error loading transactions");
			}
		},
	};
};