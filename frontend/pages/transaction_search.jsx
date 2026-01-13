const m = require("mithril")
const TransactionList = require("../components/TransactionList")
const TransactionListPageable = require("../components/TransactionListPageable")
const TransactionSearch = require("../components/TransactionSearch")

const Transaction = require("../models/Transaction")
const TransactionBulkEditForm = require("../models/TransactionBulkEditForm")

const dayjs = require("../dayjs-lib")
const currency = require("currency.js")


const searchEventListener = function(search) {
	m.route.set("/transactions/search", search);
}

/**
 * Converts a Search Query object into a format suitable for an API call to
 * Pocketbase.
 * 
 * @param searchQuery  many optional fields which can come from the attributes
 * to this component.
 */
const convertSearchQueryToFetchArg = function(searchQuery) {
	// TODO: the size of the response can be reduced by specifying {fields: "*"} to exclude child entities
	return {
		sort: "-date",
		filter: new Transaction.Filter(searchQuery).toString(true),
		expand: "data_source,people,place,event,category",
	};
}

/**
 * This component can take any number of attributes. They will come from the URL
 * query parameters. They will be used for filtering the search results.
 */
module.exports = function() {
	return {
		view: function(vnode) {
			let search = vnode.attrs;

			return (<div>
 				<TransactionSearch values={search} onSearch={searchEventListener} />
 				<m.route.Link href="/transactions/bulk_edit" onclick={() => TransactionBulkEditForm.current.startSessionFromSearch(new Transaction.Filter(search)).finally(m.redraw)}>Bulk Edit</m.route.Link>
 				<TransactionListPageable 
					arg={convertSearchQueryToFetchArg(search)} 
					fetch={Transaction.loadSome}
					showTotal={true} />
 			</div>);
		}
	};
}