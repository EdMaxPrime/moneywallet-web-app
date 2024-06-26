const m = require("mithril");

/**
 * Attributes:
 * chartOptions = the object passed to Highcharts to initialize the chart
 * 
 * chartAttributes = attributes for the <div> containing the chart
 * 
 * chartCreatedCallback = [optional] function called when the chart is created,
 * first argument to the function is the Highcharts chart instance
 * 
 * allowChartUpdate = [default false]. When true, this will update the chart
 * whenever this component's onUpdate() lifecycle method runs after redraw.
 * Incudes chart options and data.
 */

module.exports = function() {
	// reference to Highcharts instance, begins as null when there is no chart
	let chart = null;
	return {
		oncreate: function(vnode) {
			chart = window.Highcharts.chart(vnode.dom, vnode.attrs.chartOptions, vnode.attrs.chartCreatedCallback);
		},
		/**
		 * Todo: make this component more reactive by performing an update only
		 * if the options object has changed. This can be checked with a
		 * reference to the previous options pointer. This component should be
		 * updated by Object.assign() to the options.
		 */
		onupdate: function(vnode) {
			if(vnode.attrs.allowChartUpdate === true && chart != null) {
				chart.update(vnode.attrs.chartOptions, 
					true, // redraw chart (not Mithril) after update
					true); // oneToOne: remove/update series instead of appending
			}
		},
		onremove: function(vnode) {
			if(chart != null) {
				chart.destroy();
				chart = null;
			}
		},
		view: function(vnode) {
			return m("div", vnode.attrs.chartAttributes);
		},
	};
};