const m = require("mithril")
const Icon = require("./Icon.jsx")

require("./TransactionItem.css")


module.exports = {
	view: function(vnode) {
		const t = vnode.attrs.t;

		return (<li class="collection-item avatar">
				<Icon icon={{type: "color", name: "AB"}} />

				<span class="title">Category</span>
				<p>{t.desc}</p>

				<p class="secondary-content">
					<span class="red-text text-darken-1">$5.00</span>
					<p class="black-text">Tue Dec 2, 2023</p>
				</p>
		</li>);
	}
}