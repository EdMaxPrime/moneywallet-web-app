const m = require("mithril")
const CategoryItem = require("./CategoryItem")
const {MaterialIcon, Tabs} = require("mithril-materialized")

const Category = require("../models/Category")


/**********************************************************
 * the following is modified from Mithril-Materialized
 **********************************************************/

// Utility function to check if a node is the last in its branch
const isNodeLastInBranch = (nodePath, rootNodes) => {
    // Navigate to the node's position and check if it's the last child at every level
    let currentNodes = rootNodes;
    for (let i = 0; i < nodePath.length; i++) {
        const index = nodePath[i];
        const isLastAtThisLevel = index === currentNodes.length - 1;
        // If this is not the last child at this level, then this node is not last in branch
        if (!isLastAtThisLevel) {
            return false;
        }
        // Move to the next level if it exists
        if (i < nodePath.length - 1) {
            const currentNode = currentNodes[index];
            if (currentNode.children) {
                currentNodes = currentNode.children;
            }
        }
    }
    return true;
};
const TreeNodeComponent = () => {
    return {
        view: ({ attrs }) => {
            const { node, level, isSelected, isExpanded, isFocused, showConnectors, iconType, selectionMode, onToggleExpand, onToggleSelect, onFocus, } = attrs;
            const hasChildren = node.children && node.children.length > 0;
            const indentLevel = level * 24; // 24px per level
            return m('li.tree-node', {
                class: [
                    isSelected && 'selected',
                    isFocused && 'focused',
                    node.disabled && 'disabled',
                    hasChildren && 'has-children',
                    attrs.isLastInBranch && 'tree-last-in-branch',
                ]
                    .filter(Boolean)
                    .join(' ') || undefined,
                'data-node-id': node.id,
                'data-level': level,
            }, [
                // Node content
                m('.tree-node-content', {
                    style: {
                        paddingLeft: `${indentLevel}px`,
                    },
                    onclick: node.disabled
                        ? undefined
                        : () => {
                            if (selectionMode !== 'none') {
                                onToggleSelect(node.id);
                            }
                            onFocus(node.id);
                        },
                    onkeydown: (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (!node.disabled && selectionMode !== 'none') {
                                onToggleSelect(node.id);
                            }
                        }
                    },
                    tabindex: node.disabled ? -1 : 0,
                    role: selectionMode === 'multiple' ? 'option' : 'treeitem',
                    'aria-selected': selectionMode !== 'none' ? isSelected.toString() : undefined,
                    'aria-expanded': hasChildren ? isExpanded.toString() : undefined,
                    'aria-disabled': node.disabled ? 'true' : undefined,
                }, [
                    // Connector lines
                    showConnectors &&
                        level > 0 &&
                        m('.tree-connectors', Array.from({ length: level }, (_, i) => m('.tree-connector', {
                            key: i,
                            style: { left: `${i * 24 + 12}px` },
                        }))),
                    // Expand/collapse icon or spacer
                    hasChildren
                        ? m('.tree-expand-icon', {
                            onclick: (e) => {
                                e.stopPropagation();
                                if (!node.disabled) {
                                    onToggleExpand(node.id);
                                }
                            },
                            class: iconType,
                        }, [
                            iconType === 'plus-minus'
                                ? m('span.tree-plus-minus', isExpanded ? '−' : '+')
                                : iconType === 'triangle'
                                    ? m('span.tree-triangle', { class: isExpanded ? 'expanded' : undefined }, '▶')
                                    : iconType === 'chevron'
                                        ? m(MaterialIcon, {
                                            name: 'chevron',
                                            direction: isExpanded ? 'down' : 'right',
                                            class: 'tree-chevron-icon',
                                        })
                                        : m(MaterialIcon, {
                                            name: 'caret',
                                            direction: isExpanded ? 'down' : 'right',
                                            class: 'tree-caret-icon',
                                        }),
                        ])
                        : m('.tree-expand-spacer'), // Spacer for alignment
                    // Selection indicator for multiple selection
                    selectionMode === 'multiple' &&
                        m('.tree-selection-indicator', [
                            m('input[type=checkbox]', {
                                checked: isSelected,
                                disabled: node.disabled,
                                onchange: () => {
                                    if (!node.disabled) {
                                        onToggleSelect(node.id);
                                    }
                                },
                                onclick: (e) => e.stopPropagation(),
                            }),
                        ]),
                    // Node icon (optional)
                    //node.icon && m('i.tree-node-icon.material-icons', node.icon),
                    // Node label
                    m(CategoryItem, {category: node}),
                    //m('span.tree-node-label', node.label),
                ]),
                // Children (recursive)
                hasChildren &&
                    isExpanded &&
                    m('ul.tree-children', {
                        role: 'group',
                        'aria-expanded': 'true',
                    }, node.children.map((child, childIndex) => {
                        var _a, _b, _c, _d, _e, _f;
                        // Calculate state for each child using treeState
                        const childIsSelected = (_b = (_a = attrs.treeState) === null || _a === void 0 ? void 0 : _a.selectedIds.has(child.id)) !== null && _b !== void 0 ? _b : false;
                        const childIsExpanded = (_d = (_c = attrs.treeState) === null || _c === void 0 ? void 0 : _c.expandedIds.has(child.id)) !== null && _d !== void 0 ? _d : false;
                        const childIsFocused = ((_e = attrs.treeState) === null || _e === void 0 ? void 0 : _e.focusedNodeId) === child.id;
                        // Calculate if this child is last in branch
                        const childPath = [...(attrs.currentPath || []), childIndex];
                        const childIsLastInBranch = ((_f = attrs.treeAttrs) === null || _f === void 0 ? void 0 : _f.data) ?
                            isNodeLastInBranch(childPath, attrs.treeAttrs.data) : false;
                        return m(TreeNodeComponent, {
                            key: child.id,
                            node: child,
                            level: level + 1,
                            isSelected: childIsSelected,
                            isExpanded: childIsExpanded,
                            isFocused: childIsFocused,
                            showConnectors,
                            iconType,
                            selectionMode,
                            onToggleExpand,
                            onToggleSelect,
                            onFocus,
                            isLastInBranch: childIsLastInBranch,
                            currentPath: childPath,
                            treeState: attrs.treeState,
                            treeAttrs: attrs.treeAttrs,
                        });
                    })),
            ]);
        },
    };
};
const TreeView = () => {
    const state = {
        selectedIds: new Set(),
        expandedIds: new Set(),
        focusedNodeId: null,
        treeMap: new Map(),
    };
    const buildTreeMap = (nodes, map) => {
        nodes.forEach((node) => {
            map.set(node.id, node);
            if (node.children) {
                buildTreeMap(node.children, map);
            }
        });
    };
    const initializeExpandedNodes = (nodes) => {
        nodes.forEach((node) => {
            if (node.expanded) {
                state.expandedIds.add(node.id);
            }
            if (node.children) {
                initializeExpandedNodes(node.children);
            }
        });
    };
    const handleToggleExpand = (nodeId, attrs) => {
        var _a;
        const isExpanded = state.expandedIds.has(nodeId);
        if (isExpanded) {
            state.expandedIds.delete(nodeId);
        }
        else {
            state.expandedIds.add(nodeId);
        }
        (_a = attrs.onexpand) === null || _a === void 0 ? void 0 : _a.call(attrs, { nodeId, expanded: !isExpanded });
    };
    const handleToggleSelect = (nodeId, attrs) => {
        var _a;
        const { selectionMode = 'single' } = attrs;
        if (selectionMode === 'single') {
            state.selectedIds.clear();
            state.selectedIds.add(nodeId);
        }
        else if (selectionMode === 'multiple') {
            if (state.selectedIds.has(nodeId)) {
                state.selectedIds.delete(nodeId);
            }
            else {
                state.selectedIds.add(nodeId);
            }
        }
        (_a = attrs.onselection) === null || _a === void 0 ? void 0 : _a.call(attrs, Array.from(state.selectedIds));
    };
    const handleFocus = (nodeId) => {
        state.focusedNodeId = nodeId;
    };
    const renderNodes = (nodes, attrs, level = 0, parentPath = []) => {
        return nodes.map((node, index) => {
            var _a, _b, _c;
            const isSelected = state.selectedIds.has(node.id);
            const isExpanded = state.expandedIds.has(node.id);
            const isFocused = state.focusedNodeId === node.id;
            const currentPath = [...parentPath, index];
            const isLastInBranch = isNodeLastInBranch(currentPath, attrs.data);
            return m(TreeNodeComponent, {
                key: node.id,
                node,
                level,
                isSelected,
                isExpanded,
                isFocused,
                showConnectors: (_a = attrs.showConnectors) !== null && _a !== void 0 ? _a : true,
                iconType: (_b = attrs.iconType) !== null && _b !== void 0 ? _b : 'caret',
                selectionMode: (_c = attrs.selectionMode) !== null && _c !== void 0 ? _c : 'single',
                onToggleExpand: (nodeId) => handleToggleExpand(nodeId, attrs),
                onToggleSelect: (nodeId) => handleToggleSelect(nodeId, attrs),
                onFocus: handleFocus,
                isLastInBranch,
                currentPath,
                // Pass state and attrs for recursive rendering
                treeState: state,
                treeAttrs: attrs,
            });
        });
    };
    return {
        oninit: ({ attrs }) => {
            // Build internal tree map for efficient lookups
            buildTreeMap(attrs.data, state.treeMap);
            // Initialize expanded nodes from data
            initializeExpandedNodes(attrs.data);
            // Initialize selected nodes from props
            if (attrs.selectedIds) {
                state.selectedIds = new Set(attrs.selectedIds);
            }
        },
        onupdate: ({ attrs }) => {
            // Sync selectedIds prop with internal state
            if (attrs.selectedIds) {
                const newSelection = new Set(attrs.selectedIds);
                if (newSelection.size !== state.selectedIds.size ||
                    !Array.from(newSelection).every((id) => state.selectedIds.has(id))) {
                    state.selectedIds = newSelection;
                }
            }
        },
        view: ({ attrs }) => {
            const { data, className, style, id, selectionMode = 'single', showConnectors = true } = attrs;
            return m('div.tree-view', {
                class: [
                    className,
                    showConnectors && 'show-connectors'
                ].filter(Boolean).join(' ') || undefined,
                style,
                id,
                role: selectionMode === 'multiple' ? 'listbox' : 'tree',
                'aria-multiselectable': selectionMode === 'multiple' ? 'true' : 'false',
            }, [
                m('ul.tree-root', {
                    role: 'group',
                }, renderNodes(data, attrs)),
            ]);
        },
    };
};



/**
 * This component renders a UI widget that shows the category tree. The user
 * interacts by clicking on a category. The results of the selection are
 * revealed in an event listener.
 * 
 * Attributes:
 * 
 * @attribute selectedIds  array of category IDs. If present, then this is a
 * "controlled" component, meaning the state is managed outside the component.
 * Use onselection and selectedIds to get/set the state.
 * It may be an empty list to clear the selection.
 * 
 * @attribute multiple  boolean, default false. If false, then only one category
 * can be selected at a time. When the selection is made the event is fired. If
 * true, then multiple categories can be part of a selection.
 * 
 * @attribute onselection  event listener callback function. This function will be
 * called when a selection is made. It should accept one parameter, an array of
 * Category IDs. If multiple=false, then there will only be one item in the
 * array.
 * 
 * @attribute showMetaCategories  boolean, default false. If true, then the 
 * options will include meta categories computer by the app like "All Income".
 */

module.exports = (function() {
	return {
		view: function(vnode) {
			return m(Tabs, {
				tabs: [
					{
						title: "Income",
						vnode: m(TreeView, {
                            data: vnode.attrs.showMetaCategories? Category.getIncomeTree() : Category.getTree(Category.income),
							selectionMode: vnode.attrs.multiple? "multiple" : "single",
							selectedIds: vnode.attrs.selectedIds,
							iconType: "caret",
							showConnectors: true,
							onselection: vnode.attrs.onselection,
						}),
					},
					{
						title: "Expenses",
						vnode: m(TreeView, {
							data: vnode.attrs.showMetaCategories? Category.getExpenseTree() : Category.getTree(Category.expense),
							selectionMode: vnode.attrs.multiple? "multiple" : "single",
							selectedIds: vnode.attrs.selectedIds,
							iconType: "caret",
							showConnectors: true,
							onselection: vnode.attrs.onselection,
						}),
					},
					{
						title: "System",
						vnode: m(TreeView, {
							data: Category.getTree(Category.system),
							selectionMode: vnode.attrs.multiple? "multiple" : "single",
							selectedIds: vnode.attrs.selectedIds,
							iconType: "caret",
							showConnectors: true,
							onselection: vnode.attrs.onselection,
						}),
					},
				],
			});
		}
	};
})