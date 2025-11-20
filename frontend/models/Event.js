const pb = require("../api")
const dayjs = require("../dayjs-lib")

const byId = {};
let list = [];

var Event = {
	getById: function(id) {
		if(id in byId) return byId[id];
		return null;
	},

	loadListHelper: function(events) {
		for(event of events) {
			byId[event["id"]] = event;
		}
		list = events;
	},

	loadList: function() {
		return pb.collection("events").getFullList().then(Event.loadListHelper)
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