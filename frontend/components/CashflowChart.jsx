// Mithril Components
const m = require("mithril")
const HighchartsContainer = require("./HighchartsContainer")

// Application state
const Category = require("../models/Category")
const Currency = require("../models/Currency")
const Model = require("../models/index")

// data manipulation
const dayjs = require("../dayjs-lib")
const Util = require("../util/index")


/**
 * A mapping from this application's "grouping" enum to the date format used by
 * Highcharts. Undefined means to use Highcharts default (full date)
 */
const groupingToHighchartsDateFormat = {
	"day": undefined,
	"week": undefined,
	"biweekly": undefined,
	"month": "%b %Y",
	"quarter": "%b %Y",
	"year": "%Y",
};



/**
 * Consider removing this in the future and just rely on the parent component
 * to filter the data before passing it to this component.
 */
const filterCategories = function(categoryStack, data) {
	return data.filter(object => categoryStack.hasOwnProperty(object["categories"]));
};

/**
 * Converts data into a format consumed by Highcharts library
 * 
 * @param grouping  day|week|biweekly|month|quarter|year
 * @param categoryStack  this describes which categories should be included 
 * in the chart and how they should be grouped. The data type is an object with
 * key-value pairs. The key is the category's id. The value is a number/string
 * that identifies which stack it will be a part of. If two values are the same
 * then those categories will be in the same stack on top of each other.
 * @param data  a list of objects {
 * categories: categoryId, 
 * currencies: currencyId, 
 * date: "YYYY-MM-DD", 
 * money: integer}
 * 
 * @return a list of Highcharts series configuration objects. Includes tooltip
 * formatting and all points
 */
const createSeries = function(timeGrouping, categoryStack, data) {
	let axisList = Util.groupBy(data, ["currencies"], function(groupedKeys, items) {
		return groupedKeys[0];
	});

	let multipleCurrencies = axisList.length > 1;

	// return a list of Highcharts Series configuration objects
	// created by grouping the data by currency and category, so each item1 will have a unique currency+category, but different dates within the points
	return Util.groupBy(data, ["currencies", "categories"], function(groupedKeys, items1) {
		return {
			// group the items by their time period (month/quarter/year), and convert to HighCharts point format
			data: Util.groupBy(
				items1, 
				[item1 => dayjs(item1["date"], "YYYY-MM-DD").startOf(timeGrouping).valueOf()], // group by Unix Timestamp of group start
				(groupedKeys, items2) => [ //convert to array of points. Each point is an array of [unix timestamp (x), sum of money (y)]
					parseInt(groupedKeys[0]), // Highcharts needs the unix timestamp as an integer, but groupBy turns it into a string
					items2.reduce(
						(sum, item2) => sum + parseInt(item2["money"]),
						0
					)
				]).sort( // sort points from earliest to latest timestamp
					(a, b) => a[0] - b[0]  // unix timestamps can be sorted just like numbers
				),
			name: Category.getById(groupedKeys[1]).name + (multipleCurrencies? (" (" + Currency.getById(groupedKeys[0]).iso + ")") : ""),
			stack: groupedKeys[0] + categoryStack[ groupedKeys[1] ], //to ensure different currencies are never in the same stack
			tooltip: {
				pointFormatter: function() {
					return '<span style="color:' + this.series.color + '">\u25CF</span> ' + this.series.name + ": <b>" + Model.formatMoneyAmount(Math.abs(this.y), groupedKeys[0]) + "</b><br/>";		
				},
			},
		};
	});
};

/**
 * Creates list of Y axes for the chart. Each currency is assigned a Y axis, to
 * avoid working with exchange rates.
 */
const createYAxis = function(data) {
	return Util.groupBy(data, ["currencies"], function(groupedKeys, items) {
		return {
			title: {
				text: Currency.getById(groupedKeys[0]).name
			},
			labels: {
				formatter: function() {
					// return Model.formatMoneyAmount(Math.abs(this.value), Currency.getById(groupedKeys[0]));
					// replace "000" with "K"
					let v = this.value / Math.pow(10, Currency.getById(groupedKeys[0])["decimals"]);
					if(Math.abs(v) > 1000) {
						return ((v / 1000.0) | 0) + "K";
					}
					return v|0;
				}
			},
		};
	});
}

const createHighchartsOptions = function(timeGrouping, categoryStack, data) {
	return {
		series: createSeries(timeGrouping, categoryStack, data),
		yAxis: createYAxis(data),
	};
}

/**
 * This component draws a grouped column chart. The y axis measures money spent
 * The x axis measures time. The groups on the x axis are time period groups
 * like months. The columns represent the money spent in a category. This chart
 * works with multiple currencies too. If any of the attributes change (shallow
 * comparison, not deep), the chart will replace the old data.
 * 
 * @attribute grouping  see `pages/overview.jsx` for enum
 * @attribute categoryStack  this describes which categories should be included 
 * in the chart and how they should be grouped. The data type is an object with
 * key-value pairs. The key is the category's id. The value is a number/string
 * that identifies which stack it will be a part of. If two values are the same
 * then those categories will be in the same stack on top of each other.
 * @attribute data  a list of objects {
 * categories: categoryId, 
 * currencies: currencyId, 
 * date: "YYYY-MM-DD", 
 * money: integer}
 * 
 */
module.exports = function() {
	// component state
	let oldOptions = {grouping: "month", data: [], categoryStack: {}};
	let series = [];
	let yAxis = [];

	return {
		view: function(vnode) {
			// update state based on new component attributes
			let allowChartUpdate = !Util.shallowEquals(oldOptions, vnode.attrs);
			if(allowChartUpdate) {
				oldOptions = vnode.attrs;
				let o = createHighchartsOptions(vnode.attrs.grouping, vnode.attrs.categoryStack, filterCategories(vnode.attrs.categoryStack, vnode.attrs.data));
				series = o.series;
				yAxis = o.yAxis;
			}

			return m(HighchartsContainer, {
				chartOptions: {
					chart: {
						type: "column",
					},
					credits: {
						enabled: false,
					},
					legend: {
						layout: "vertical",
						align: "right",
						verticalAlign: "middle",
					},
					plotOptions: {
						column: {
							stacking: "normal",
						},
					},
					series: series,
					subtitle: {
						text: "Compare how much was spent in each category over time. Click on a series in the legend to hide it",
						align: "left",
					},
					title: {
						text: "Cashflow",
						align: "left",
					},
					tooltip: {
						shared: true,
						xDateFormat: groupingToHighchartsDateFormat[vnode.attrs.grouping], //format the tooltip date
					},
					xAxis: {
						labels: {
							format: groupingToHighchartsDateFormat[vnode.attrs.grouping]? ("{value:" + groupingToHighchartsDateFormat[vnode.attrs.grouping] + "}") : undefined,
						},
						type: "datetime",
					},
					yAxis: yAxis,
				},
				allowChartUpdate: allowChartUpdate,
			});
		},
	};
}