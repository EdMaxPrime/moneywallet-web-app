const pb = require("../api")

var Category = {
	income: [],
	expense: [],
	system: [],
	byId: {},

	TYPE_INCOME: 0,
	TYPE_EXPENSE: 1,
	TYPE_SYSTEM: 2,
	DIRECTION_EXPENSE: 0, //same value as Transaction.direction
	DIRECTION_INCOME: 1, //same value as Transaction.direction
	DIRECTION_BOTH: 2, //only used for Transfer category to exclude from some reports

	loadList: function() {
		return pb.collection('categories').getFullList({
			sort: 'index'
		}).then(Category.loadListHelper)
	},

	loadListHelper: function(categories_list) {
		// reset state and sort the categories into types
		Category.income = categories_list.filter(category => category["type"] == Category.TYPE_INCOME);
		Category.expense = categories_list.filter(category => category["type"] == Category.TYPE_EXPENSE);
		Category.system = categories_list.filter(category => category["type"] == Category.TYPE_SYSTEM);
		// quick lookup by ID
		categories_list.forEach(category => {
			Category.byId[ category["id"] ] = category;
		});

		return categories_list;
	},

	/**
	 * Converts a normalized list of categories into a tree structure.
	 * @param parent  optional, omit if generating the full tree from root.
	 *                Pocketbase uses "" to signify the category has no parent.
	 * @return  a list of tree roots
	 */
	getTree: function(categories, parent = "") {
		// given a parent_id
		// filter all categories with that parent_id -> this level of tree
		let tree_level = categories.filter(category => category["parent"] == parent)
			.sort((a, b) => a.name.localeCompare(b.name));
		// for each category in this level of tree
		for(let category of tree_level) {
			// category.children = recursive(parent_id = category.id, categories_list)
			category.children = Category.getTree(categories, category["id"]);
		}
		return tree_level;
	},

	/**
	 * Given a string Id, get the category with this id, or undefined if
	 * it doesn't exist.
	 */
	getById: function(id) {
		return Category.byId[id];
	},

	/**
	 * Determines whether a category represents Expense or Income transactions.
	 * Ignores the system category "Transfer", which includes both types.
	 * @return the same constants as other model directions
	 */
	getDirection: function(id) {
		const category = Category.byId[id];
		if (category.type == Category.TYPE_EXPENSE) {
			return Category.DIRECTION_EXPENSE;
		} else if (category.type == Category.TYPE_INCOME) {
			return Category.DIRECTION_INCOME;
		} else {
			switch (category.tag) {
			case "system::credit":
			case "system::paid_debt":
			case "system::deposit":
			case "system::tax":
			case "system::transfer_tax":
				return Category.DIRECTION_EXPENSE;
				break;
			case "system::debt":
			case "system::paid_credit":
			case "system::withdraw":
				return Category.DIRECTION_INCOME;
				break;
			}
		}
		return Category.DIRECTION_BOTH;
	},

	/**
	 * Returns the parent category of a child category. Or, if it has no parent
	 * it will return itself.
	 * @param childCategoryId  the id of a category
	 * @return  the id of the parent category
	 */
	getParent: function(childCategoryId) {
		let parentId = this.getById(childCategoryId).parent;
		if (this.getById(parentId)) {
			return parentId;
		} else {
			return childCategoryId;
		}
	},
};

module.exports = Category;