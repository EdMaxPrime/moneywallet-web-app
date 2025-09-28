// Component imports
const m = require("mithril")
const {ModalPanel, TextInput} = require("mithril-materialized")
const MoneyAmount = require("./MoneyAmount")

// application state
const Transaction = require("../models/Transaction")
const Models = require("../models/index")

// utilities
const dayjs = require("../dayjs-lib")

// CSS
require('mithril-materialized/core.css')      // Essential styles (18KB)
require('mithril-materialized/components.css') // Interactive components


module.exports = function() {
	return {
		view: function(vnode) {
			return m(ModalPanel, {
				id: "transactionModal",
				isOpen: Transaction.current.hasOwnProperty("id"),
				onToggle: function(open) {
					if(!open) {
						Transaction.current = {};
					}
				},
				title: "Transaction",
				description: m("div.row", [
					m("div.col.s12", 
						Transaction.current.hasOwnProperty("direction")? m(MoneyAmount, {direction: Transaction.current.direction, t: Transaction.current}) : null
					),
					m("div.col.s12", [
						m(TextInput, {
							iconName: "subject",
							label: "Description",
							oninput: () => {},
							readonly: true,
							value: Transaction.current.description,
						}),
					]),
					m("div.col.s12", [
						m(TextInput, {
							iconName: "category",
							label: "Category",
							oninput: () => {},
							readonly: true,
							value: Models.getCategoryName(Transaction.current),
						}),
					]),
					m("div.col.s12", [
						m(TextInput, {
							iconName: "date_range",
							label: "Date",
							oninput: () => {},
							readonly: true,
							disabled: true,
							value: dayjs(Transaction.current.date).format("LLLL"),
						}),
					]),
					m("div.col.s12", [
						m(TextInput, {
							iconName: "folder",
							label: "Wallet",
							oninput: () => {},
							readonly: true,
							disabled: true,
							value: Models.getWalletName(Transaction.current),
						}),
					]),
					m("div.col.s12", [
						m(TextInput, {
							iconName: "comment",
							label: "Note",
							oninput: () => {},
							readonly: true,
							value: Transaction.current.note,
						}),
					]),
				]),
				buttons: [
					{
						label: "Edit",
						onclick: () => alert("This feature is coming soon")
					},{
						label: "Delete",
						onclick: () => alert("This feature is coming soon")
					}
				],
			});
		}
	};
};