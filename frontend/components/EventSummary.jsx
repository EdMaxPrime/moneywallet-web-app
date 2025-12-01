const m = require("mithril")
const Icon = require("../components/Icon.jsx")
const MoneyAmounts = require("../components/MoneyAmounts.jsx")

const Transaction = require("../models/Transaction.js")

const dayjs = require("../dayjs-lib")

/**
 * Displays a collection item with the event's name, end date, link to report,
 * and expenses and incomes. Must be wrapped in a <ul class="collection">
 * 
 * Attributes:
 * @attribute event  event object
 */
module.exports = {
	view: function(vnode) {
		let event = vnode.attrs.event;

		return m("li.collection-item.avatar", [
			m(Icon, {icon: event.icon}),
			m("span.title", 
				m(m.route.Link, {href: "/event/" + event.id}, event.name)),
			m("p", "Ends on " + dayjs(event.end_date).formatDate()),
			m("p.secondary-content", m(MoneyAmounts, {list: event.summary_by_currency}))
		])
	}
}