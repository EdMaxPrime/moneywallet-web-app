const pb = require("../api")

var Wallet = {
	list: [],
	byId: {},
	loadList: function() {
		return pb.collection('wallets').getFullList({
			sort: 'index'
		}).then(function (response) {
			console.log("wallet response");
			console.log(response);
			Wallet.list = response;
			response.forEach(wallet => {
				Wallet.byId[ wallet["id"] ] = wallet;
			})
		})
	},

	create: function() {
		Wallet.current.user_owner = pb.authStore.model.id;

		// Set the display index to be 1 greater than current max index of all wallets
		let maxIndex = -1;
		for(let i = 0; i < Wallet.list.length; i++) {
			if(Wallet.list[i].index > maxIndex)
				maxIndex = Wallet.list[i].index;
		}
		Wallet.current.index = maxIndex + 1;

		return pb.collection('wallets').create(Wallet.current);
	},

	/**
	 * Given a string Id, get the wallet with this id, or undefined if
	 * it doesn't exist.
	 */
	getById: function(id) {
		return Wallet.byId[id];
	},

	/**
	 * Clear all properties of the currently edited Wallet model.
	 * This will reset all forms that read from this.
	 */
	resetCurrent: function() {
		Wallet.current = {
			name: "",
			currency: 1,
			start_money: 0,
			note: "",
			count_in_total: false,
			icon: {
				type: "color",
				color: "#000000",
				name: "?"
			}
		};
	},

	current: {
		name: "",
		currency: 1,
		start_money: 0,
		note: "",
		count_in_total: true,
		icon: {
			type: "color",
			color: "#000000",
			name: "?"
		}
	},
}

module.exports = Wallet;