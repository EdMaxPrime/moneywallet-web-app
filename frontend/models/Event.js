const pb = require("../api")
const dayjs = require("../dayjs-lib")
const util = require("../util/index")

const byId = {};
let list = [];

const transformApiResponseToModels = function(list) {}

var Event = {
	getById: function(id) {
		if(id in byId) return byId[id];
		return null;
	},

	/**
	 * Asynchronous function. Will try to find an event object with this ID.
	 * May perform network request if cache doesn't have it.
	 * @param id  string
	 * @return Promise that resolves to a Event object. It may reject if no
	 * event could be found, or a network error happened.
	 */
	getByIdAsync: function(id) {
		if(id in byId) return new Promise((resolve, reject) => resolve(byId[id]));
		else {
			return pb.collection("events_progress")
				.getFullList({filter: pb.filter("event_id = {:id}", {id: id})})
				.then(events => {
					if(events.length == 0) throw new Error("Could not find event");
					else return Event.loadListHelper(events)[0];
				});
		}
	},

	/**
	 * Parses the API response, transforms into event model objects.
	 * @param events  list of objects
	 * @param addToCache  boolean, default false. If true, adds to internal cache
	 * @return  list of event objects
	 */
	loadListHelper: function(events, addToCache) {
		return util.groupBy(
			events,
			["event_id"],
			function(event_id_list, recordsInGroup) {
				const event_id = event_id_list[0];
				const event_progress = {
					id: recordsInGroup[0]["event_id"],
					name: recordsInGroup[0]["event_name"],
					icon: recordsInGroup[0]["event_icon"],
					note: recordsInGroup[0]["event_note"],
					start_date: recordsInGroup[0]["event_start_date"],
					end_date: recordsInGroup[0]["event_end_date"],
					summary_by_wallet: recordsInGroup.map(r => ({
						wallet: r.wallet,
						currencyId: r.currency,
						expenses: r.expenses,
						income: r.income,
						money: r.income - r.expenses,
					})).filter(
						summary => summary.wallet != null && summary.wallet != ""
					),
					// summary_by_wallet: util.listToMap(recordsInGroup, "wallet", ["wallet", "currency", "expenses", "income"]),
					summary_by_currency: util.groupBy(recordsInGroup, ["currency"], function(currency, walletSummaries) {
						return {
							currencyId: currency[0],
							expenses: walletSummaries.reduce((sum, current) => sum + current.expenses, 0),
							income: walletSummaries.reduce((sum, current) => sum + current.income, 0),
							money: walletSummaries.reduce((sum, current) => sum + current.income - current.expenses, 0)
						};
					}).filter(
						summary => summary.currencyId != null && summary.currencyId != ""
					)
				}

				if(addToCache) byId[event_id] = event_progress;

				return event_progress;
			})
	},

	loadList: function() {
		return pb.collection("events_progress")
			.getFullList()
			.then(events => {list = Event.loadListHelper(events, true); return list;})
	},

	getCurrentDuring: function(date) {
		return list.filter(event => date.isBetween(event.start_date, event.end_date, "day"));
	},

	getPast: function(date) {
		return list.filter(event => date.isAfter(event.end_date, "day"))
		.sort((event1, event2) => {
			const d1 = dayjs(event1.end_date), d2 = dayjs(event2.end_date);
			if(d1.isSame(d2)) return 0;
			else if(d1.isBefore(d2)) return 1;
			return -1;
		});
	},
};

module.exports = Event;