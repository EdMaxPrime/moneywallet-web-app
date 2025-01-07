// Mithril Component imports
const m = require("mithril")
const Icon = require("./Icon")

// CSS
require("./WalletChip.css")

// Pocketbase API imports
const Wallet = require("../models/Wallet")

module.exports = {
	view: function(vnode) {
		const wallet = Wallet.getById(vnode.attrs.id);
		return (<span class="wallet-chip">
			<Icon icon={wallet.icon} />
			{wallet.name}
		</span>);
	}
};