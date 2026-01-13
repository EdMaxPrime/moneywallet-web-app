// presentation layer imports
const m = require("mithril")
const {Wizard} = require("mithril-materialized")
const TransactionListSelectable = require("../components/TransactionListSelectable.jsx")

// data layer imports
const {current} = require("../models/TransactionBulkEditForm")


const steps = [
	{
		title: "Select Transactions",
		subtitle: "Select which ones will be changed",
		icon: "message",
		vnode: () => m(TransactionListSelectable, {form: current})
	},
	{
		title: "Edit",
		subtitle: "What will be edited",
		icon: "message",
		vnode: () => m("p", "Step 2")
	},
	{
		title: "Review",
		subtitle: "Confirm the changes",
		icon: "message",
		vnode: () => m("p", "Step 3")
	}
];

/**
 * This page will guide the user through a multi-step process
 */
module.exports = {
	view: function(vnode) {
		return m(Wizard, {
			steps: steps,
			linear: true, // must complete steps in order
			orientation: "horizontal",
			allowHeaderNavigation: true, // click step headers to navigate
		});
	}
}