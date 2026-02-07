// presentation layer imports
const m = require("mithril")
const {Button, Wizard} = require("mithril-materialized")
const TransactionListSelectable = require("../components/TransactionListSelectable.jsx")
const CategoryPickerButton = require("../components/CategoryPickerButton.jsx")

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
		vnode: () => m(".container", [
			m(".row", m("h3", "Fill out a field to change it for all selected, or leave it blank to not change it")),
			m(".row", [
				m(".col.s6", 
					m(CategoryPickerButton, {
						category: current.isCategoryChanging() && current.getNewCategory(),
						onselection: function(categoryId) {current.changeCategory(categoryId)}, // function needed to bind this
					})),
				m(".col.s6",
					current.isCategoryChanging() && m(Button, {
						label: "Don't change",
						onclick: function() {current.doNotChangeCategory();} // function needed to bind this
					}))
			])
		])
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