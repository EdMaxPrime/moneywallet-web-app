const m = require("mithril")

const Settings = require("../models/Settings")

const dayjs = require("../dayjs-lib")



// date formats
const date_formats = ["dddd DD MMMM YYYY", "dddd DD MMM YYYY", "ddd DD MMMM YYYY", "ddd DD MMM YYYY", "DD MMMM YYYY", "DD MMM YYYY", "DD/MM/YY", "MM/DD/YY", "YYYY-MM-DD"];
const dates_of_month = (function() { //list 1...28
	let list = [];
	for(let i = 1; i <= 28; i++) {
		list.push(i);
	}
	return list;
})();


module.exports = {
	view: function(vnode) {
		return m("div", [
			m("h2", "Appearance"),
			m("div", [
				m("label", "Date format"),
				m("select.browser-default", 
					{
						id: "settings-date-format",
						onchange: event => {Settings.date_format = event.target.value},
					},
					date_formats.map((format, index) => m("option", {value: format, key: format, selected: Settings.date_format == format? "selected": null}, dayjs().format(format)))
				),
			]),
			m("div", [
				m("label", "First day of the week"),
				m("select.browser-default", 
					{
						id: "settings-first-week-day",
						onchange: event => {
							Settings.first_week_day = parseInt(event.target.value);
						},
					},
					dayjs.weekdays().map((weekday, index) => m("option", {value: index, key: weekday, selected: Settings.first_week_day == index? "selected": null}, weekday))
				),
			]),
			m("div", [
				m("label", "First date of the month"),
				m("select.browser-default", 
					{
						id: "settings-first-month-date",
						onchange: event => {
							Settings.first_month_date = parseInt(event.target.value);
						},
					},
					dates_of_month.map((date) => m("option", {value: date, key: date, selected: Settings.first_month_date == date? "selected": null}, date))
				),
			]),
		]);
	}
}