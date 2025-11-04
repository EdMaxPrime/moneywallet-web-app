// Presentation layer imports
const m = require("mithril")
const CategoryPicker = require("../components/CategoryPicker.jsx")




/**
 * This component shows all the categories. When you click on a category, you
 * will be sent to the page devoted to that category. Can be improved with real
 * links instead of an event listener.
 */
module.exports = {
	view: function(vnode) {
		return m(CategoryPicker, {
			multiple: false,
			showMetaCategories: false,
			selectedIds: [],
			onselection: function(selectedIds) {
				m.route.set("/category/" + selectedIds[0]);
			},
		});
	}
}