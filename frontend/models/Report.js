const pb = require("../api")
const Transaction = require("./Transaction")
const Wallet = require("./Wallet")
const util = require("../util")

const Report = {
	getNetWorth: function(wallet) {
		return pb.collection("net_worth_daily").getFullList({
			wallet: wallet,
			fields: "id,date,users,wallets,cashflow,balance"
		});
	},

	/**
	 * Fetches a list of transfers between wallets. Produces Highcharts points.
	 * Each point in the list will have these properties:
	 *   from: wallet name
	 *   to: wallet name
	 *   weight: a small number <= 1
	 * @param filter  an object to filter the data, optionally by date or event
	 * @return  list of point objects
	 */
	getTransferTotals: function(filter) {
		let conditions = ["confirmed = true"];
		if(filter.startDate) conditions.push("date >= {:startDate}");
		if(filter.endDate) conditions.push("date <= {:endDate}");
		if(filter.event) conditions.push("event = {:event}");

		// get transfers, and their joined transactions
		return pb.collection("transfers").getFullList({
			fields: "expand.transaction_from.money,expand.transaction_from.wallet,expand.transaction_from.expand.wallet.name,expand.transaction_to.wallet,expand.transaction_to.money,expand.transaction_to.expand.wallet.name",
			filter: pb.filter(conditions.join(" && "), filter),
			expand: "transaction_from,transaction_from.wallet,transaction_to,transaction_to.wallet",
		}).then(function(response) {
			// create Highcharts points from the data
			// first, flatten the nested object to be one level deep (map)
			// second, group similar transfers to have a sum of money between each unique pair of wallets (groupBy)
			// third, sort the points by relative weight
			// fourth, scale the weights to be smaller, otherwise the edges will look weird
			let points = util.groupBy(
				response.map(function(transfer) {
					return {
						from_wallet_id: transfer.expand.transaction_from.wallet,
						from_wallet_name: transfer.expand.transaction_from.expand.wallet.name,
						from_money: transfer.expand.transaction_from.money,
						to_wallet_id: transfer.expand.transaction_to.wallet,
						to_wallet_name: transfer.expand.transaction_to.expand.wallet.name,
						to_money: transfer.expand.transaction_to.money,
					};
				}),
				["from_wallet_id", "to_wallet_id"],
				function(wallet_ids, transfers) {
					return {
						from: transfers[0].from_wallet_name,
						to: transfers[0].to_wallet_name,
						// it is fine to sum the money like this, even though it is of many currencies, because we only need a relative number
						weight: transfers.reduce(function(sum, current) {return sum + current.from_money}, 0),
						custom: {
							from: {
								wallet: wallet_ids[0],
								money: transfers.reduce(function(sum, current) {return sum + current.from_money}, 0),
								direction: Transaction.DIRECTION_EXPENSE,
							},
							to: {
								wallet: wallet_ids[1],
								money: transfers.reduce(function(sum, current) {return sum + current.to_money}, 0),
								direction: Transaction.DIRECTION_INCOME,
							}
						},
					};
				}
			).sort(function(a, b) {
				return a.weight - b.weight
			});
			// scale the edge weights
			for(let i = 0; i < points.length; i++) {
				points[i].weight = (i + 1) / points.length;
			}
			return points;
		});
	},

	/**
	 * Fetches a sum of how much money was spent in each category. Income and 
	 * expense categories. If multiple currencies were used, then there will be 
	 * multiple records.
	 * @param startDate  start of the inclusive date range to filter results
	 * @param endDate    end of the inclusive date range to filter results
	 * @param wallet     optional. ID of wallet to filter transactions.
	 * @return           a list of results. Every item is an object with these
	 *                   unique fields: categoryId, currencyId, money.
	 */
	getMoneyPerCategory: function(startDate, endDate, wallet) {
		return pb.collection("categories_daily").getFullList({
			filter: pb.filter(
				"date >= {:startDate} && date <= {:endDate}",
				{
					startDate: startDate,
					endDate: endDate,
				}
			),
		}).then(function(records) {
			this.moneyPerCategoryCache = util.groupBy(
				records,
				["categories", "currencies"],
				function(groupNames, recordsInGroup) {
					return {
						categoryId: groupNames[0],
						currencyId: groupNames[1],
						money: recordsInGroup.reduce((sum, record) => sum + parseInt(record.money), 0)
					};
				}
			);
			return this.moneyPerCategoryCache;
		})
	},
	moneyPerCategoryCache: null,

	getDailyCategorySpend: function(wallet) {
		return pb.collection("categories_daily").getFullList({
			filter: (wallet == "Total")? "" : pb.filter("wallets = {:wallet}", {wallet}),
		})
	},

	/**
	 * Transforms a list of transactions to the data type expected by the Category Pie Chart
	 * 
	 * @param transactions  a list of Transaction objects
	 * 
	 * @return a list of objects with these properties: currencyId, categoryId, money
	 */
	transactionsToMoneyPerCategory: function(transactions) {
		return util.groupBy(
			transactions,
			["category", (transaction) => Wallet.getById(transaction.wallet).currency],
			function(groupNames, recordsInGroup) {
				return {
					categoryId: groupNames[0],
					currencyId: groupNames[1],
					money: recordsInGroup.reduce((sum, transaction) => sum + parseInt(transaction.money), 0)
				}
			}
		);
	},
};

module.exports = Report;