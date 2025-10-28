

const byId = {};

module.exports = {
	getById: function(id) {
		if(id in byId) return byId[id];
		return null;
	},

	loadListHelper: function(events) {
		for(event of events) {
			byId[event["id"]] = event;
		}
	},
};