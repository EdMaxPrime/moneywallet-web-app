const m = require("mithril")

require("./Icon.css")

/**
 * This renders a circle icon, which can be 1 of 2 types:
 * - Resource: this will be a material icon. Example:
 *   <Icon icon={{type: "resource", resource: "folder"}}
 * - Color: this will be 1 or 2 letters with a color background. Example:
 *   <Icon icon={{type: "color", color: "#FFFFFF", name: "AZ"}}
 * @attribute marginX  if true, then there will be a margin to the right and left
 *            default false
 */
module.exports = {
	view: function(vnode) {
		//inherit CSS classes passed to component
		let className = vnode.attrs.className;
		if(className == undefined || className == null) {
			className = "round-icon";
		} else {
			className += " round-icon";
		}

		// optional horizontal margin (x axis)
		if(vnode.attrs.marginX) {
			className += " mx-1";
		}

		// Icon
		if(vnode.attrs.icon.type == "resource") {
			return m("i", {
				className: className + "material-icons teal"
			}, vnode.attrs.icon.resource);
		} 
		// Letters
		else {
			return m("span", 
				{
					className: className,
					style: {
						backgroundColor: vnode.attrs.icon.color || "#000000",
						color: "#FFFFFF"
					}
				},
				vnode.attrs.icon.name
			);
		}
	}
}