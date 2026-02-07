const m = require("mithril")
const CategoryPicker = require("./CategoryPicker")
const CategoryItem = require("./CategoryItem")
const {HelperText, ModalPanel} = require("mithril-materialized")

const Category = require("../models/Category")


/**
 * Attributes:
 * 
 * @attribute category  string. The ID of the selected category. Optional.
 * 
 * @attribute disabled  boolean. Default false. If true, then the modal won't
 * open when clicked.
 * 
 * @attribute onselection  function. This will be called when the user picks a
 * category. The category will be provided as the parameter.
 * 
 * State:
 * isOpen  boolean. Controls the modal.
 */
module.exports = {
	view: function(vnode) {
		const {category, disabled, onselection} = vnode.attrs;

		return m(".input-field", [
			m(".material-icons.prefix", "category"),
			m(HelperText, {helperText: "Category"}),
			m(".select-wrapper", 
				category? m(CategoryItem, {
					category: Category.getById(category),
					onclick: () => {
						if(!disabled)
							vnode.state.isOpen = true;
					}
				})
				:
				m("input[type=text][readonly=true].select-dropdown", {
					value: "None",
					onclick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!disabled) {
                            vnode.state.isOpen = true;
                        }
                    },
				})
			),
			m(ModalPanel, {
				title: "Choose category",
				description: m(CategoryPicker, {
					showMetaCategories: false,
					selectedIds: [],
					onselection: (selectedIds) => {
						if(typeof onselection == "function") {
							onselection(selectedIds[0]);
						}
						vnode.state.isOpen = false;
					},
					multiple: false,
				}),

				isOpen: vnode.state.isOpen,
				onToggle: open => {
					vnode.state.isOpen = open;
				}
			})
		])
	}
};