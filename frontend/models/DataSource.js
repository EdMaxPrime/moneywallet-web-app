

const byId = {};

module.exports = {
	getById: function(id) {
		if(id in byId) return byId[id];
		return null;
	},

	loadListHelper: function(dataSources) {
		for(d of dataSources) {
			byId[d["id"]] = d;
		}
	},
};