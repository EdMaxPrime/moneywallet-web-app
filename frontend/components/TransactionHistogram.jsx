const m = require("mithril")
// Mithril component imports
const HighchartsContainer = require("../components/HighchartsContainer")

// Data model imports
const Category = require("../models/Category")
const Transaction = require("../models/Transaction")
const Util = require("../models/index")


/** Names for status constants for AJAX request */
const WAITING = 2, 
READY = 3, 
ERROR = 4;



/**
 * Displays a histogram, which groups transactions into buckets based on the
 * money amount.
 * 
 * Attributes:
 * @attribute startDate  the start of the date range to filter data. String
 * formatted as YYYY-MM-DD
 * @attribute startDate  the end of the date range to filter data. String
 * formatted as YYYY-MM-DD
 */
module.exports = function(initialVnode) {
	// any variables declared here are part of the component's state
	// all code executed before the return statement happens once when it is created (not on recycle)
	let status = WAITING; // status of network request
	let message = "";

	let amounts = [];

	Transaction.getByDates(initialVnode.attrs.startDate, initialVnode.attrs.endDate).then(function(data) {
		amounts = data.filter(t => t.direction === false).map(t => t.money);
		status = READY;
	})
	.catch(function(error) {
		status = ERROR;
	})
	.finally(m.redraw);

	return {
		view: function(vnode) {
			if (status == READY) {
				return (<div>
					<HighchartsContainer 
						chartOptions={{
							credits: {
								enabled: false,
							},
							legend: {
								enabled: false,
							},
							title: {
								text: "Transaction Value Frequency",
							},
							xAxis: [{
								title: { text: 'Money' },
								alignTicks: false,
								formatter: function() {
									return Util.formatMoneyAmount(parseInt(this.value), "lv25l90oi4x8sz3")
								},
							}, {
								visible: false,
							}],

							yAxis: [{
								title: { text: 'Data' }
							}, {
								title: { text: 'Histogram' },
								opposite: true
							}],

							plotOptions: {
								histogram: {
									accessibility: {
										point: {
											valueDescriptionFormat: '{index}. {point.x:.3f} to {point.x2:.3f}, {point.y}.'
										}
									}
								}
							},

							tooltip: {
								formatter: function(point) {
									return Util.formatMoneyAmount(parseInt(this.point.x), "lv25l90oi4x8sz3") + " to " + Util.formatMoneyAmount(parseInt(this.point.x2), "lv25l90oi4x8sz3") + " : " + this.y + " transactions";
								},
							},

							series: [{
								name: 'Histogram',
								type: 'histogram',
								xAxis: 1,
								yAxis: 1,
								baseSeries: 's1',
								zIndex: -1,
								binWidth: 10000
							}, {
								name: 'Data',
								type: 'scatter',
								data: amounts,
								id: 's1',
								marker: {
									radius: 1.5
								},
								visible: false,
							}]
							}}
						allowChartUpdate={false} />
					</div>);
			}
			else if (status == WAITING) {
				return (
					<p>Generating chart...</p>
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
		}
	};
}