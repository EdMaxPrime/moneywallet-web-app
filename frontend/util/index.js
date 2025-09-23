
/**
 * Map and reduce a list of objects with the same structure.
 * @param list  the items
 * @param groupedKeys  a list of criteria to group objects. This list can't be
 * empty. Each criteria can be a (string) object key, then identical values for
 * the key will be grouped together. Or, it can be a function, which takes 1
 * object as a parameter and must return a string group name.
 * @param aggregate  a function that converts a group into a single object/value.
 * It accepts two parameters: 
 * (1) a list of group names, in the same order as groupedKeys
 * (2) a list of items in that group.
 * And returns one object/value representing the group.
 * @return list of objects/values, one per group.
 */
const groupBy = function(list, groupedKeys, aggregate) {
	let tree = {};
	// transform all grouping keys to functions to make them easier to invoke
	const groupingFunctions = groupedKeys.map(function(key) {
		if(typeof key === "string") {
			return function(object) {return object[key];}
		}
		return key;
	});
	// (1) loop through list
	for(item of list) {
		let pointer = tree;
		// (2) run each grouping function on the item, build the tree of nested groups
		for(let i = 0; i < groupingFunctions.length; i++) {
			// get group name
			let groupName = groupingFunctions[i](item);
			// if this group hasn't been encountered in this tree, create the structure
			if(!(groupName in pointer)) {
				// at the leaf level, create an array to hold items
				if(i == groupingFunctions.length-1) {
					pointer[groupName] = [];
				} else { // otherwise, create a subtree to hold more groups
					pointer[groupName] = {};
				}
			}
			// move pointer down the tree
			pointer = pointer[groupName];
		}
		// (3) sort item into groups
		pointer.push(item);
	}

	const recursiveDepthFirstTraversal = function(subtree, groupNames) {
		// if we reached the leaves of the tree, the list of items, then run aggregate function
		if(groupNames.length == groupedKeys.length) {
			return [aggregate(groupNames, subtree)];
		}
		// otherwise, recursively call this function on each subtree, and collect the groups into a list
		else {
			let results = [];
			for(let groupName in subtree) {
				results = results.concat(recursiveDepthFirstTraversal(subtree[groupName], groupNames.concat([groupName])));
			}
			return results;
		}
	}

	// (4) loop through groups
		// (5) produce one object that has all the keys from the aggregate template
	// return a list of objects, one per group
	return recursiveDepthFirstTraversal(tree, []);
}


/**
 * Test if two objects are equal based on their properties. No deep equality
 * @param object1  an object
 * @param object2  an object
 * @return true if they are equal, false if not
 */
const shallowEquals = function(object1, object2) {
	let keys1 = Object.keys(object1);
	let keys2 = Object.keys(object2);

	if(keys1.length != keys2.length) {
		return false;
	}

	for(key of keys1) {
		if(object1[key] !== object2[key]) {
			return false;
		}
	}

	return true;
}


module.exports = {
	groupBy: groupBy,
	shallowEquals: shallowEquals,
};