const o = require("ospec");

const Util = require("../util/index");

o.spec("Group By", function() {
	const data = [
		{index: 0, b: false},
		{index: 1, b: true},
		{index: 2, b: false}
	];

	o("group by boolean key", function() {
		const result = Util.groupBy(data, ["b"], function(groupNames, items) {
			return {groupNames: groupNames, items: items};
		});

		o(result.length).equals(2)("2 groups");
		o(result[0].groupNames.length).equals(1); // 1 group
		o(result[1].groupNames.length).equals(1); // 1 group
		o(result[0].items.length + result[1].items.length).equals(3)("3 items total");
		o(result[0].groupNames[0]).notEquals(result[1].groupNames[0])("group names are different");
	});

	o("group by boolean key and sum", function() {
		const result = Util.groupBy(data, ["b"], function(groupNames, items) {
			return {
				odd: groupNames[0],
				sum: items.map(object => object.index).reduce((sum, num) => sum+num, 0)
			};
		});

		o(result.length).equals(2)("2 groups");
		o(result[0].odd).notEquals(result[1].odd)("not both odd");
		o(result[0].sum + result[1].sum).equals(3)("sum 3");

		result.sort(function(a, b) {
			if(a.odd) return -1;
			return 1;
		});

		o(result[0].sum).equals(1)("odd first");
		o(result[1].sum).equals(2)("even second");
	});

	const data2 = [
		{direction: 0, category: "a", money: 1},
		{direction: 0, category: "b", money: 2},
		{direction: 0, category: "a", money: 10},
		{direction: 0, category: "b", money: 20},
		{direction: 1, category: "a", money: 100},
		{direction: 1, category: "b", money: 200},
		{direction: 1, category: "a", money: 1000},
		{direction: 1, category: "b", money: 2000},
	];

	o("group by number and string", function() {
		const result = Util.groupBy(
			data2, 
			["direction", "category"], 
			function(groupNames, items) {
				return {
					direction: groupNames[0], 
					category: groupNames[1],
					money: items.reduce((sum, object) => sum+object.money, 0)
				};
			}
		);

		o(result.length).equals(4)("4 groups");
		
		result.sort(function(a, b) {
			if(a.direction < b.direction) return -1;
			else if(a.direction > b.direction) return 1;
			else {
				if(a.category < b.category) return -1;
				return 1;
			}
		});

		o(result[0]).deepEquals({direction: '0', category: "a", money: 11});
		o(result[1]).deepEquals({direction: '0', category: "b", money: 22});
		o(result[2]).deepEquals({direction: '1', category: "a", money: 1100});
		o(result[3]).deepEquals({direction: '1', category: "b", money: 2200});
	});

});

const stream = require("mithril/stream");

o.spec("streams", function() {
	o("stream skips duplicate", function() {
		let timesInvoked = 0;

		let a = stream(1);
		let b = a.map(a => {
			timesInvoked++;
			return a + 1;
		});

		o(timesInvoked).equals(1)("map invoked first time");

		a(1);
		a(1);
		a(1);
		o(timesInvoked).equals(4)("map invoked with duplicate value");

		a(2);
		o(timesInvoked).equals(5)("map invoked with second value");
	})
})