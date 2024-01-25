const m = require("mithril")

/**
 * TAB COMPONENT
 * Renders tab headers (like in a web browser) and 1 piece of content at a time
 * Attributes:
 * @attribute labels  an array of strings to display as tab labels
 * @children divs with a unique id and class="col s12". There should be as many
 *           children as there are labels
 */
module.exports = function() {
	let tabInstance = null;
	let tabList = null;

	return {
		oncreate: function(vnode) {
			tabInstance = M.Tabs.init(tabList.dom, {
				onShow: m.redraw
			});
		},
		onremove: function(vnode) {
			if(tabInstance != null) {
				tabInstance.destroy();
			}
		},
		view: function(vnode) {
			// check if there are any tabs to show
			if(vnode.children == null || !(vnode.children.hasOwnProperty("length")))
				return null;
			// extract the DOM id of each tab into a list
			let tabIds = vnode.children.map(tabContainer => tabContainer.attrs.id);

			// make an HTML list of tab links
			tabList = (<ul class="tabs tabs-fixed-width">
				{vnode.attrs.labels.map((label, index) => 
					<li key={index} class="tab"><a href={"#" + tabIds[index]}>{label}</a></li>
				)}
			</ul>);

			return (
				<div class="row">
					<div class="col s12">
						{tabList}
					</div>
					{vnode.children}
				</div>
			);
		}
	};
};