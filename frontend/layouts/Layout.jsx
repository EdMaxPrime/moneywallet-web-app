const m = require("mithril")

const WalletsDropdown = require("../components/WalletsDropdown")

require("./Layout.css")

module.exports = {
	view: function(vnode) {
		return [(
			<header>
				<nav>
					<h1>{vnode.attrs.title}</h1>
				</nav>
				<ul id="sidenav" class="sidenav sidenav-fixed">
					<li><h1>Money Wallet</h1></li>
					<li class="no-padding">
						<WalletsDropdown />
					</li>
					<li><m.route.Link href="#!">Transactions</m.route.Link></li>
					<li><m.route.Link href="#!">Transfers   </m.route.Link></li>
					<li><m.route.Link href="#!">Overview    </m.route.Link></li>
				</ul>
				<div class="container"><a href="#" data-target="sidenav" class="top-nav sidenav-trigger full hide-on-large-only"><i class="material-icons">menu</i></a></div>
			</header>), (
			<main>
				{vnode.children}
			</main>)];
	},
	oncreate: function(vnode) {
		vnode.state.materialSidebarInstance = M.Sidenav.init(document.getElementById("sidenav"), {});
	},
	onremove: function(vnode) {
		vnode.state.materialSidebarInstance.destroy();
	}
}