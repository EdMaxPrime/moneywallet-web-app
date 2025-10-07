const m = require("mithril")
const Icon = require("./Icon.jsx")


module.exports = {
	view: function(vnode) {
		return (
			<span onclick={vnode.attrs.onclick}>
				<Icon icon={vnode.attrs.category.icon} marginX={true} />
				{vnode.attrs.category.name}
			</span>
		)
	}
};