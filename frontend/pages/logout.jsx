const m = require("mithril")
const pb = require("../api")

module.exports = {
	view: function() {
		pb.authStore.clear();
		m.route.set("/login", {}, {replace: true});
	}
};