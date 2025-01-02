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
		const used = vnode.attrs.used;
		const money = vnode.attrs.money;
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
								return Util.formatMoneyAmount(this.y, vnode.attrs.currency)
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
				m("p", "Spent " + Util.formatMoneyAmount(used, vnode.attrs.currency) + " of " + Util.formatMoneyAmount(money, vnode.attrs.currency) + " (" + Math.round(100 * used / money) + "% of goal)"),
				m("p", "Available: " + (used < money? Util.formatMoneyAmount(money - used, vnode.attrs.currency) : "0")),
				m("p", "Ends: " + dayjs(vnode.attrs.end_date).fromNow())
			]),
			m("div.card-action", 
				m(m.route.Link, {href: "/budget/tag/" + vnode.attrs.id}, "Details")
			)
		]);
	}
};