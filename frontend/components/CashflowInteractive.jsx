// Mithril Components
const m = require("mithril")
const CashflowChart = require("./CashflowChart")
const CategoryPicker = require("./CategoryPicker")
const {Button, ModalPanel, Select} = require("mithril-materialized")

// API and application state
const Category = require("../models/Category")
const Report = require("../models/Report")

// data manipulation
const dayjs = require("../dayjs-lib")
const Util = require("../util/index")



/**
 * Given spending broken down by categories, create some new data points with
 * totals for all expenses, incomes, and net income.
 */
const createNetCategory = function(data) {
	// rather than using the return value of groupBy(), this approach modifies the data parameter on each iteration
	Util.groupBy(data, ["date", "currencies", "wallets"], function(groupedKeys, oneDayAllCategories) {
		let expenses = 0;
		let income = 0;
		for(let oneDayOneCategory of oneDayAllCategories) {
			if(oneDayOneCategory["categories_type"] == Category.TYPE_EXPENSE) {
				expenses += parseInt(oneDayOneCategory["money"]);
			} else if(oneDayOneCategory["categories_type"] == Category.TYPE_INCOME) {
				income += parseInt(oneDayOneCategory["money"]);
			}
		}
		data.push({
			date: groupedKeys[0],
			categories: Category.CATEGORY_ALL_EXPENSES,
			currencies: groupedKeys[1],
			money: expenses,
			wallets: groupedKeys[2],
		});
		data.push({
			date: groupedKeys[0],
			categories: Category.CATEGORY_ALL_INCOME,
			currencies: groupedKeys[1],
			money: income,
			wallets: groupedKeys[2],
		});
		data.push({
			date: groupedKeys[0],
			categories: Category.CATEGORY_NET_INCOME,
			currencies: groupedKeys[1],
			money: income - expenses,
			wallets: groupedKeys[2],
		});
		return 0;
	});
}

// AJAX/fetch request status options
const WAITING = 1, READY = 2, ERROR = 3;

// Other constants
const NO_CATEGORY_SELECTED = null;


/**
 * This component is a wrapper around CashflowChart. On initialization, it
 * fetches category spending data. Then, it calculates the net income. Finally,
 * it displays the column chart. Below the chart is a button which opens a
 * modal to add a category to the chart (in a new series or a grouped one).
 * 
 * TODO: known issue: the chart won't apply filters immediately upon creation
 * 
 * Attributes:
 * @attribute grouping  this is passed directly to CashflowChart, see docs
 * @attribute filters  an object with startDate (DayJS), endDate (Dayjs),
 * and wallets (string id or "Total").
 */

module.exports = function(initialVnode) {
	// instance state
	let status = WAITING;
	let allData = []; // unfiltered
	let data = []; // filtered
	let modalOpen = false;
	let categoryStack = {}; // mapping of {categoryId: stack} for the chart
	let stackToCategories = {}; // mapping of {stack: categoryNames} for the dropdown
	let nextStackName = 10; // counter to give each stack a unique name
	let filters = Object.assign({startDate: null, endDate: null, wallets: "Total"}, initialVnode.attrs.filters);
	// new series options from modal
	let selectedCategory = NO_CATEGORY_SELECTED;
	let selectedStackName = nextStackName;

	// instance methods

	/**
	 * Uses filters to narrow the "allData" list into "data" list. The filters
	 * are passed as attributes to this component.
	 */
	const applyFilters = function() {
		data = allData.filter(
			(item, index) => ((item["wallets"] == filters["wallets"] || "Total" == filters["wallets"]) && (dayjs(item["date"], "YYYY-MM-DD").isBetween(filters.startDate, filters.endDate, "day", "[]")))
		);
	}

	/**
	 * Uses the API to fetch all data for all time. This will later be filtered
	 * and grouped as necessary. In addition, synthetic categories are added to
	 * the mix.
	 */
	const fetchData = function() {
		Report.getDailyCategorySpend("Total").then(function(response) {
			allData = response;
			createNetCategory(allData);
			applyFilters();
			status = READY;
		}).catch(function(error) {
			status = ERROR;
		}).finally(m.redraw) // must call manually if not using mithril's request()
	}

	/**
	 * Adds a series to the chart.
	 */
	const addSeries = function(categoryId, stackName) {
		categoryStack = Object.assign({[categoryId] : stackName}, categoryStack);
		if(stackToCategories.hasOwnProperty(stackName)) {
			stackToCategories[stackName] += " / " + Category.getById(categoryId).name;
		} else {
			stackToCategories[stackName] = Category.getById(categoryId).name;
		}
		nextStackName++;
	}


	
	// initialize
	addSeries(Category.CATEGORY_NET_INCOME, 2);
	applyFilters();

	// view
	return {
		view: function(vnode) {
			const { grouping } = vnode.attrs;

			return m("div", [
				(status == ERROR) && m("div.red.lighten-3", "Could not fetch data for this chart"),
				(status == WAITING) && m("div.teal.lighten-3", "Loading data"),
				m(CashflowChart, {grouping: grouping, data: data, categoryStack: categoryStack}),
				m(Button, {
					label: "Add series",
					onclick: () => {modalOpen = true;},
				}),
				m(Button, {
					label: "Reset",
					onclick: () => {
						categoryStack = {}; 
						stackToCategories = {}; 
					},
				}),
				m(ModalPanel, {
					title: "Add Category to Cashflow Chart",
					description: m("div", [
						m(Select, {
							label: "Select whether you'd like to stack this category on top of any series already in the chart",
							options: [
								{id: nextStackName, group: "Separate", label: "Create new series"},
								...(Object.entries(stackToCategories).map(
									entry => {return {id: entry[0], group: "Add to", label: entry[1]}}
								))
							],
							checkedId: [selectedStackName],
							onchange: (ids) => {selectedStackName = ids[0];}
						}),
						m(CategoryPicker, {
							showMetaCategories: true,
							selectedIds: selectedCategory == NO_CATEGORY_SELECTED? [] : [selectedCategory],
							onselection: (selectedIds) => {if(selectedIds.length > 0) selectedCategory = selectedIds[0];}
						}),
					]),
					isOpen: modalOpen,
					onToggle: open => {
						modalOpen = open; 
						selectedStackName = nextStackName; //reset form state
						selectedCategory = NO_CATEGORY_SELECTED;
					},
					buttons: [
						{
							label: "Add",
							onclick: () => {
								if(selectedCategory != NO_CATEGORY_SELECTED) {
									addSeries(selectedCategory, selectedStackName);
									selectedCategory = NO_CATEGORY_SELECTED;
								}
							},
						}
					],
				}),
			]);
		},
		oninit: fetchData,
		onupdate: function(vnode) {
			if(vnode.attrs.filters.wallets != filters.wallets ||
				!vnode.attrs.filters.startDate.isSame(filters.startDate, "day") ||
				!vnode.attrs.filters.endDate.isSame(filters.endDate, "day")
				) {
				filters = vnode.attrs.filters;
				applyFilters();
			}
		}
	};
}