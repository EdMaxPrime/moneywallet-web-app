

const byId = {};

module.exports = {
	getById: function(id) {
		if(id in byId) return byId[id];
		return null;
	},

	loadListHelper: function(places) {
		for(place of places) {
			byId[place["id"]] = place;
		}
	},
};