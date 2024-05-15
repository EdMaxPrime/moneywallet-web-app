const pb = require("../api")

const Report = {
	getNetWorth: function(wallet) {
		return pb.collection("net_worth").getFullList({
			wallet: wallet
		});
	}
};

module.exports = Report;