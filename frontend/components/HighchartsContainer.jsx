const m = require("mithril");

/**
 * Attributes:
 * chartOptions = the object passed to Highcharts to initialize the chart
 * 
 * chartAttributes = attributes for the <div> containing the chart
 * 
 * chartCreatedCallback = [optional] function called when the chart is created,
 * first argument to the function is the Highcharts chart instance
 */

module.exports = function() {
	// reference to Highcharts instance, begins as null when there is no chart
	let chart = null;
	return {
		oncreate: function(vnode) {
			chart = window.Highcharts.chart(vnode.dom, vnode.attrs.chartOptions, vnode.attrs.chartCreatedCallback);
		},
		// onupdate: function(vnode) {
			// call chart.update(vnode.attrs.chartOptions) with new attribute
			// however, if chartUpdate=false then ignore attribute change
			// when updating the argument, use a deepmerge
		// },
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