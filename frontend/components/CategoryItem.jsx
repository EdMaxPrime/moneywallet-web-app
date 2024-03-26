const m = require("mithril")
const Icon = require("./Icon.jsx")


module.exports = {
	view: function(vnode) {
		return (
			<a onClick={vnode.attrs.onClick}>
				<Icon icon={{type: "color", name: "FA", color: "orange"}} />
				{vnode.attrs.category.name}
			</a>
		)
	}
};