// Mithril Component imports
const m = require("mithril")
const HighchartsContainer = require("../components/HighchartsContainer")
const TransactionList = require("../components/TransactionList")
const WalletChip = require("../components/WalletChip.jsx")

// PocketBase API imports
const Budget = require("../models/Budget")
const Currency = require("../models/Currency")
const Util = require("../models/index")

// Other utility imports
const dayjs = require("../dayjs-lib")


/** Names for status constants for AJAX request */
const WAITING = 2,
READY = 3,
ERROR = 4;

/**
 * This page shows a line chart and a TransactionList.
 * 
 * Attributes:
 * budget_id = the ID for a budget
 */
module.exports = function() {
	let status = WAITING;
	let budget = null;
	let transactions = [];
	let chartSeriesData = [];

	return {
		oninit: function(vnode) {
			status = WAITING;
			budget = Budget.getById(vnode.attrs.budget_id); // expand budget_id attribute into a Budget model
			// TODO: redirect to 404 page if budget is undefined
			if (budget == null || !budget) {
				console.log("Budget is null", budget);
				status = ERROR;
				return;
			}
			// get transactions for budget, asynchronous
			Budget.getTransactions(budget).then(function(response) {
				status = READY;
				transactions = response;
				chartSeriesData = transactions.sort(function(transactionA, transactionB) {
					let a = dayjs(transactionA.date), b = dayjs(transactionB.date);
					if (a.isBefore(b)) return -1;
					else if (b.isBefore(a)) return 1;
					return 0;
				})
				.reduce(function(cummulativeSum, transaction) {
					let sum = cummulativeSum.length > 0? cummulativeSum[cummulativeSum.length-1][1] : 0;
					cummulativeSum.push([dayjs(transaction.date).valueOf(), transaction.money + sum]);
					return cummulativeSum;
				}, []);
			})
			.catch(function(error) {
				console.log("error fetching budget", error);
				status = ERROR;
			})
			.finally(m.redraw);
		},
		view: function() {
			if (status == WAITING) {
				return m("div", "Loading...");
			}
			else if (status == READY) {
				// this initialization can be moved to component's oninit() lifecycle for performance
				const chartOptions = {
					chart: {
						type: "line",
					},
					credits: {
						enabled: false,
					},
					legend: {
						enabled: false,
					},
					series: [
						{
							name: Util.budgetName(budget),
							data: chartSeriesData,
							step: "left", // to show a horizontal and then vertical line between points; data is discrete not continuous
						}
					],
					title: {
						text: "Progress Towards Budget Goal",
						align: "left"
					},
					tooltip: {
						shared: true,
						xDateFormat: "%Y-%m-%d", //format the tooltip date
						pointFormatter: function() {
							return this.series.name + ": <b>" + Util.formatMoneyAmount(Math.abs(this.y), Currency.getById(budget.currency)) + "</b><br/>";
						},
					},
					xAxis: {
						type: "datetime",
					},
					yAxis: {
						title: {
							text: Currency.getById(budget.currency).name
						},
						labels: {
							formatter: function() {
								return Util.formatMoneyAmount(Math.abs(this.value), Currency.getById(budget.currency));
							}
						},
						// horizontal line at the budget's limit
						plotLines: [{
							color: "#ef5350",
							dashStyle: "Dash",
							label: {
								text: "Goal",
							},
							width: 2,
							value: budget.money,
						}],
					},
				};

				return (
					<div>
						<h4>From {dayjs(budget.start_date).formatDate()} to {dayjs(budget.end_date).formatDate()}</h4>
						{budget.wallets.map(walletId => (<WalletChip id={walletId} />))}
						<HighchartsContainer chartOptions={chartOptions} allowChartUpdate={false} />
						<TransactionList transactions={transactions} />
					</div>
				);
			}
			else {
				return m("div", "Error");
			}
		}
	}
}