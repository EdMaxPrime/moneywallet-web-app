const m = require("mithril")


/**
 * This layout is shared among pages that don't require the user to be signed
 * in.
 */
module.exports = {
	view: function(vnode) {
		return [(<header><h1>Money Wallet</h1></header>),
			(<main class="container">{vnode.children}</main>)];
	}
}