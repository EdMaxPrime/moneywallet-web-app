const m = require("mithril")
// Mithril component imports
const HighchartsContainer = require("../components/HighchartsContainer")

// Data model imports
const Category = require("../models/Category")
const Report = require("../models/Report")

// Utility imports
const dayjs = require("../dayjs-lib")


/** Names for status constants for AJAX request */
const WAITING = 2, 
READY = 3, 
ERROR = 4
ERROR_PARAMETERS = 5;

module.exports = function(initialVnode) {
	// any variables declared here are part of the component's state
	// all code executed before the return statement happens once when it is created (not on recycle)
	let status = WAITING; // status of network request
	let message = "";

	let expensePieChartOptions = {
		chart: {
			type: "pie",
		},
		credits: {
			enabled: false,
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
				data: [],
			}
		],
		subtitle: {
			text: "Only parent categories are shown, and they include the sum of child categories",
		},
		title: {
			text: "Expenses by Category",
		},
		tooltip: {
			valuePrefix: "$",
		},
	};

	let incomePieChartOptions = {
		chart: {
			type: "pie",
		},
		credits: {
			enabled: false,
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
				data: [],
			}
		],
		subtitle: {
			text: "Only parent categories are shown, and they include the sum of child categories",
		},
		title: {
			text: "Income by Category",
		},
		tooltip: {
			valuePrefix: "$",
		},
	};

	// Fetch data from API
	let startDate = dayjs(initialVnode.attrs.startDate, "YYYY-MM-DD");
	let endDate = dayjs(initialVnode.attrs.endDate, "YYYY-MM-DD");

	if (startDate.isValid() && endDate.isValid() && startDate.isBefore(endDate)) {
		Report.getMoneyPerCategory(initialVnode.attrs.startDate, initialVnode.attrs.endDate)
			.then(data => {
				// ignore currencies for now
				let expenseData = data.filter(
						item => Category.getDirection(item.categoryId) == Category.DIRECTION_EXPENSE
					).map(
						item => {
							return {
								name: Category.getById(item.categoryId).name,
								y: item.money,
							}
						}
					).sort(function(a, b) {
						return a.y - b.y;
					});
				expensePieChartOptions.series[0].data = expenseData;

				let incomeData = data.filter(
						item => Category.getDirection(item.categoryId) == Category.DIRECTION_INCOME
					).map(
						item => {
							return {
								name: Category.getById(item.categoryId).name,
								y: item.money,
							}
						}
					).sort(function(a, b) {
						return a.y - b.y;
					});
				incomePieChartOptions.series[0].data = incomeData;

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
				return (
					<div class="row">
						<div class="col s12 m6">
							<HighchartsContainer 
								chartOptions={expensePieChartOptions} 
								allowChartUpdate={false} />
						</div>
						<div class="col s12 m6">
							<HighchartsContainer 
								chartOptions={incomePieChartOptions} 
								allowChartUpdate={false} />
						</div>
					</div>
				);
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