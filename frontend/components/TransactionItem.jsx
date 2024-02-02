const m = require("mithril")
const Icon = require("./Icon.jsx")

const Util = require("../models/index.js")

require("./TransactionItem.css")


module.exports = {
	view: function(vnode) {
		const t = vnode.attrs.t;
		const c = Util.getCategoryOfTransaction(t);

		return (<li class="collection-item avatar">
				<Icon icon={c["icon"]} />

				<span class="title">{c["name"]}</span>
				<p>{t["description"]}</p>

				<p class="secondary-content">
					<span class="red-text text-darken-1">{Util.formatTransactionAmount(t)}</span>
					<p class="black-text">{t["date"]}</p>
				</p>
		</li>);
	}
}