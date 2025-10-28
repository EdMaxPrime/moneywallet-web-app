

const byId = {};

module.exports = {
	getById: function(id) {
		if(id in byId) return byId[id];
		return null;
	},

	loadListHelper: function(people) {
		for(person of people) {
			byId[person["id"]] = person;
		}
	},
};