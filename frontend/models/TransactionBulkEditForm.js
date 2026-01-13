const Transaction = require("./Transaction")


const WAITING = 0, READY = 1, ERROR = 2;

/**
 * Holds the state for a Bulk Edit transaction.
 *   - get transactions by search query
 *   - list of transactions to be changed
 *   - what to change about them
 *   - status of API requests
 */
const TransactionBulkEditForm = function() {
	this.selectedIds = []; // subset of the transactions list, only these will be edited
	this.transactions = []; // list of search results, not all will be edited
	this.status = READY; // status of network requests

	/**
	 * Reset the form
	 */
	this.clear = function() {
		this.selectedIds = [];
		this.transactions = [];
		this.status = READY;
	}

	/**
	 * Starts a new session based on search query
	 * @param filter  Filter object
	 */
	this.startSessionFromSearch = function(filter) {
		this.clear();
		// (1) optionally start a server-side session, get session ID
		// (2) retrieve transactions for client-side responsiveness
		this.status = WAITING;
		let that = this;
		return Transaction.getWithFilter(filter)
		.then(function(response) {
			that.status = READY;
			that.transactions = response;
		})
		.catch(function(error) {
			that.status = ERROR;
		})
	}

	/**
	 * Returns true if the transactions to change have been fetched
	 */
	this.isReady = function() {return this.status == READY;}

	this.getError = function() {return this.status == ERROR? "Something went wrong" : false;}

	this.selectAll = function() {
		this.selectedIds = this.transactions.map(transaction => transaction.id);
	}

	this.deselectAll = function() {
		this.selectedIds = [];
	}

	this.countSelected = function() { return this.selectedIds.length; }

	this.countTotal = function() { return this.transactions.length; }

	this.isSelected = function(id) {
		return this.selectedIds.indexOf(id) > -1;
	}

	/**
	 * Toggle whether the transaction is selected and should be edited
	 */
	this.toggleSelection = function(id) {
		const indexInList = this.selectedIds.indexOf(id);
		if(indexInList > -1) {this.selectedIds.splice(indexInList, 1);}
		else {this.selectedIds.push(id);}
	}
}


module.exports = {
	TransactionBulkEditForm: TransactionBulkEditForm,
	current: new TransactionBulkEditForm(),
};