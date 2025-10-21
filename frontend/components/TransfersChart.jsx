// Presentation layer imports
const m = require("mithril")
const HighchartsContainer = require("../components/HighchartsContainer")
const WalletChip = require("../components/WalletChip")

// Data layer imports
const Model = require("../models/index")


/**
 * This component is implemented as a POJO. It has no state, so on each redraw
 * it will update the chart with new data.
 * 
 * This component draws a chart and a table. The chart is an arc diagram showing
 * the transfers between wallets. An arc is drawn between wallets that have
 * transfers. The table will show the actual money amount. It also has a total
 * row. Works with multiple currencies.
 * 
 * Attributes:
 * @attribute data  a list of Highcharts points for the arc diagram. Each point
 * has these properties:
 *   from: a wallet name, will be a node
 *   to: a wallet name, will be a node
 *   weight: small number, less than 2 ideally, relative size of the edge between the nodes
 *   custom: an object with two transaction-like objects: "from" and "to" (must have the properties "wallet", "money", "direction")
 */
module.exports = {
	view: function(vnode) {
		// create table here and calculate totals for the last row, to keep the view code cleaner
		const tableBodyRows = []; // list of vnodes
		const totalCounts = {}; // map where keys are currency IDs and values are money amounts
		for(let point of vnode.attrs.data) {
			// create table row
			const sameCurrency = Model.getCurrencyOfTransaction(point.custom.from) == Model.getCurrencyOfTransaction(point.custom.to);
			tableBodyRows.push(m("tr", {key: point.from + point.to}, [
				m("td", m(WalletChip, {id: point.custom.from.wallet})),
				m("td", m(WalletChip, {id: point.custom.to.wallet})),
				m("td", Model.formatTransactionAmount(point.custom.from) + (sameCurrency? "" : " (" + Model.formatTransactionAmount(point.custom.to) + ")"))
			]));

			// add to running total
			const fromCurrencyId = Model.getCurrencyOfTransaction(point.custom.from).id;
			if(fromCurrencyId in totalCounts) {
				totalCounts[ fromCurrencyId ] += point.custom.from.money;
			} else {
				totalCounts[ fromCurrencyId ] = point.custom.from.money;
			}

			if(!sameCurrency) { // if the wallets shared a currency, then you'd be counting each dollar twice; otherwise, useful to show total for each currency
				const toCurrencyId = Model.getCurrencyOfTransaction(point.custom.to).id;
				if(toCurrencyId in totalCounts) {
					totalCounts[ toCurrencyId ] += point.custom.to.money;
				} else {
					totalCounts[ toCurrencyId ] = point.custom.to.money;
				}
			}
		}

		return m("div.row.card-panel", [
			m(HighchartsContainer, {
				chartOptions: {
					credits: {
						enabled: false,
					},
					title: {
						text: "Volume of transfers between wallets"
					},

					series: [{
						equalNodes: true,
						keys: ["from", "to", "weight"],
						type: "arcdiagram",
						name: "Transfers",
						// linkWeight: 1,
						centeredLinks: true,
						dataLabels: {
							rotation: 90,
							y: 30,
							verticalAlign: "top",
							color: "black",
							padding: 0,
						},
						nodeWidth: "auto",
						nodeDistance: "100%",
						data: vnode.attrs.data,
					}],
				},
				allowChartUpdate: true,
				chartAttributes: {"class": "col s12 m4"},
			}),
			m("div.col.s12.m8", 
				m("table", [
					m("thead", 
						m("tr", [m("th", "From"), m("th", "To"), m("th", "Amount")])
					),
					m("tbody", tableBodyRows),
					m("tfoot", 
						m("tr", [
							m("th", {colspan: 2}, "Total"),
							m("td", Object.entries(totalCounts).map(function([currencyId, money]) {return Model.formatMoneyAmount(money, currencyId)}).join(" "))
						])
					)
				])
			)
		]);
	}
};