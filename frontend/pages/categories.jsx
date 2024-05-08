const m = require("mithril")
const Layout = require("../layouts/Layout")
const Icon = require("../components/Icon.jsx")
const Tabs = require("../components/Tabs.jsx")
const Tree = require("../components/Tree.jsx")

const Category = require("../models/Category")


const linkToCategoryPage = function(category) {
	return {href: "/category/" + category["id"]};
}

module.exports = (function() {
	// state variable to control the tabs
	let tabs = null;

	return {
		oninit: function() {
			Category.loadList().then(m.redraw);
		},
		oncreate: function(vnode) {
			
		},
		onremove: function(vnode) {
			if(tabs != null) tabs.destroy();
		},
		view: function() {
			return (
				<Layout title="Categories">
					<Tabs labels={["Income", "Expense", "System"]}>
						<div id="income-categories-tree" class="col s12">
							<Tree 
								nodes={Category.getTree(Category.income)}
								component={m.route.Link}
								generateComponentAttributes={linkToCategoryPage} />
						</div>
						<div id="expense-categories-tree" class="col s12">
							<Tree 
								nodes={Category.getTree(Category.expense)}
								component={m.route.Link}
								generateComponentAttributes={linkToCategoryPage} />
						</div>
						<div id="system-categories-tree" class="col s12">
							<Tree 
								nodes={Category.getTree(Category.system)}
								component={m.route.Link}
								generateComponentAttributes={linkToCategoryPage} />
						</div>
					</Tabs>
				</Layout>
			);
		}
	};
})