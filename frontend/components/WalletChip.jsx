// Mithril Component imports
const m = require("mithril")
const Icon = require("./Icon")

// CSS
require("./WalletChip.css")

// Pocketbase API imports
const Wallet = require("../models/Wallet")

/**
 * This component renders a wallet's icon, followed by it's name. Must have
 * one of the following attributes
 * 
 * Attributes:
 * @attribute id  the string id of the wallet
 * @attribute wallet  the Wallet object
 */
module.exports = {
	view: function(vnode) {
		const wallet = vnode.attrs.wallet? vnode.attrs.wallet : Wallet.getById(vnode.attrs.id);
		return (<span class="wallet-chip">
			<Icon icon={wallet.icon} marginX={true} />
			{wallet.name}
		</span>);
	}
};