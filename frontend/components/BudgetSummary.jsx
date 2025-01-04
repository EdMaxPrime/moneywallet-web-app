const m = require("mithril")
const HighchartsContainer = require("./HighchartsContainer")

const Util = require("../models/index")

const dayjs = require("../dayjs-lib")


/**
 * Attributes:
 * 
 * all attributes of a Budget model
 * 
 * used: Integer amount of money used by this budget so far.
 * 
 * money: Integer the limit for this budget.
 * 
 */
module.exports = {
	view: function(vnode) {
		// shorter names for frequently accessed attributes
		const used = vnode.attrs.budget.used;
		const money = vnode.attrs.budget.money;
		const currencyId = vnode.attrs.budget.currency;

		return m("div.card", [
			m("div.card-content", [
				m("span.card-title", vnode.attrs.name),
				m(HighchartsContainer, {
					chartAttributes: {
						style: "height: 65px;",
					},
					chartOptions: {
						chart: {
							inverted: true,
							type: "bullet"
						},
						credits: {
							enabled: false,
						},
						exporting: {
							enabled: false,
						},
						legend: {
							enabled: false,
						},
						plotOptions: {
							series: {
								pointPadding: 0.25,
								borderWidth: 0,
								color: "#424242",
								targetOptions: {
									width: "200%",
								},
							},
						},
						series: [{
							data: [{
								y: used,
								target: money,
							}]
						}],
						title: {
							text: null,
						},
						tooltip: {
							pointFormatter: function() {
								return Util.formatMoneyAmount(this.y, currencyId)
							},
						},
						xAxis: {
							categories: ["Spending"],
						},
						yAxis: {
							gridLineWidth: 0,
							labels: {
								enabled: false,
							},
							plotBands: [
								{
									from: 0,
									to: money,
									color: "#a5d6a7",
								},
								{
									from: money,
									to: 9e9,
									color: "#ef9a9a",
								}
							],
							title: null,
						},
					}
				}),
				m("p", "Spent " + Util.formatMoneyAmount(used, currencyId) + " of " + Util.formatMoneyAmount(money, currencyId) + " (" + Math.round(100 * used / money) + "% of goal)"),
				m("p", "Available: " + (used < money? Util.formatMoneyAmount(money - used, currencyId) : "0")),
				m("p", "Ends: " + dayjs(vnode.attrs.end_date).fromNow())
			]),
			m("div.card-action", 
				m(m.route.Link, {href: "/budget/tag/" + vnode.attrs.budget.id}, "Details")
			)
		]);
	}
};