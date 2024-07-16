const dayjs = require("dayjs")

const Settings = require("./models/Settings")

// Extend core functionality with plugins

const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat); //plugin to parse non-ISO formats from API endpoint, for converting string dates to Highcharts Unix timestamp
const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween); //plugin to compare dates for the filter
const quarterOfYear = require("dayjs/plugin/quarterOfYear");
dayjs.extend(quarterOfYear); //plugin for Quarter grouping
const weekOfYear = require("dayjs/plugin/weekOfYear");
dayjs.extend(weekOfYear); // plugin to get week number in year 1-53

// Add a custom "startOf" method to support User Settings
dayjs.extend(function(option, dayjsClass, dayjsFactory) {
	/**
	 * This does the same thing as the built-in startOf(), which is to move the 
	 * date to the start of a grouping period - but this extension is aware of
	 * custom calendar settings for year, month, and week.
	 * @param unit  year | month | week | biweekly | day | hour | minute | second
	 */
	dayjsClass.prototype.mwStartOf = function(unit) {
		let result = this.clone();
		if(unit == "year") {
			if(this.month() < Settings.financial_year_first_month - 1 || 
				(this.month() == Settings.financial_year_first_month && this.date() < Settings.first_month_date)) {
				result = result.subtract(1, 'year');
			}
			result = result.month(Settings.financial_year_first_month - 1);
			result = result.date(Settings.first_month_date);
			return result;
		}
		else if(unit == "month") {
			if(this.date() < Settings.first_month_date) {
				result = result.subtract(1, 'month');
			}
			result = result.date(Settings.first_month_date);
			return result;
		}
		else if(unit == "week") {
			// M Tu W Th F Sa Su
			let first_week_day = Settings.first_week_day < 7? Settings.first_week_day : 0; // normalize from 1-7 to 0-6 range
			return this.subtract((this.day() < first_week_day ? this.day() + 7 : this.day()) - first_week_day, 'day');
		}
		else if(unit == "biweekly") {
			let startOfWeek = this.mwStartOf("week");
			if(startOfWeek.week() % 2 == 1) {
				return startOfWeek.subtract(1, "week");
			}
			return startOfWeek;
		}
		return this.startOf(unit);
	}


	/**
	 * This does the same thing as the built-in endOf(), which is to move the 
	 * date to the end of a grouping period - but this extension is aware of
	 * custom calendar settings for year, month, and week.
	 * @param unit  year | month | week | biweekly | day | hour | minute | second
	 */
	dayjsClass.prototype.mwEndOf = function(unit) {
		if(unit == "year") {
			const addYear = this.month() > Settings.financial_year_first_month-1 || (this.month() == Settings.financial_year_first_month-1 && this.date() >= Settings.first_month_date);
			return this.month(Settings.financial_year_first_month-1).date(Settings.first_month_date).add(addYear, 'year');
			// if month is less than first month, then just set the month and date
			// if month is equal to first month, and day < first date, then just set the month and date
			// if month is equal to first month, and day >= first date, then year+1 and set month and date
			// if month is > first month, then year+1 and set month and date
		}
		else if(unit == "month") {
			const addMonth = this.date() >= Settings.first_month_date;
			return this.add(addMonth, 'month').date(Settings.first_month_date);
		}
		else if(unit == "week") {
			let first_week_day = Settings.first_week_day < 7? Settings.first_week_day : 0; // normalize from 1-7 to 0-6 range
			let gap = first_week_day - this.day();
			if(gap > 0) return this.add(gap - 1, 'day');
			else return this.add(6 + gap, 'day');
		}
		else if(unit == "biweekly") {
			let endOfWeek = this.mwEndOf("week");
			if(endOfWeek.week() % 2 == 1) {
				return endOfWeek.subtract(1, "week");
			}
			return endOfWeek;
		}
		return this.endOf(unit);
	}
});

module.exports = dayjs;