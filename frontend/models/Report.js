const pb = require("../api")

const Report = {
	getNetWorth: function(wallet) {
		return pb.collection("net_worth_daily").getFullList({
			wallet: wallet,
			fields: "id,date,users,wallets,cashflow,balance"
		});
	}
};

module.exports = Report;