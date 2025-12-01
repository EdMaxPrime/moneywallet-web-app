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
 * @attribute viewWithData  OPTIONAL. A function which accepts the data as a 
 * parameter and returns a vnode to draw. Only called if there was no error.
 * @attribute stream  OPTIONAL. A Mithril Stream to contain the data. Use this
 * if the data will be used in multiple places
 * 
 * @attribute loadingText  string. Text to show while loading. There is a default
 * @attribute errorText  string. Text to show if error object has no message
 * @attribute errorTitle  string. Text to show if there was an error
 * 
 * 
 * Children:
 * If there is 1 child element, it will be drawn when the data is ready. The
 * data will be injected as a "data" attribute.
 * Otherwise, you can provide a render function as an attribute.
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
			const loadingText = vnode.attrs.loadingText || "Loading chart data...";
			const errorTitle = vnode.attrs.errorTitle || "Failed to generate report";
			const errorText = vnode.attrs.errorText || "There was an error fetching chart data. Please try refreshing the page later.";

			if(status == WAITING) {
				return m("div", {style: "height: 400px; border-radius: 20px; padding: 5em; border: 5px solid #b2dfdb;"}, loadingText);
			}
			else if(status == READY) {
				if(vnode.children.length > 0) {
					vnode.children[0].attrs.data = data; // inject attribute
				}
				else if(typeof vnode.attrs.viewWithData === "function") {
					return vnode.attrs.viewWithData(data);
				}
				return vnode.children;
			}
			else if(status == ERROR) {
				return m("div", {style: "border-radius: 20px; padding: 5em; border: 5px solid #f44336;"}, 
					[
						m("h3", errorTitle), 
						m("p", error? error : errorText)
					]);
			}
		}
	};
};