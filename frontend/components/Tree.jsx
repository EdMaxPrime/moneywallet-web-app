const m = require("mithril")
const Icon = require("./Icon.jsx")

require("./Tree.css")

/**
 * Attributes:
 * nodes = a tree of Category, where the root is a list, and child nodes are
 *   kept in a list called "children". Leaf nodes should have an empty children
 * component = the component to wrap the list item in, such as a link. Default is "span"
 * generateComponentAttributes = a function which takes 1 parameter: the current 
 *   node, and returns an object of {attribute_name: attribute_value} to give 
 *   the component. The default is a function that returns nothing.
 */

// This must be declared as a variable so that the name can be used in recursion
const Tree = {
	view: function(vnode) {
		const Component = vnode.attrs.component? vnode.attrs.component : "span";
		const attrs = vnode.attrs.generateComponentAttributes? vnode.attrs.generateComponentAttributes : function() {return {};};
		return (
			<ul class="tree">
				{vnode.attrs.nodes.map(category => (
					<li>
						<Component {...attrs(category)}>
							<Icon icon={{type: "color", name: "FA", color: "orange"}} />
							{category.name}
						</Component>
						{category.children.length > 0 && <Tree nodes={category.children} component={vnode.attrs.component} generateComponentAttributes={vnode.attrs.generateComponentAttributes} />}
					</li>
				))}
			</ul>
		);
	}
};

// the component was declared as a variable to allow recursive name reference
module.exports = Tree;