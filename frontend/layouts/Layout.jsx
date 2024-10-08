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
					<li><m.route.Link href="/transactions">Transactions</m.route.Link></li>
					<li><m.route.Link href="/categories">Categories</m.route.Link></li>
					<li><m.route.Link href="/overview">Overview</m.route.Link></li>
					<li><m.route.Link href="/import">Import Data</m.route.Link></li>
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
		if(vnode.state.materialSidebarInstance != null) {
			vnode.state.materialSidebarInstance.destroy();
		}
	}
}