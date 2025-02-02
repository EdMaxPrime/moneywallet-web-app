const m = require("mithril")

// Presentation layer imports
const HighchartsContainer = require("../components/HighchartsContainer")

// Data layer imports
const Report = require("../models/Report")



// status enum for the data request
const WAITING = 1, READY = 2, ERROR = 3;

// Page as a Mithril component
module.exports = function() {

	// Page state variables

	let status = WAITING; // the status of the data from the API
	
	const transferChartOptions = { // configuration (not data) for the chart
		title: {
			text: "Volume of transfers between wallets"
		},

		series: [{
			keys: ["from", "to", "weight"],
			type: "arcdiagram",
			name: "Transfers",
			// linkWeight: 1,
			centeredLinks: false,
			dataLabels: {
				rotation: 90,
				y: 30,
				verticalAlign: "top",
				color: "black",
				padding: 0,
			},
			nodeWidth: "auto",
			nodeDistance: "100%",
			// offset: "65%",
			data: [],
		}],
	};

	// Mithril

	return {
		oninit: function(vnode) {
			status = WAITING;
			Report.getTransferTotals().then(function(data) {
				transferChartOptions.series[0].data = data;
				status = READY;
			})
			.catch(function(error) {
				status = ERROR;
			})
			.finally(m.redraw)
		},
		view: function(vnode) {
			if(status == WAITING) {
				return (<span>Loading...</span>);
			}
			else if(status == ERROR) {
				return (<div>Error loading the data for this report</div>);
			}

			return (<div>
				<h3 class="section">Transfer Report</h3>
				<HighchartsContainer chartOptions={transferChartOptions} />
			</div>)
		}
	};
}