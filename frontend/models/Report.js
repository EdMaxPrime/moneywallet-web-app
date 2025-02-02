const pb = require("../api")

const Report = {
	getNetWorth: function(wallet) {
		return pb.collection("net_worth_daily").getFullList({
			wallet: wallet,
			fields: "id,date,users,wallets,cashflow,balance"
		});
	},

	/**
	 * Fetches a list of transfers between wallets. Each record has
	 */
	getTransferTotals: function() {
		return pb.collection("transfers").getFullList({
			fields: "expand.transaction_from.money,expand.transaction_from.expand.wallet.name,expand.transaction_from.expand.wallet.name,expand.transaction_to.expand.wallet.name",
			filter: "confirmed = true",
			expand: "transaction_from,transaction_from.wallet,transaction_to,transaction_to.wallet",
		}).then(function(data) {
			const walletPairs = data.map(function(transfer) {
				return [
					transfer.expand.transaction_from.expand.wallet.name, 
					transfer.expand.transaction_to.expand.wallet.name, 
					transfer.expand.transaction_from.money];
			})
			.reduce(function(groups, record) {
				// group by
				// create a group name
				const groupName = record[0] + "\n" + record[1];
				// fetch the matching group and add the weight to it
				if(groups.hasOwnProperty(groupName)) {
					groups[groupName] += record[2];
				} else { // if it doesn't exist, create it
					groups[groupName] = record[2];
				}
				return groups;
			}, {});

			// convert object into a list of lists
			let result = [];
			for(stringWalletPair in walletPairs) {
				result.push(stringWalletPair.split("\n").concat(walletPairs[stringWalletPair]));
			}
			return result;
		})
	}
};

module.exports = Report;