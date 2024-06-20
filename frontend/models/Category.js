const pb = require("../api")

var Category = {
	income: [],
	expense: [],
	system: [],
	byId: {},

	loadList: function() {
		return pb.collection('categories').getFullList({
			sort: 'index'
		}).then(Category.loadListHelper)
	},

	loadListHelper: function(categories_list) {
		// reset state and sort the categories into types
		Category.income = categories_list.filter(category => category["type"] == 0);
		Category.expense = categories_list.filter(category => category["type"] == 1);
		Category.system = categories_list.filter(category => category["type"] == 2);
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
	}
};

module.exports = Category;