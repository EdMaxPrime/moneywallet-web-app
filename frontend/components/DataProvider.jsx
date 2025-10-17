const m = require("mithril")

const Util = require("../util/index")


/* Constants to represent the status of the data fetching asynchronous task */
const WAITING = 1, READY = 2, ERROR = 3;

/**
 * This component handles the logic of fetching data, detecting changes in filter
 * arguments, and re-loading data. It should be wrapped around a chart. The
 * child chart component will be provided a "data" attribute when it is ready.
 * Loading and error states render a message to the user.
 * 
 * Attributes:
 * @attribute fetch  a function which accepts one argument, the filter, and
 * returns a promise which resolves to data for the child component.
 * @attribute filter  an argument for the fetch function. When there are
 * changes in this attribute (shallow equality check), the fetch function
 * will be called again.
 */
module.exports = function() {
	let status = WAITING; // the status of the asynchronous data fetch
	let error = null; // if there was an error, this will be a string
	let filter = {}; // memoize the attribute so we don't call fetch on each redraw
	let data = []; // the result of the fetch() operation, such as API response

	const fetchData = function(vnode) {
		if(!Util.shallowEquals(vnode.attrs.filter, filter)) {
			filter = vnode.attrs.filter;
			status = WAITING;
			error = null;

			vnode.attrs.fetch(filter).then(
				(response) => {
					if(!vnode.attrs.stream) {
						data = response;
					} else {
						vnode.attrs.stream(response);
					}
					status = READY;
				}
			).catch(
				(response) => {
					error = response.message;
					status = ERROR;
				}
			).finally(m.redraw)
		}
	}

	return {
		oninit: fetchData,
		onupdate: fetchData,
		view: function(vnode) {
			if(status == WAITING) {
				return m("div", {style: "height: 400px; border-radius: 20px; padding: 5em; border: 5px solid #b2dfdb;"}, "Loading chart data...");
			}
			else if(status == READY) {
				if(vnode.children.length > 0) {
					vnode.children[0].attrs.data = data; // inject attribute
				}
				return vnode.children;
			}
			else if(status == ERROR) {
				return m("div", {style: "border-radius: 20px; padding: 5em; border: 5px solid #f44336;"}, 
					[
						m("h3", "Failed to generate report"), 
						m("p", error? error : "There was an error fetching chart data. Please try refreshing the page later.")
					]);
			}
		}
	};
};