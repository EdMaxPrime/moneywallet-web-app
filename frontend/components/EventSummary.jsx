const m = require("mithril")
const Icon = require("../components/Icon.jsx")
const MoneyAmount = require("../components/MoneyAmount.jsx")

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
		return m("li.collection-item.avatar", [
			m(Icon, {icon: vnode.attrs.event.icon}),
			m("span.title", 
				m(m.route.Link, {href: "/event/" + vnode.attrs.event.id}, vnode.attrs.event.name)),
			m("p", "Ends on " + dayjs(vnode.attrs.event.end_date).formatDate()),
			m("p.secondary-content", [
				m(MoneyAmount, {
					direction: 1,
					money: 1000,
					currencyId: "lv25l90oi4x8sz3"
				})
			])
		])
	}
}