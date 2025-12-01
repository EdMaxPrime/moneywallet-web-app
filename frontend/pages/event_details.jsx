// presentation layer imports
const m = require("mithril")
const {Breadcrumb, Button, Collapsible, DataTable} = require("mithril-materialized")
const CategoryPieChart = require("../components/CategoryPieChart.jsx")
const DataProvider = require("../components/DataProvider.jsx")
const MoneyAmount = require("../components/MoneyAmount.jsx")
const MoneyAmounts = require("../components/MoneyAmounts.jsx")
const TransactionList = require("../components/TransactionList.jsx")
const WalletChip = require("../components/WalletChip.jsx")

// data layer imports
const Event = require("../models/Event")
const Report = require("../models/Report")
const Transaction = require("../models/Transaction")

const dayjs = require("../dayjs-lib")



const WalletChipWrapper = {
	view: function(vnode) {
		return m(WalletChip, {id: vnode.attrs.value});
	}
}

const MoneyAmountWrapper = {
	view: function(vnode) {
		const {value, row, index, column} = vnode.attrs;
		return m(MoneyAmount, {
			direction: column.field === "income"? Transaction.DIRECTION_INCOME : 
				(column.field === "expenses"? Transaction.DIRECTION_EXPENSE :
					(row.expenses > row.income? Transaction.DIRECTION_EXPENSE : Transaction.DIRECTION_INCOME)),
			money: Math.abs(value),
			currencyId: row.currencyId
		})
	}
}

const WalletBalanceSheet = {
	view: function(vnode) {
		return m(DataTable, {
			title: "Wallet cash flow",
			data: vnode.attrs.data,
			columns: [
				{key: "wallet", title: "Wallet", field: "wallet", sortable: true, filterable: true, cellRenderer: WalletChipWrapper},
				{key: "income", title: "Income", field: "income", sortable: true, filterable: true, cellRenderer: MoneyAmountWrapper},
				{key: "expenses", title: "Expenses", field: "expenses", sortable: true, filterable: true, cellRenderer: MoneyAmountWrapper},
				{key: "money", title: "Net", field: "money", sortable: true, filterable: true, cellRenderer: MoneyAmountWrapper},
			]
		})
	}
};


/**
 * This component shows some reports about a particular event.
 * 
 * Attributes:
 * @attribute event_id  the string id of the event for the API
 */
module.exports = function() {
	return {
		view: function(vnode) {
			// load event
			return m(DataProvider, {
				fetch: Event.getByIdAsync,
				filter: vnode.attrs.event_id,
				errorTitle: "Event Not Found",
				errorText: "Please make sure the URL is correct. The event may have been deleted.",
				viewWithData: (event) => m("", [
					m(".row", [
						m(".col s12 m6",
							m(Breadcrumb, {
								showHome: false,
								showIcons: true,
								separator: "chevron_right",
								items: [
									{text: "Home", href: "", active: false}, 
									{text: "Events", href: m.route.prefix+"/events", active: false},
									{text: event.name, href: m.route.get(), active: true},
								],
							})
						),
						m(".col s12 m6 right-align", [
							m(Button, {
								label: "Edit",
								iconName: "edit",
								style: "margin-right: 15px",
								href: m.route.prefix+m.route.get()+"/edit"
							}),
							m(Button, {
								label: "Delete",
								iconName: "delete",
								className: "black-text grey lighten-1",
								onclick: () => alert("This feature is not implemented yet.")
							})
						]),
					]),
					m("div.container", [
						m("h2", event.name),
						m("p", "From " + dayjs(event.start_date).formatDate() + " to " + dayjs(event.end_date).formatDate() + ". " + (event.note || "")),
						m("div", [
							m(WalletBalanceSheet, {data: event.summary_by_wallet}),
							m("strong", "Total: "),
							m(MoneyAmounts, {list: event.summary_by_currency})
						])
					]),
					m(DataProvider, {
						fetch: Transaction.getWithFilter,
						filter: {event: event.id},
						viewWithData: (transactions) => ([
							m(CategoryPieChart, {data: Report.transactionsToMoneyPerCategory(transactions)}),
							m("h3", "Transactions"),
							m(TransactionList, {transactions: transactions})
						])
					})
				]),
			})
		}
	}
}