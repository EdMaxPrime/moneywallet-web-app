const m = require("mithril")
const HighchartsContainer = require("../components/HighchartsContainer")

const Currency = require("../models/Currency")
const Report = require("../models/Report")
const Util = require("../models/index")
const Wallet = require("../models/Wallet")

const dayjs = require("../dayjs-lib")



// status enum for the data request
const WAITING = 1, READY = 2, ERROR = 3;

/**
 * This component renders a chart and a table. The chart has one series for
 * each currency in the dataset. It is an area line chart showing the balance.
 * 
 * Attributes:
 * @attribute grouping  one of daily|week|biweekly|month|quarter|year
 * @attribute filters  filters for the chart, should be an object with
 *   startDate: dayjs instance
 *   endDate: dayjs instance
 *   wallets: a wallet id or "Total"
 */

module.exports = function(initialVnode) {
	// component state
	// true for 1 render cycle when data is updated due to filters
	let allowChartUpdate = false;

	// async fetch status
	let status = WAITING;

	// data for net worth chart
	let netWorthData = [];

	// filters for reports
	let filters = Object.assign({startDate: null, endDate: null, wallets: "Total"}, initialVnode.attrs.filters);
	let startDate = dayjs("2024-01-01 00:00"); //only include transactions within the date range
	let endDate = dayjs("2024-05-01 00:00");
	let event = null; // only include transactions matching the event, unless event=null
	let grouping = "month"; // create groups for this time period by summing
	let categories = []; // only include transactions from these categories
	let wallets = "Total"; // only include transactions for this wallet

	// configuration for the Net Worth chart
	const netWorthOptions = {
		chart: {
			events: {
				/**
				 * This event is fired by Highcharts after the user requests a
				 * table to be generated for the chart, but before insertion
				 * into the DOM. The event object contains the DOM tree for the
				 * table. This function can modify cell contents to format 
				 * currency amounts correctly.
				 */
				afterGetTableAST: function(e) {
					// go down the dom heirarchy: e.tree = <table>, e.tree.children = [<caption>, <thead>, <tbody>], e.tree.children[2].children = [<tr>]
					// for each row in the table body, format the second cell as currency
					e.tree.children[2].children.forEach(function(row) {
						try {
							// create link to deep dive report for this period
							let dateCell = row.children[0];
							let startDate = dayjs(dateCell.textContent, "YYYY-MM-DD hh:mm:ss");
							let endDate = startDate.mwEndOf(grouping);
							dateCell.children = [
								{
									tagName: "a",
									attributes: {
										href: m.route.prefix + "/report/categories?startDate=" + startDate.format("YYYY-MM-DD") + "&endDate=" + endDate.format("YYYY-MM-DD")
									},
									textContent: startDate.formatDate() + " - " + endDate.formatDate(),
								}
							];
							delete dateCell.textContent; //get rid of Highcharts generated timestamp

							// format currency amounts
							for(let i = 1; i < row.children.length; i++) {
								let moneyCell = row.children[i];
								let moneyAsInteger = parseInt(moneyCell.textContent.replace(/\D/g, ""));
								moneyCell.textContent = Util.formatMoneyAmount(Math.abs(moneyAsInteger), Currency.getByISO(e.tree.children[1].children[0].children[i].textContent));
							}
						} 
						catch(e) {} // ignore parse errors
					});
				},
			},
			type: "area",
		},
		credits: {
			enabled: false
		},
		exporting: {
			showTable: true,
			csv: {
				dateFormat: "%Y-%m-%d %H:%M:%S",
			},
		},
		legend: {
			layout: "horizontal",
			align: "right",
			verticalAlign: "middle",
		},
		plotOptions: {
			area: {
				marker: {
					enabled: false,
					states: {
						hover: {
							enabled: true
						},
					},
				},
			},
		},
		xAxis: {
			labels: {
				format: "{value:%b %Y}",
			},
			type: "datetime",
		},
		title: {
			text: "Net Worth",
			align: "left"
		},
		tooltip: {
			shared: true,
			xDateFormat: "%Y-%m-%d", //format the tooltip date
			pointFormatter: function() {
				return this.series.name + ": <b>" + Util.formatMoneyAmount(Math.abs(this.y), Currency.getByISO(this.series.name)) + "</b><br/>";
			},
		},
	};

	/**
	 * Some series don't have data points at the end. This will add a data point
	 * for this series to make it look like a flat line to the maximum end of the
	 * X axis. If the series already extends to the end of the X axis, or if it
	 * is empty, then nothing is changed.
	 * @param series  a Highcharts Series of data
	 * @param axis  the Highcharts X axis for the series (every series has one)
	 */
	const extendData = function(series, axis) {
	  	let ext = axis.getExtremes();
	    let x   = ext.dataMax;
	    if(series.data.length > 0 && x > series.data[series.data.length - 1].x) {
		    let y   = series.data[series.data.length - 1].y;
		  	series.addPoint({'x':x, 'y':y});
		}
	}

	/**
	 * Callback function when the Net Worth chart is rendered. This will extend
	 * all currency series to the maximum end of the X axis, in case they don't
	 * have data for the last date. This is because the balance should stay the
	 * same. This must be called after the chart is rendered to determine the X
	 * axis extreme
	 */
	const extendNetWorthChart = function(chart) {
		chart.series.forEach(series => extendData(series, chart.xAxis[0]));
	}

	/**
	 * Fetches data for the net worth chart and prepares the chart options. This
	 * should be called in the oninit() and onupdate() lifecycle methods when
	 * new data is needed because the chart filter configuration changed. The
	 * promise is resolved when the chart is ready to render
	 * @return Promise with no data
	 */
	const fetchData = function() {
		return Report.getNetWorth(filters.wallets)
		.then(function(data) {
			status = READY;
			netWorthData = data; // backup data
			// get all currencies in response
			const currenciesSet = new Set(data.map(row => 
				Wallet.getById(row.wallets).currency
			));
			// insert axes into chart
			netWorthOptions.yAxis = [];
			netWorthOptions.series = [];
			let currencyIterator = 0; //integer that increments with each loop iteration
			currenciesSet.forEach(currency => {
				// generate yAxis array based on currencies
				netWorthOptions.yAxis.push({
					title: {
						text: Currency.getById(currency).name
					},
					labels: {
						formatter: function() {
							return Util.formatMoneyAmount(Math.abs(this.value), Currency.getById(currency));
						}
					},
					opposite: currencyIterator % 2 == 1 // switch left and right sides on every other currency
				});
				// for each series, determined by list of currency IDs, assign the right yAxis
				netWorthOptions.series.push({
					name: Currency.getById(currency).iso, //name is ISO to allow for tooltip formatting to know the currency
					yAxis: currencyIterator,
				})
				currencyIterator++;
			});
			// insert data into chart
			applyFilters();
		}).catch(function(error) {
			console.log(error);
			status = ERROR;
		})
	};

	/*
	group by time period, wallet -> list of {startDate, endDate, walletId, currencyId, balance: latest point}
	filter relevant wallets?
	group by currency -> list of {startDate, endDate, currencyId, balance}

	*/

	/**
	 * Filter, reduce and map the raw request data into a format suitable for
	 * Highcharts. This should be called before the chart is created and before
	 * each update.
	 */
	const applyFilters = function() {
		for(let i = 0; i < netWorthOptions.series.length; i++) {
			/*
			assume list is sorted by date
			for each series/currency:
				get list of included wallets
				balances = dictionary where keys are wallets and values are balances, initially wallet.startBalance
				for each group:
					for each wallet:
						balances.wallet = data.findLatest(groupDayStart, groupDayEnd, wallet).balance
						if not found, do nothing, keep past data
					add Highcharts point with x=startOf(group), y=sum(balances)
			*/
			// this is a Map where keys are wallet.id and values are balances
			walletBalances = {};
			// build above Map by finding wallets included in the report and 
			// using this series' currency
			for(let walletIndex = 0; walletIndex < Wallet.list.length; walletIndex++) {
				if(Wallet.list[walletIndex].expand.currency.iso == netWorthOptions.series[i].name) {
					walletBalances[ Wallet.list[walletIndex].id ] = Wallet.list[walletIndex].start_money;
				}
			}

			// delete previous points
			netWorthOptions.series[i].data = [];

			// for each group (loop through groups to avoid missing days that have no data)
			let dataIndex = 0;
			for(let groupIterator = filters.startDate.mwStartOf(grouping); groupIterator.isBefore(filters.endDate.mwEndOf(grouping)); grouping == "biweekly"? groupIterator = groupIterator.add(2, "week") : groupIterator = groupIterator.add(1, grouping)) {
				// all transactions in this group are between groupIterator and groupEnd
				const groupEnd = groupIterator.mwEndOf(grouping);
				
				// loop through all netWorth data (one row per day)
				while(dataIndex < netWorthData.length) {
					if(groupIterator.isBefore(netWorthData[dataIndex].date, "day")) { // no more data to add to point for this group
						break;
					}
					// replace latest data in point
					if(!groupEnd.isBefore(netWorthData[dataIndex].date, "day") && netWorthData[dataIndex].wallets in walletBalances) {
						walletBalances[ netWorthData[dataIndex].wallets ] = netWorthData[dataIndex].balance;
					}
					// this also has the effect of skipping past rows before the startDate
					dataIndex++;
				}

				// calculate point's Y value as sum of wallet balances
				let pointValue = 0;
				for(walletId in walletBalances) {
					pointValue += walletBalances[walletId];
				}

				// add Highcharts point
				netWorthOptions.series[i].data.push([groupIterator.valueOf(), pointValue]);
			}
		}
	}

	return {
		oninit: function(vnode) {
			allowChartUpdate = true;
			fetchData().finally(m.redraw);
		},
		onupdate: function(vnode) {
			if(vnode.attrs.filters.wallets != filters.wallets ||
				!vnode.attrs.filters.startDate.isSame(filters.startDate, "day") ||
				!vnode.attrs.filters.endDate.isSame(filters.endDate, "day") ||
				vnode.attrs.grouping != grouping
				) {
				filters = vnode.attrs.filters;
				grouping = vnode.attrs.grouping;
				applyFilters();
				allowChartUpdate=true;
			} else {
				allowChartUpdate = false;
			}
		},
		view: function() {
			return m(HighchartsContainer, {
				chartOptions: netWorthOptions,
				chartCreatedCallback: extendNetWorthChart,
				allowChartUpdate: allowChartUpdate,
			});
		}
	};
}