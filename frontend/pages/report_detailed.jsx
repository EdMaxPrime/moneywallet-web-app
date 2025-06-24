const m = require("mithril")
// Mithril component imports
const HighchartsContainer = require("../components/HighchartsContainer")

// Data model imports
const Category = require("../models/Category")
const Currency = require("../models/Currency")
const Report = require("../models/Report")
const Util = require("../models/index")

// Utility imports
const dayjs = require("../dayjs-lib")
const util = require("../util")


/** Names for status constants for AJAX request */
const WAITING = 2, 
READY = 3, 
ERROR = 4
ERROR_PARAMETERS = 5;

/**
 * Creates the data structure for Highcharts pie chart. The main pie chart
 * will only include parent categories (value is sum of child categories).
 * When the user clicks on a slice, they will drill down to another pie chart
 * that only shows child categories of that slice, revealing more detail.
 * @param title  the bolded title above the chart
 * @param data   list of points with two properties: name (string) and y (number).
 *               also include "moneyWalletCategoryId" so that a drilldown
 *               pie chart can be generated.
 * @param currencyId  this identifier instructs the tooltip formatter how to
 *                    show currency-specific numbers
 * @return  object
 */
const createPieChartOptions = function(title, data, currencyId) {
	return {
		chart: {
			type: "pie",
		},
		credits: {
			enabled: false,
		},
		drilldown: {
			series: util.groupBy(
				data,
				[
					pieSlice => Category.getParent(pieSlice.moneyWalletCategoryId)
				],
				function(groupNames, recordsInGroup) {
					return {
						data: recordsInGroup.map(
							childCategoryPieSlice => [childCategoryPieSlice.name, childCategoryPieSlice.y]
						),
						id: groupNames[0],
						name: Category.getById(groupNames[0]).name,
					};
				}
			),
		},
		plotOptions: {
			series: {
				allowPointSelect: true,
				cursor: "pointer",
				dataLabels: [{
	                enabled: true,
	                distance: 20
	            }, {
	                enabled: true,
	                distance: -40,
	                format: '{point.percentage:.1f}%',
	                style: {
	                    fontSize: '1.2em',
	                    textOutline: 'none',
	                    opacity: 0.7
	                },
	                filter: {
	                    operator: '>',
	                    property: 'percentage',
	                    value: 10
	                }
	            }]
			},
		},
		series: [
			{
				name: "Percentage",
				colorByPoint: true,
				data: util.groupBy(
					data,
					[
						pieSlice => Category.getParent(pieSlice.moneyWalletCategoryId)
					],
					function(groupNames, recordsInGroup) {
						return {
							drilldown: groupNames[0],
							name: Category.getById(groupNames[0]).name,
							y: recordsInGroup.reduce(
								(partialSum, current) => partialSum + current.y,
								0),
						};
					}
				).sort(function(a, b) { // sort big pie slices from largest to smallest
					return a.y - b.y;
				}),
			}
		],
		subtitle: {
			text: "Only parent categories are shown, and they include the sum of child categories",
		},
		title: {
			text: title,
		},
		tooltip: {
			pointFormatter: function() {
				return "Money: <b>" + Util.formatMoneyAmount(Math.abs(this.y), Currency.getById(currencyId)) + "</b><br/>Percentage: <b>" + this.percentage.toFixed(1) + "%</b>";
			},
		},
	};
};

module.exports = function(initialVnode) {
	// any variables declared here are part of the component's state
	// all code executed before the return statement happens once when it is created (not on recycle)
	let status = WAITING; // status of network request
	let message = "";

	let categoryPieCharts = []; //holds rows of data structured as {currencyName, expensePieChartOptions, incomePieChartOptions}


	// Fetch data from API
	let startDate = dayjs(initialVnode.attrs.startDate, "YYYY-MM-DD");
	let endDate = dayjs(initialVnode.attrs.endDate, "YYYY-MM-DD");

	if (startDate.isValid() && endDate.isValid() && startDate.isBefore(endDate)) {
		Report.getMoneyPerCategory(initialVnode.attrs.startDate, initialVnode.attrs.endDate)
			.then(data => {
				// sort data into groups by currency, then category, and transform it into HighCharts pie chart format
				categoryPieCharts = util.groupBy(
					data, 
					["currencyId"], 
					function(groupNames, recordsInGroup) {

						// this will be the item in categoryPieCharts list, used to draw the UI in a loop
						let categoryPieChartsRow = {
							currencyName: Currency.getById(groupNames[0]).name,
						};

						// TODO: use Category.getParent() to group expense categories by parent and create a drilldown series
						// create data structure for expense category pie chart
						let expenseData = recordsInGroup.filter(
								item => Category.getDirection(item.categoryId) == Category.DIRECTION_EXPENSE
							).map(
								item => {
									return {
										moneyWalletCategoryId: item.categoryId,
										name: Category.getById(item.categoryId).name,
										y: item.money,
									}
								}
							);
						categoryPieChartsRow.expensePieChartOptions = createPieChartOptions("Expenses by Category", expenseData, groupNames[0]);

						// create data structure for income category pie chart
						let incomeData = recordsInGroup.filter(
								item => Category.getDirection(item.categoryId) == Category.DIRECTION_INCOME
							).map(
								item => {
									return {
										moneyWalletCategoryId: item.categoryId,
										name: Category.getById(item.categoryId).name,
										y: item.money,
									}
								}
							)
						categoryPieChartsRow.incomePieChartOptions = createPieChartOptions("Income by Category", incomeData, groupNames[0]);

						return categoryPieChartsRow;
					});

				status = READY;
			})
			.catch(error => {
				status = ERROR;
				message = JSON.stringify(error.response);
			})
			.finally(m.redraw)
	} else {
		status = ERROR_PARAMETERS;
	}



	return {
		view: function(vnode) {
			if (status == READY) {
				return categoryPieCharts.map(categoryPieChartsRow => (
					<div class="row" key={categoryPieChartsRow.currencyName}>
						<h3 class="col s12">{categoryPieChartsRow.currencyName}</h3>
						<div class="col s12 m6">
							<HighchartsContainer
								chartOptions={categoryPieChartsRow.expensePieChartOptions}
								allowChartUpdate={false} />
						</div>
						<div class="col s12 m6">
							<HighchartsContainer
								chartOptions={categoryPieChartsRow.incomePieChartOptions}
								allowChartUpdate={false} />
						</div>
					</div>
				));
			}
			else if (status == WAITING) {
				return (
					<p>Generating report...</p>
				);
			}
			else if (status == ERROR) {
				return (
					<div class="red lighten-3">
						<h3>Failed to generate report</h3>
						<p>Please check your internet connection and reload the page. Otherwise, our servers may be having difficulty.</p>
					</div>
				);
			}
			else if (status == ERROR_PARAMETERS) {
				return (
					<div class="red lighten-3">
						<h3>Failed to generate report</h3>
						<p>Please format dates correctly.</p>
					</div>
				);
			}
		}
	};
}