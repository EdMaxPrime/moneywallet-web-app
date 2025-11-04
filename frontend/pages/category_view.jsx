const m = require("mithril")
const TransactionListPageable = require("../components/TransactionListPageable")

const Category = require("../models/Category")
const Transaction = require("../models/Transaction")

/**
 * This component shows some information about a category and a list of
 * transactions that are organized in this category.
 * 
 * Attributes:
 * @attribute id  the string id of the category, required
 */
module.exports = {
	view: function(vnode) {
		const category = Category.getById(vnode.attrs.id);
		const filterTransactionsByCategory = {
			filter: 'category = "' + vnode.attrs.id + '"',
			sort: "-date",
			expand: "event,place,people,data_source",
		};

		return (
			<div>
				<div class="container">
					<p class="row"><span class="col s4">Type:</span>
						<label class="col s4">
							<input type="radio" disabled="disabled" name="type" value="Income" id="income" checked={category["type"] == 0} />
							<span>Income</span>
						</label>
						<label class="col s4">
							<input type="radio" disabled="disabled" name="type" value="Expense" id="expense" checked={category["type"] == 1} />
							<span>Expense</span>
						</label>
					</p>
					<p>
						<label>
							<input type="checkbox" disabled="disabled" checked={category["show_in_report"]} />
							<span>Include this category in reports</span>
						</label>
					</p>
				</div>
				<TransactionListPageable fetch={Transaction.loadSome} arg={filterTransactionsByCategory} />
			</div>
		);
	}
};