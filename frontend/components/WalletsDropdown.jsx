const m = require("mithril")

const Wallet = require("../models/Wallet")

module.exports = (function() {
	let collapsible = null;

	return {
		oninit: function() {
			Wallet.loadList().then(function() {m.redraw();});
		},
		oncreate: function(vnode) {
			collapsible = M.Collapsible.init(vnode.dom, {
				onCloseStart: function() {
					document.getElementById("wallets-dropdown-arrow").innerText = "arrow_drop_down";
				},
				onOpenStart: function() {
					document.getElementById("wallets-dropdown-arrow").innerText = "arrow_drop_up";
				}
			});
		},
		onremove: function(vnode) {
			if(collapsible != null) collapsible.destroy();
		},
		view: function(vnode) {
			return (<ul id="wallets-dropdown" class="collapsible collapsible-accordion">
				<li>
					<a class="collapsible-header">Wallets<i class="material-icons" id="wallets-dropdown-arrow">arrow_drop_down</i></a>
					<div class="collapsible-body">
						<ul>
							{Wallet.list.map(function(wallet) {
								return (<li><m.route.Link href={"/wallets/"+wallet.id} key={wallet.id}>{wallet.name}</m.route.Link></li>)
							})}
							<li><m.route.Link href="/wallets/1">Checking</m.route.Link></li>
							<li><m.route.Link href="/wallets/2">Credit Card</m.route.Link></li>
							<li><m.route.Link href="/wallets/3">Cash</m.route.Link></li>
							<li><m.route.Link href="/wallets/create"><i class="material-icons">add</i>New Wallet</m.route.Link></li>
						</ul>
					</div>
				</li>
			</ul>);
		},
	};

})();