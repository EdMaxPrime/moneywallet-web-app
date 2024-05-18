const m = require("mithril")
const TransactionListPageable = require("../components/TransactionListPageable")

const Category = require("../models/Category")
const Transaction = require("../models/Transaction")

module.exports = {
	view: function(vnode) {
		const category = Category.getById(vnode.attrs.id);

		return (
			<div>
				<div class="container">
					<p>
						<label>
							<input type="radio" disabled="disabled" name="type" value="Income" id="income" checked={category["type"] == 0} />
							<span>Income</span>
						</label>
					</p>
					<p>
						<label>
							<input type="radio" disabled="disabled" name="type" value="Expense" id="expense" checked={category["type"] == 1} />
							<span>Expense</span>
						</label>
					</p>
				</div>
				<TransactionListPageable fetch={Transaction.getByCategory} arg={[vnode.attrs.id]} />
			</div>
		);
	}
};