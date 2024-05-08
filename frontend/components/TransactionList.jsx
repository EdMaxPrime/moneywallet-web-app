const m = require("mithril")
const TransactionItem = require("../components/TransactionItem")
const MoneyAmount = require("./MoneyAmount.jsx")

const Util = require("../models/index.js")

const dayjs = require("dayjs");


/**
 * Returns a formatted string representing a date range. This string contains
 * the minimum required information: year is only present if the start and end
 * dates are in different years, month is only present if the start and end 
 * dates are in different months, etc.
 * @param bucket  one of the array items returned by BucketSorter.getBuckets()
 * @return  a formatted string
 */
const formatBucketDates = function(bucket) {
	if(bucket.startDateInstance.year() == bucket.endDateInstance.year()) {
		if(bucket.startDateInstance.month() == bucket.endDateInstance.month()) {
			if(bucket.startDateInstance.date() == bucket.endDateInstance.date()) {
				return bucket.startDateInstance.format("MMMM D");
			} else {
				return bucket.startDateInstance.format("MMMM D") + " - " + bucket.endDateInstance.format("D");
			}
		} else {
			return bucket.startDateInstance.format("MMMM D") + " - " + bucket.endDateInstance.format("MMMM D");
		}
	} else {
		return bucket.startDateInstance.format("MMMM D YYYY") + " - " + bucket.endDateInstance.format("MMMM D YYYY");
	}
}

/**
 * This class can group Transaction records into time periods.
 * You should begin by instantiating with "new", and then add() all transactions
 * in any order. When you are ready to iterate over them, call getBuckets()
 */
const BucketSorter = function() {
	this.byISO = {};

	this.add = function(transaction) {
		// get date
		const startDateInstance = dayjs(transaction["date"]).startOf("week");
		const endDateInstance = startDateInstance.endOf("week");
		const key = startDateInstance.format();

		// create or update bucket
		if(!(key in this.byISO)) {
			this.byISO[key] = {
				key: key,
				startDateInstance : startDateInstance,
				endDateInstance : endDateInstance,
				items : [],
				sumByCurrency: {},
			};
		}
		let bucket = this.byISO[key];
		bucket.items.push(transaction);

		// running sum of total money spent, for each currency
		const currencyId = Util.getCurrencyOfTransaction(transaction)["id"];
		const moneyWithPositiveNegative = transaction["direction"]? -transaction["money"] : transaction["money"];
		if(!(currencyId in bucket.sumByCurrency)) {
			bucket.sumByCurrency[currencyId] = moneyWithPositiveNegative;
		} else {
			bucket.sumByCurrency[currencyId] += moneyWithPositiveNegative;
		}
	};

	this.getBuckets = function() {
		// get buckets as the values of associative array
		// and sort buckets by date from latest to earliest
		return Object.values(this.byISO).sort(function(a, b) {
			if(a.startDateInstance.isBefore(b.startDateInstance)) {
				return 1;
			} else {
				return a.startDateInstance.isSame(b.startDateInstance)? 0: -1;
			}
		});
	};
}

/**
 * Attributes:
 * transactions = a list of Transaction model items. It can be an empty list but it should not be undefined
 */
module.exports = {
	view: function(vnode) {
		// first, group the transactions by time period
		const timePeriod = "weekly";
		const data = vnode.attrs.transactions;
		const buckets = new BucketSorter();
		// for each transaction
		data.forEach(function(t) {
			// sort it into a bucket based on the time period
			buckets.add(t);
		})

		return (
			<ul class="collection with-header">
				{buckets.getBuckets().flatMap(bucket => (
					[
						<li class="collection-header row" key={bucket.key}>
							<h6 class="col s6">
								{formatBucketDates(bucket)}
							</h6>
							<div class="col s6 right-align">
							{Object.entries(bucket.sumByCurrency).map(
								([currencyId, sum]) => <MoneyAmount key={currencyId} direction={sum < 0} currencyId={currencyId} money={sum} />)
							}
							</div>
						</li>
					].concat(bucket.items.map(transaction => 
						<TransactionItem t={transaction} key={transaction.id} />
					))
				))}
			</ul>);
	}
}