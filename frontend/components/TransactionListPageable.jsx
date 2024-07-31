const m = require("mithril");
const Transaction = require("./TransactionItem")


// STATUSES
const WAITING_FIRST = 1, // waiting for initial data to load
WAITING = 2, 
READY = 3, // data is loaded
ERROR = 4; // there was an error fetching data

/**
 * This component draws a list of TransactionItems. There is a button below the
 * list to Load More. This component's state has a cache for Transaction records
 * so it can only grow bigger. While waiting for more data it draws an animation.
 * It takes these attributes:
 * 
 * fetch = a function to load more data (could be over network or from a cache).
 * It is given 3 arguments: requestedPageNumber (1 to infinity), itemsPerPage
 * (10), and the 3rd is the arg attribute below. It should return a promise
 * that resolves to an object with this shape {items, totalPages, totalItems, page}
 * 
 * arg = anything else to pass to the fetch function when it is called, such as
 * filters.
 * 
 * showTotal = boolean, default false. If true, then this text is shown above
 * and below the list "Showing X of Y items." The X and Y are placeholders.
 */
module.exports = function() {
	let currentPage = 0; // cursor through the pages
	let numberOfPages = 0; // total number of pages
	let numberOfItems = 0; // total number of items, even not loaded
	let empty = false; // true if there are 0 items
	let itemsPerPage = 10; // length of each page

	let status = WAITING; // the status controls what to show in view()

	let transactions = []; // holds the Transaction records

	/**
	 * Loads more Transactions into the cache. This method is async, it will
	 * redraw the component when the request completes.
	 * @param vnode  the Mithril vnode instance, used for attributes
	 */
	const loadMoreData = function(vnode) {
		status = WAITING;
		// advance the cursor
		vnode.attrs.fetch(currentPage + 1, itemsPerPage, vnode.attrs.arg)
		.then(function(data) {
			transactions = transactions.concat(data.items);
			numberOfPages = data.totalPages;
			numberOfItems = data.totalItems;
			empty = data.totalItems == 0;
			currentPage = data.page;
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
			// TODO: check if attributes actually changed before sending request
		},
		view: function(vnode) {
			// when waiting for network response: keep the existing list, and show the loading indicator and disable the button
			// when not waiting: show the list and a button to request more
			if(status == READY || status == WAITING) {
				if(empty) {
					return m("i", "No transactions to show");
				}

				return (
					<div>
					{vnode.attrs.showTotal && <p style="padding-left: 2em;">Showing {transactions.length} of {numberOfItems}</p>}
					<ul class="collection">
						{transactions.map(t => <Transaction key={t.id} t={t} />)}
					</ul>
					{vnode.attrs.showTotal && <p style="padding-left: 2em;">Showing {transactions.length} of {numberOfItems}</p>}
					<div class="center-align" style="padding-bottom: 2em;">
						<button class="waves-effect waves-light btn" disabled={status == WAITING} onclick={() => loadMoreData(vnode)}>Load more</button>
						{status == WAITING && (<div class="progress"><div class="indeterminate" /></div>)}
					</div>
				</div>);
			}

			// on error, show a message
			else {
				return m("span", "Error loading transactions");
			}
		},
	};
};