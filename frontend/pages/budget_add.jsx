const m = require("mithril")
const {Button, DatePicker, ModalPanel, NumberInput, RadioButtons, Select, SubmitButton, TextInput} = require("mithril-materialized")
const CategoryItem = require("../components/CategoryItem")
const CategoryPicker = require("../components/CategoryPicker")

// data model imports
const Budget = require("../models/Budget")
const Category = require("../models/Category")
const Wallet = require("../models/Wallet")
const Model = require("../models/index")

// utilities
const dayjs = require("../dayjs-lib")
const currency = require("currency.js")

// CSS imports
require("mithril-materialized/pickers.css") // for DatePicker
require("mithril-materialized/core.css") // for grid alignment



const moneyFormatter = function(money, currencyId, numberOnly) {
	return currencyId? Model.formatMoneyAmount(money, currencyId, numberOnly) : (money / 100).toFixed(2);
}

/**
 * This could be converted to a wizard with a stepper in the future. For now,
 * it works regardless of which order you complete the steps in. Makes an
 * assumption that the currency is formatted with 2 places after the decimal
 * point, until you select wallets, then it will use that currency.
 * 
 * State:
 * - dateRange: string representing the chosen radio button for date range
 * - categoryModalMessage: string with an error message to show on the category picker
 * - categoryModalOpen: boolean
 * - validationModalOpen: boolean
 */
module.exports = {
	view: function(vnode) {
		Budget.current.moneyFormatter = moneyFormatter;
		return m("div.container", [
			m(RadioButtons, {
				checkboxClass: "col s4",
				layout: "horizontal",
				label: "When is your budget active?",
				options: [
					{ id: "month", label: "This month" },
					{ id: "next", label: "Next month" },
					{ id: "year", label: "This year" },
					{ id: "custom", label: "Custom" },
				],
				checkedId: vnode.state.dateRange,
				onchange: (checkedId) => {
					vnode.state.dateRange = checkedId;
					if(checkedId == "month" || checkedId == "year") {
						Budget.current.start_date = dayjs().startOf(checkedId).toDate();
						Budget.current.end_date = dayjs().endOf(checkedId).toDate();
					} else if(checkedId == "next") {
						Budget.current.start_date = dayjs().startOf("month").add(1, "month").toDate();
						Budget.current.end_date = dayjs().endOf("month").add(1, "month").toDate();
					}
				}
			}),
			m(DatePicker, {
				className: vnode.state.dateRange != "custom" && "hide", //hide this component when not choosing custom date range
				disabled: vnode.state.dateRange != "custom",
				dateRange: true,
				label: "Custom start and end dates",
				onSelect: (start_date, end_date) => {
					Budget.current.start_date = dayjs(start_date).toDate();
					Budget.current.end_date = dayjs(end_date).toDate();
				},
			}),
			m(Select, {
				label: "Which wallets should be tracked?",
				multiple: true,
				checkedId: Budget.current.wallet_ids,
				options: Wallet.getOrderedList().map(wallet => ({
					id: wallet.id,
					label: wallet.name,
				})),
				onchange: (checkedIds) => {
					Budget.current.setWallets(checkedIds.map(id => Wallet.getById(id)))
				},
				helperText: !Budget.current.walletsAreConsistent() && "Please revise your selection so that the wallets have the same currency",
				style: "margin-top: 3em; margin-bottom: 3em;", // spacing from other form elements
			}),
			m(NumberInput, {
				label: "What is your total budget?",
				min: 0,
				dataError: "Must be a positive number",
				step: 0.01,
				value: Budget.current.moneyText,
				oninput: (value) => {
					const newTotal = currency(value).intValue;

					if(newTotal != 0) {
						if(newTotal > Budget.current.money) {
							vnode.state.showUpdateMoneyButton = true;
							vnode.state.showUpdatePercentButton = true;
						} else {
							vnode.state.showUpdatePercentButton = true;
							vnode.state.showUpdateMoneyButton = false;
						}
					} else {
						vnode.state.showUpdateMoneyButton = false;
						vnode.state.showUpdatePercentButton = false;
					}

					Budget.current.moneyText = value; 
					Budget.current.money = newTotal;
				}
			}),
			(vnode.state.showUpdateMoneyButton && Budget.current.children.length > 0) && m(Button, {
				label: "Recalculate categories based on percentage",
				onclick: function() {
					Budget.current.updateBudgetMoneyKeepPercent();
					vnode.state.showUpdateMoneyButton = false;
				}
			}),
			m("table", [
				m("thead", 
					m("tr", [
						m("th", "Category"),
						m("th", "Budget"),
						m("th", "Budget (% of total)"),
					])),
				m("tbody", 
					Budget.current.children.map(childBudget => m("tr", {key: childBudget.categoryId}, [
						m("td", m(CategoryItem, {category: Category.getById(childBudget.categoryId)})), 
						m("td", m(NumberInput, {
							step: 0.01,
							value: childBudget.moneyText, 
							oninput: (value) => {Budget.current.setCategoryMoney(childBudget.categoryId, value, currency(value).intValue);}
						})),
						m("td", m(NumberInput, {
							step: 0.01,
							value: childBudget.percent, 
							oninput: (value) => {Budget.current.setCategoryPercent(childBudget.categoryId, value)}
						})),
					])).concat([m("tr", {key: "buttons"}, 
						m("td", {"colspan": 3}, [
							m(Button, {
								label: "Add category",
								onclick: function() {vnode.state.categoryModalOpen=true;}
							}),
							m(Button, {
								label: "Add all remaining categories",
								onclick: function() {
									for(const category of Category.expense) {
										Budget.current.addCategory(category.id, "", 0);
									}
								}
							}),
						]))
					])),
				m("tfoot", [
					m("tr", {className: !Budget.current.overallocated() && "green lighten-5"}, [
						m("th", "Total"),
						m("td", moneyFormatter(Budget.current.getMoneyAllocated(), Budget.current.currencyId, false)),
						m("td", Math.round(Budget.current.getPercentAllocated() * 100) + "%"),
					]),
					Budget.current.overallocated() && m("tr.red.lighten-5", [
						m("th", "Budget is overallocated"),
						m("td", Budget.current.currencyIsChosen() && Model.formatMoneyAmount(Budget.current.getMoneyAllocated() - Budget.current.money, Budget.current.currencyId)),
						m("td", Math.round((Budget.current.getPercentAllocated() * 100) - 100) + "%"),
					]),
					!Budget.current.overallocated() && m("tr", [
						m("th", "All other expenses"),
						m("td", Budget.current.currencyIsChosen() && Model.formatMoneyAmount(Budget.current.money - Budget.current.getMoneyAllocated(), Budget.current.currencyId)),
						m("td", Math.round(100 - (Budget.current.getPercentAllocated() * 100)) + "%"),
					]),
				])
			]),
			m(SubmitButton, {
				label: "Save",
				iconName: "send",
				iconClass: "left",
				className: "btn-large",
				onclick: function() {
					// save Budget
					Budget.current.save()
					.then(() => {
						Budget.reset();
						m.route.set("/budgets")
					})
					.catch(error => {
						if(typeof error == "string")
							vnode.state.validationErrorMessage = error;
						else
							vnode.state.validationErrorMessage = "Some of your budget could not be saved, please try again later";
						vnode.state.validationModalOpen = true;
					})
				}
			}),
			m(ModalPanel, {
				title: "Add category to budget",
				description: m("div", [
					m("p", vnode.state.categoryModalMessage),
					m(CategoryPicker, {
						showMetaCategories: false,
						multiple: false,
						selectedIds: [],
						onselection: (selectedIds) => {
							if(selectedIds.length > 0) {
								if(Budget.current.addCategory(selectedIds[0], "", 0, "")) {
									vnode.state.categoryModalOpen = false;
									vnode.state.categoryModalMessage = false;
								} else {
									vnode.state.categoryModalMessage = "Please choose a category that hasn't been budgeted yet";
								}
							}
						}
					})
				]),
				isOpen: vnode.state.categoryModalOpen,
				onToggle: open => {
					vnode.state.categoryModalOpen = open;
				},
			}),
			m(ModalPanel, {
				title: "Before saving this budget",
				description: m("p.red-text", vnode.state.validationErrorMessage),
				isOpen: vnode.state.validationModalOpen,
				onToggle: open => vnode.state.validationModalOpen = open
			})
		])
	}
}