const m = require("mithril")
const Layout = require("../layouts/Layout")
const Icon = require("../components/Icon.jsx")
const Tabs = require("../components/Tabs.jsx")
const Tree = require("../components/Tree.jsx")

const Category = require("../models/Category")

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
					{/*<div class="row">
						<div class="col s6 m4">
							<h1>Incomes</h1>
						</div>
					</div>*/}
					<Tabs labels={["Income", "Expense", "System"]}>
						<div id="income-categories-tree" class="col s12">
							<Tree nodes={Category.getTree(Category.income)} />
						</div>
						<div id="expense-categories-tree" class="col s12">
							<Tree nodes={Category.getTree(Category.expense)} />
						</div>
						<div id="system-categories-tree" class="col s12">
							<Tree nodes={Category.getTree(Category.system)} />
						</div>
					</Tabs>

					{/*<div class="row">
						<div class="col s12">
							<ul class="tabs">
								<li class="tab col s4"><a href="#income-categories-tree">Incomes</a></li>
								<li class="tab col s4"><a href="#expense-categories-tree">Expenses</a></li>
								<li class="tab col s4"><a href="#system-categories-tree">System</a></li>
							</ul>
						</div>
						<div id="income-categories-tree" class="col s12">
							stuff 1
						</div>
						<div id="expense-categories-tree" class="col s12">
							stuff 2
						</div>
						<div id="system-categories-tree" class="col s12">
							stuff 3
						</div>
					</div>*/}
				</Layout>
			);
		}
	};
})