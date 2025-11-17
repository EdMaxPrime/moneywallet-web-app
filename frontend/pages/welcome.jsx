const m = require("mithril")
const {TextInput, SubmitButton} = require("mithril-materialized")

const User = require("../models/User")


module.exports = {
	oninit: function(vnode) {
		vnode.state.verification = "";
	},
	view: function(vnode) {
		return m("div.container", [
			m("p", "Thank you for joining MoneyWallet on the web!"),
			// !User.isVerified() && m("div", [
			// 	m("h2", "Verification"),
			// 	m("p", "Your account has been created. Check your email for a message to verify your email address. Click the link or enter the code below. Verifying your email gives you access to extra features."),
			// 	m("form", {
			// 		onsubmit: function(event) {
			// 			event.preventDefault();
			// 			// TODO handle verification
			// 		}
			// 	}, [
			// 		m(TextInput, {
			// 			label: "Verification Code",
			// 			value: vnode.state.verification,
			// 			onchange: v => vnode.state.verification = v,
			// 		}),
			// 		m(SubmitButton, {
			// 			label: "Verify",
			// 			onclick: function() {
			// 				// TODO handle verification
			// 			}
			// 		})
			// 	]),
			// ]),
			m("h2", "Getting Started"),
			m("p", "You can navigate using the links on the left."),
			m("ul.browser-default", [
				m("li", "Import Data: copy transactions from your bank, your previous personal finance program, or the MoneyWallet mobile app"),
				m("li", "Settings: change your email, password, preferred first day of the week, and the app's appearance."),
				m("li", "Overview: visualize your finances with graphs"),
				m("li", "Budgets: create budgets to track your spending"),
			])
		]);
	}
}