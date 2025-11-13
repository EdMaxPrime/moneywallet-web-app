const m = require("mithril")

// presentation layer - mithril component imports
const { Sidenav, SidenavItem, Icon } = require('mithril-materialized');
const TransactionModal = require("../components/TransactionModal")
const WalletChip = require("../components/WalletChip")

// data layer imports
const Wallet = require("../models/Wallet")

// CSS
require("./Layout.css")
require("mithril-materialized/utilities.css") // for colors


/**
 * Creates an item in the side navigation menu. It links to a page, and appears
 * highlighted when the path matches the link destination.
 * @param text  the display text
 * @param icon  material icon name
 * @param path  the link destination
 * @return  mithril vnode
 */
const menuItemFactory = function(text, icon, path, extra) {
	return m(SidenavItem, Object.assign({
		text: text,
		icon: icon,
		href: m.route.prefix + path,
		active: m.route.get() == path,
	}, extra));
}


/**
 * This is the base page layout for users who are authenticated (signed in).
 * It has a page title at the top, a left-hand navigation menu, and a body of
 * content.
 */
module.exports = {
	view: function(vnode) {
		const route = m.route.get();
		return [
			m("header", [
				m("nav", m("h1.green.accent-1", vnode.attrs.title)),
				m(Sidenav, {
					isOpen: true,
					position: "left",
					mode: "overlay",
					width: 300,
					showBackdrop: false,
					closeOnBackdropClick: false,
					closeOnEscape: true,
					expandable: true,            // Enable collapse/expand
					isExpanded: window.innerWidth >= 992 || vnode.state.isOpen,       // Start expanded (default)
					persistState: true,          // Remember state in localStorage
					hamburgerPosition: { top: '16px', left: '16px' },
					onExpandChange: (expanded) => {vnode.state.isOpen=expanded;},
					header: {
						text: "Money Wallet",
						href: m.route.prefix
					},
				}, [
					m(SidenavItem, {
						text: "Wallets", 
						submenuMode: "none", 
						submenu: Wallet.getOrderedList().map(wallet => ({
							key: wallet.id, 
							text: m(WalletChip, {id: wallet.id})
						})).concat(
							[{
								text: "Manage Wallets",
								onSelect: () => m.route.set("/wallets"),
								icon: "settings",
								key: "Manage Wallets",
							}]
						),
						icon: vnode.state.walletDropDownActive? "collapse" : "expand",
						active: vnode.state.walletDropDownActive,
						onclick: () => {vnode.state.walletDropDownActive = !vnode.state.walletDropDownActive;},
					}),
					menuItemFactory("Transactions", "shopping_cart", "/transactions"),
					menuItemFactory("Categories", "category", "/categories"),
					menuItemFactory("Overview", "bar_chart", "/overview"),
					menuItemFactory("Budgets", "money_bag", "/budgets"),
					m(SidenavItem, {divider: true}),
					menuItemFactory("Import Data", "upload", "/import"),
					menuItemFactory("Settings", "settings", "/settings"),
					m(SidenavItem, {divider: true}),
					menuItemFactory("Sign out", "logout", "/logout"),
				]),
				m("div.container", 
					m("a.top-nav.sidenav-trigger.full.hide-on-large-only",
						m(Icon, "menu")))
			]),
			m("main", [m(TransactionModal)].concat(vnode.children))
		];
	},
}