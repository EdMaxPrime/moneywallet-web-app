// presentation layer import
const m = require("mithril")
const {Button} = require("mithril-materialized")
const MoneyAmount = require("./MoneyAmount.jsx")
require("./TransactionListSelectable.css")

// data import
const Model = require("../models/index.js")

// utility
const dayjs = require("../dayjs-lib")


/**
 * This component draws a table. Unlike the other TransactionLists, the user
 * selects rows. It is meant to be part of a form.
 * 
 * Attributes:
 * @attribute form  an instance of TransactionBulkEditForm, holds state
 */
module.exports = {

	view: function(vnode) {
		let form = vnode.attrs.form;

		return m("div", [
			m("div", [
				m(Button, {
					label: "Select All",
					iconName: "check_box",
					onclick: () => form.selectAll()
				}),
				m(Button, {
					label: "Deselect All",
					iconName: "check_box_outline_blank",
					onclick: () => form.deselectAll()
				}),
				m("span", form.countSelected() + " of " + form.countTotal() + " selected")
			]),
			m("table", [
				m("thead", 
					m("tr", [
						m("th", {id: "ColumnCheck"}, ""),
						m("th", "Description"),
						m("th", "Category"),
						m("th", "Date"),
						m("th", "Money")
					])),
				m("tbody", 
					form.isReady()? 
						form.transactions.map(
							transaction => m("tr" + (form.isSelected(transaction.id)? ".blue.lighten-3" : ""), 
								{
									key: transaction.id,
									onclick: function() {
										form.toggleSelection(transaction.id);
									}
								}, 
								[
								m("td.selection-checkbox", 
									m("input.selection-checkbox", {
										type: "checkbox", 
										name: "transaction-choice-" + transaction.id, 
										"aria-labelledby": "transaction-row-" + transaction.id + " ColumnCheck",
										checked: form.isSelected(transaction.id),
										onchange: () => {
											console.log("changing!");
											form.toggleSelection(transaction.id);
										}
									})),
								m("th", {
									scope: "row",
									id: "transaction-row-" + transaction.id
								}, 
									m("label", {"for": "transaction-choice-" + transaction.id}, transaction.description)),
								m("td", Model.getCategoryOfTransaction(transaction).name),
								m("td", dayjs(transaction["date"]).formatDate()),
								m("td", m(MoneyAmount, {direction: transaction.direction, t: transaction}))
							]))
						: m("td", {colspan: 5}, m("i", "Loading..."))
				)
			])
		])
	}
};