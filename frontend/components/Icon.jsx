const m = require("mithril")

module.exports = {
	view: function(vnode) {
		if(vnode.attrs.icon.type == "resource") {
			return m("i", {
				className: "circle img-responsive material-icons"
			}, vnode.attrs.icon.resource);
		} else {
			return m("div", {
					className: "circle valign-wrapper",
					style: {
						backgroundColor: vnode.attrs.icon.color || "#000000",
						color: "#ffffff"
					}
				}, 
				m("h6", {
					className: "center-align",
				}, vnode.attrs.icon.name)
			);
		}
	}
}