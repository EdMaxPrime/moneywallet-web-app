const m = require("mithril")
const Icon = require("./Icon.jsx")

require("./Tree.css")

// This must be declared as a variable so that the name can be used in recursion
const Tree = {
	view: function(vnode) {
		return (
			<ul class="tree">
				{vnode.attrs.nodes.map(category => (
					<li>
						<Icon icon={{type: "color", name: "FA", color: "orange"}} />
						{category.name}
						{category.children.length > 0 && <Tree nodes={category.children} />}
					</li>
				))}
			</ul>
		);
	}
};

// the component was declared as a variable to allow recursive name reference
module.exports = Tree;