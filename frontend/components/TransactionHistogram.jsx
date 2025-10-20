const m = require("mithril")
// Mithril component imports
const CategoryPicker = require("./CategoryPicker")
const HighchartsContainer = require("./HighchartsContainer")
const {Button, ModalPanel} = require("mithril-materialized")

// Data model imports
const Category = require("../models/Category")
const Currency = require("../models/Currency")
const Transaction = require("../models/Transaction")
const Model = require("../models/index")

// data manipulation imports
const Util = require("../util/index")



/**
 * Calculates the ideal bin width for a histogram chart. There will be at least
 * 10 bins, so the user can notice trends (too few bins are hard to read). The
 * bins will also fall on natural boundaries, prefering multiples of 10 and 5.
 * 
 * @param transactions  the list of Transaction objects to base calculations on
 * @return  a positive integer, in money units, of the ideal bin width
 */
const calculateBinWidth = function(transactions) {
	let min = -1, max = 0;
	for(let i = 0; i < transactions.length; i++) {
		if(min == -1 || transactions[i].money < min)
			min = transactions[i].money;
		if(transactions[i].money > max)
			max = transactions[i].money;
	}
	let range = max - min;
	let binWidth = Math.pow(10, Math.floor(Math.log10(range))); // find the largest power of 10 that's smaller than range (ex: if range=600, then breakpoint=100)
	let binsNumber = Math.ceil(range / binWidth);
	while(binsNumber < 10) {
		binWidth = binWidth % 2 == 0? (binWidth / 2) : Math.pow(10, Math.floor(Math.log10(binWidth)));
		binsNumber = Math.ceil(range / binWidth);
	}

	return binWidth;
}

/**
 * Converts a list of transactions into a list of histogram chart points. The
 * transactions are grouped by their money value into buckets defined by
 * binWidth. For example, if binWidth=10, then the buckets would be:
 *   bucket 0: $0 to $10
 *   bucket 1: $10 to $20
 *   bucket 2: $20 to $30
 * 
 * @param transactions  list of Transaction objects
 * @param binWidth  positive integer
 * @return  a Highcharts series data. It is a list of points. Each point is a
 * list of two numbers: the first is the minimum of the bucket's range, in money,
 * and the second is the number of transactions that are in that bucket (y).
 */
const groupTransactions = function(transactions, binWidth) {
	return Util.groupBy(
		transactions, 
		[
			(transaction) => (binWidth * Math.floor(transaction.money / binWidth))|0
		],
		(binMin, transactionsInBin) => {
			return [parseInt(binMin[0]), transactionsInBin.length]
		});
}

/**
 * Creates the series and xAxis arrays for the Highcharts chart. The parameter
 * transactions should be filtered for relevant categories.
 * 
 * @param transactions  list of Transaction objects.
 * @return  an object with two arrays: series and xAxis
 */
const createSeriesAndAxis = function(transactions) {
	let allSeries = [];

	let allXAxis = Util.groupBy(
		transactions,
		[
			(transaction) => Model.getCurrencyOfTransaction(transaction).id,
		],
		(groups, itemsWithThisCurrency) => {
			const binWidth = calculateBinWidth(itemsWithThisCurrency);
			const currencyId = groups[0];

			// take advantage of the fact that the data is already grouped by currency to create series
			allSeries = allSeries.concat(Util.groupBy(
				itemsWithThisCurrency,
				["category"],
				(category, itemsWithThisCategory) => {
					return {
						data: groupTransactions(itemsWithThisCategory, binWidth),
						id: category[0] + currencyId,
						name: Category.getById(category[0]).name + " (" + Currency.getById(currencyId).name + ")",
						type: "column",
						opacity: 0.75,
						pointRange: binWidth,
						tooltip: {
							headerFormat: "{series.name}<br/>",
							pointFormatter: function() {
								return '<span style="color:' + this.color + '">•</span> ' + Model.formatMoneyAmount(parseInt(this.x), currencyId) + " to " + Model.formatMoneyAmount(parseInt(this.x) + binWidth, currencyId) + " : " + this.y + " transactions";
							},
						},
						xAxis: currencyId,
					};
				}
			));

			// create xAxis object, to be included in the array
			return {
				id: currencyId,
				min: 0,
				labels: {
					enabled: true,
					formatter: function() {
						return Model.formatMoneyAmount(parseInt(this.value), currencyId);
					},
				},
				startOnTick: true,
				tickInterval: binWidth,
				title: { text: Currency.getById(currencyId).name },
			};
		}
	);

	return {
		series: allSeries,
		xAxis: allXAxis,
	};
}

/**
 * This component is implemented as POJO. The state is used to cache computationally
 * expensive data for Highcharts. The component renders a div with a chart and a
 * button. The chart is a histogram of transactions grouped by their money value.
 * The button opens a modal with a category picker, which is used to add a series
 * to the chart. Each category is a series. Multiple can be shown. Works with
 * multiple currencies.
 * 
 * Attributes:
 * @attribute data  a list of Transaction objects
 */
module.exports = {
	oninit: function(vnode) {
		vnode.state.series = [];
		vnode.state.xAxis = [];
		vnode.state.transactions = [];
		vnode.state.categories = [];
		vnode.state.modalOpen = false;
	},
	view: function(vnode) {
		if(vnode.state.transactions != vnode.attrs.data) {
			vnode.state.transactions = vnode.attrs.data;
			const calculated = createSeriesAndAxis(vnode.state.transactions.filter(transaction => vnode.state.categories.indexOf(transaction.category) != -1));
			vnode.state.series = calculated.series;
			vnode.state.xAxis = calculated.xAxis;
		}

		return m("div.card-panel", [
			m(HighchartsContainer, {
				chartOptions: {
					credits: {
						enabled: false,
					},
					plotOptions: {
						column: {
							pointPadding: 0, // make column chart look like a histogram
					        borderWidth: 0, // make column chart look like a histogram
					        groupPadding: 0, // make column chart look like a histogram
					        shadow: false, // make column chart look like a histogram
					        pointPlacement: "between", // histogram columns should be between tick marks for readability
						},
					},
					series: vnode.state.series,
					title: {
						text: "Transaction Distribution",
					},
					subtitle: {
						text: "Histogram of the value of each transaction. Use the button below to toggle which categories are shown.",
						align: "center",
					},
					xAxis: vnode.state.xAxis,
					yAxis: {
						title: {text: "Frequency"}
					}
				},
				allowChartUpdate: true,
			}),
			m(Button, {
				label: "Add category",
				onclick: () => {vnode.state.modalOpen = true;},
			}),

			m(ModalPanel, {
				title: "Select categories to show in chart",
				description: m("div", [
					m(CategoryPicker, {
						multiple: true,
						showMetaCategories: false,
						selectedIds: vnode.state.categories,
						onselection: (selectedIds) => {
							if(selectedIds.length > 0) vnode.state.categories = selectedIds;
						}
					}),
				]),
				isOpen: vnode.state.modalOpen,
				onToggle: open => {
					vnode.state.modalOpen = open; 
				},
				buttons: [
					{
						label: "Add",
						onclick: () => { // updated series and axes when new categories are added to the chart
							const calculated = createSeriesAndAxis(vnode.state.transactions.filter(transaction => vnode.state.categories.indexOf(transaction.category) != -1));
							vnode.state.series = calculated.series;
							vnode.state.xAxis = calculated.xAxis;
						},
					}
				],
			}),
		]);
	},
};