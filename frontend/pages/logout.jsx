const m = require("mithril")
const User = require("../models/User")

module.exports = {
	view: function() {
		User.logout();
		m.route.set("/login", {}, {replace: true});
	}
};