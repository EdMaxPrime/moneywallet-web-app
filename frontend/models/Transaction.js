const pb = require("../api")
const currency = require("currency.js")
const dayjs = require("../dayjs-lib")



const Filter = function(object) {
	// ----------------------
	// instance variables
	// ----------------------
	const NOT_USED = false;

	this.nextFilter = NOT_USED;
	this.nextOperation = NOT_USED;
	this.substitutions = {};

	// ----------------------
	// constructor
	// ----------------------
	object = object || {};

	if(object.min) {
		this.substitutions.min = currency(object.min).intValue;
	}
	if(object.max) {
		this.substitutions.max = currency(object.max).intValue;
	}
	if(object.after && dayjs(object.after, "YYYY-MM-DD", true).isValid()) {
		this.substitutions.after = object.after;
	}
	if(object.startDate && dayjs(object.startDate, "YYYY-MM-DD", true).isValid()) { // alias
		this.substitutions.after = object.startDate;
	}
	if(object.before && dayjs(object.before, "YYYY-MM-DD", true).isValid()) {
		this.substitutions.before = object.before;
	}
	if(object.endDate && dayjs(object.endDate, "YYYY-MM-DD", true).isValid()) { // alias
		this.substitutions.before = object.endDate;
	}
	if(object.searchTerm) {
		this.substitutions.searchTerm = object.searchTerm;
		this.matchNote = object.matchNote;
		this.matchCategory = object.matchCategory;
		this.matchEvent = object.matchEvent;
		this.matchPlace = object.matchPlace;
		this.matchPeople = object.matchPeople;
	}
	if(object.wallets) {
		this.substitutions.wallets = object.wallets;
	}
	if(object.category) {
		this.substitutions.category = object.category;
	}
	if(object.event) {
		this.substitutions.event = object.event;
	}
	if(object.confirmed === true || object.confirmed === false) {
		this.substitutions.confirmed = object.confirmed;
	}
	if(object.count_in_total === true || object.count_in_total === false) {
		this.substitutions.count_in_total = object.count_in_total;
	}


	// ---------------------
	// methods
	// ----------------------

	/**
	 * Combines 2 filters creating an order of operations
	 * @param filter  another Filter object
	 */ 
	this.or = function(filter) {
		this.nextFilter = filter;
		this.nextOperation = "||";
		return this;
	}

	this.toString = function(applySubstitutions) {
		let result = "";
		// add each binary condition to a list
		let conditions = [];
		if(this.substitutions.hasOwnProperty("min")) {
			conditions.push("money >= {:min}")
		}
		if(this.substitutions.hasOwnProperty("max")) {
			conditions.push("money <= {:max}")
		}
		if(this.substitutions.hasOwnProperty("before")) {
			conditions.push("date <= {:before}")
		}
		if(this.substitutions.hasOwnProperty("after")) {
			conditions.push("date >= {:after}")
		}
		if(this.substitutions.hasOwnProperty("searchTerm")) {
			let disjunction = []; // sub-expression, joined by LOGICAL OR
			disjunction.push("description ~ {:searchTerm}");
			if(this.matchNote     ) disjunction.push("note ~ {:searchTerm}");
			if(this.matchCategory ) disjunction.push("category.name ~ {:searchTerm}");
			if(this.matchEvent    ) disjunction.push("event.name ~ {:searchTerm}");
			if(this.matchPlace    ) disjunction.push("place.name ~ {:searchTerm}");
			if(this.matchPeople   ) disjunction.push("people.name ?~ {:searchTerm}");
			conditions.push("(" + disjunction.join(" || ") + ")");
		}
		if(this.substitutions.hasOwnProperty("wallets")) {
			conditions.push("wallet = {:wallets}")
		}
		if(this.substitutions.hasOwnProperty("category")) {
			if(typeof this.substitutions.category === "string")
				conditions.push("category = {:category}");
		}
		if(this.substitutions.hasOwnProperty("event")) {
			conditions.push("event = {:event}")
		}
		if(this.substitutions.hasOwnProperty("confirmed")) {
			conditions.push("confirmed = {:confirmed}")
		}
		if(this.substitutions.hasOwnProperty("count_in_total")) {
			conditions.push("count_in_total = {:count_in_total}")
		}
		
		// make a string from the list
		result = conditions.join(" && ");
		if(applySubstitutions) {
			result = pb.filter(result, this.substitutions);
		}

		// construct larger expression if there is another filter
		if(this.nextFilter != NOT_USED) {
			result = this.nextOperation + " (" + this.nextFilter.toString(applySubstitutions) + ")";
		}

		return result;
	}

	/**
	 * Lazy and inefficient implementation by comparing the strings.
	 * Should compare object structure instead.
	 * @param other  a Filter object to test for equality
	 * @return  boolean true if the 2 Filters are equal or False if not
	 */
	this.equals = function(other) {
		return (typeof other == "string" || typeof other == "object") && this.toString(true) == other.toString(true);
	}
}

var Transaction = {
	list: [],
	current: {},

	DIRECTION_EXPENSE: false,
	DIRECTION_INCOME: true,

	loadList: function() {
		return pb.collection("transactions").getFullList().then(response => {
			console.log("loaded full transaction list length="+response.length);
			Transaction.list = response;
			return response;
		})
	},

	/**
	 * Retrieves some transaction records. The response is not cached, so the
	 * caller should have their own caching strategy.
	 * @param page  the results are paginated, and this is the 1-based page number
	 * @param perPage  the number of items per page. Result may have fewer
	 * @param options  and object with filter, sort, expand, and fields. Consult
	 * the PocketBase API documentation for details
	 * @return a Promise that resolves to a JSON object. On success, it will
	 * have these fields:
	 *   totalItems: the total number of items, even beyond this page
	 *   totalPages: the total number of pages
	 *   page: the current page number
	 *   items: a list of Transaction records
	 */
	loadSome: function(page, perPage, options) {
		return pb.collection("transactions").getList(page, perPage, options)
	},

	/**
	 * Asynchronous load transactions from the API. Only fetches transactions
	 * which meet the filter's criteria. They are not cached.
	 * 
	 * @param filter  an object that can be passed to the Filter constructor
	 * or an instantiated Filter object. This criteria specifies which
	 * transactions will be fetched.
	 * @param options  an object with these Pocketbase options:
	 *   sort: string to determine order of the results
	 *   expand: string to determine which relations to include
	 *   fields: string to limit which fields are included
	 * By default, results are sorted from most recent to oldest
	 * @return Promise that resolves to a list of Transaction objects
	 */
	getWithFilter: function(filter, options) {
		let apiOptions = Object.assign({
			sort: "-date"
		}, options);

		if(!(filter instanceof Filter)) {
			filter = new Filter(filter);
		}

		console.log("Transaction.getWithFilter(" + filter.toString(true));
		return pb.collection("transactions").getFullList({
			filter: filter.toString(true),
			...apiOptions
		})
	},

	Filter: Filter,

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