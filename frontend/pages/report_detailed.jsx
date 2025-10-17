const m = require("mithril")
// Mithril component imports
const DataProvider = require("../components/DataProvider")
const CategoryPieChart = require("../components/CategoryPieChart")
const TransactionHistogram = require("../components/TransactionHistogram")

// Data model imports
const Report = require("../models/Report")

// Utility imports
const dayjs = require("../dayjs-lib")


/**
 * This component renders some controls to adjust the date range, and some charts
 * whose data falls within the date range
 */
module.exports = function(initialVnode) {
	/**
	 * Fetches data for CategoryPieChart
	 * 
	 * @param filter  an object with this structure:
	 * startDate: a string with a date formatted "YYYY-MM-DD", must be before endDate
	 * endDate: a string with a date formatted "YYYY-MM-DD"
	 * @return Promise that resolves to an array of data or rejects with an error message
	 */
	const getCategoryData = (filter) => {
		return Report.getMoneyPerCategory(initialVnode.attrs.startDate, initialVnode.attrs.endDate);
	}



	return {
		view: function(vnode) {
			let startDate = dayjs(vnode.attrs.startDate, "YYYY-MM-DD");
			let endDate = dayjs(vnode.attrs.endDate, "YYYY-MM-DD");
			if (startDate.isValid() && endDate.isValid() && startDate.isBefore(endDate)) {
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
					<DataProvider fetch={getCategoryData} filter={vnode.attrs}>
						<CategoryPieChart />
					</DataProvider>
				</div>);
			} else {
				return (<div class="red lighten-3">
					<h3>Failed to generate report</h3>
					<p>Please format the dates in the URL correctly. The query parameters startDate and endDate must be in YYYY-MM-DD format, and startDate must be before endDate.</p>
				</div>);
			}
		}
	};
}