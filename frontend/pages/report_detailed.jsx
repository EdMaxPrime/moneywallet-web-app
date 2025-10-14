const m = require("mithril")
// Mithril component imports
const CategoryPieChart = require("../components/CategoryPieChart")
const TransactionHistogram = require("../components/TransactionHistogram")

// Data model imports
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

	let dataForChart = []; // holds API response to feed to the charts

	// Fetch data from API
	let startDate = dayjs(initialVnode.attrs.startDate, "YYYY-MM-DD");
	let endDate = dayjs(initialVnode.attrs.endDate, "YYYY-MM-DD");

	if (startDate.isValid() && endDate.isValid() && startDate.isBefore(endDate)) {
		Report.getMoneyPerCategory(initialVnode.attrs.startDate, initialVnode.attrs.endDate)
			.then(data => {
				dataForChart = data;
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
				return (<div>
					<section>
						<m.route.Link class="btn" href="/report/categories" params={{
							startDate: startDate.subtract(1, 'month').format('YYYY-MM-DD'),
							endDate: endDate.subtract(1, 'month').format('YYYY-MM-DD'),
							key: startDate.subtract(1, 'month').format('YYYY-MM-DD') + endDate.subtract(1, 'month').format('YYYY-MM-DD')
						}}>Previous Month</m.route.Link>
						<m.route.Link class="btn" href="/report/categories" params={{
							startDate: startDate.add(1, 'month').format('YYYY-MM-DD'),
							endDate: endDate.add(1, 'month').format('YYYY-MM-DD'),
							key: startDate.subtract(1, 'month').format('YYYY-MM-DD') + endDate.subtract(1, 'month').format('YYYY-MM-DD')
						}}>Next Month</m.route.Link>
					</section>
					<CategoryPieChart data={dataForChart} />
				</div>);
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