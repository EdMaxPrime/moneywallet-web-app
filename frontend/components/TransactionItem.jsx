const m = require("mithril")
const Icon = require("./Icon.jsx")
const MoneyAmount = require("./MoneyAmount.jsx")

const Transaction = require("../models/Transaction.js")
const Util = require("../models/index.js")

const dayjs = require("../dayjs-lib")

require("./TransactionItem.css")


module.exports = {
	view: function(vnode) {
		const t = vnode.attrs.t;
		const c = Util.getCategoryOfTransaction(t);

		return (<li class="collection-item avatar">
				<Icon icon={c["icon"]} />

				<span class="title">{c["name"]}</span>
				<p onclick={() => Transaction.current = t}>{t["description"]}</p>

				<p class="secondary-content">
					<span class="red-text text-darken-1">
						<MoneyAmount direction={t["direction"]} t={t} />
					</span>
					<p class="black-text">{dayjs(t["date"]).formatDate()}</p>
				</p>
		</li>);
	}
}