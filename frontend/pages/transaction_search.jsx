const m = require("mithril")
const TransactionList = require("../components/TransactionList")
const TransactionListPageable = require("../components/TransactionListPageable")
const TransactionSearch = require("../components/TransactionSearch")

const Transaction = require("../models/Transaction")

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
	let optionalFilter = ["description ~ '" + searchQuery.searchTerm + "'"]; // these are joined by logical OR
	let requiredFilter = []; // these are joined by logical AND
	let expand = ["data_source"]; // related objects that need to be queried, such as the place

	// construct optional filter
	if(searchQuery.matchNote) {
		optionalFilter.push("note ~ '" + searchQuery.searchTerm + "'");
	}
	if(searchQuery.matchCategory) {
		expand.push("category");
		optionalFilter.push("category.name ~ '" + searchQuery.searchTerm + "'");
	}
	if(searchQuery.matchEvent) {
		expand.push("event");
		optionalFilter.push("event.name ~ '" + searchQuery.searchTerm + "'");
	}
	if(searchQuery.matchPlace) {
		expand.push("place");
		optionalFilter.push("place.name ~ '" + searchQuery.searchTerm + "'");
	}
	if(searchQuery.matchPeople) {
		expand.push("people");
		optionalFilter.push("people.name ?~ '" + searchQuery.searchTerm + "'");
	}

	// create order of operations
	requiredFilter.push("(" + optionalFilter.join(" || ") + ")");

	// construct required filter
	if(searchQuery.after && dayjs(searchQuery.after, "YYYY-MM-DD", true).isValid()) {
		requiredFilter.push("date >= '" + searchQuery.after + "'");
	}
	if(searchQuery.before && dayjs(searchQuery.before, "YYYY-MM-DD", true).isValid()) {
		requiredFilter.push("date <= '" + searchQuery.before + "'");
	}
	if(searchQuery.min) {
		requiredFilter.push("money >= " + currency(searchQuery.min).intValue);
	}
	if(searchQuery.max) {
		requiredFilter.push("money <= " + currency(searchQuery.max).intValue);
	}

	// TODO: the size of the response can be reduced by specifying {fields: "*"} to exclude child entities
	return {
		sort: "-date",
		filter: requiredFilter.join(" && "),
		expand: expand.join(","),
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
 				<TransactionListPageable 
					arg={convertSearchQueryToFetchArg(search)} 
					fetch={Transaction.loadSome}
					showTotal={true} />
 			</div>);
		}
	};
}