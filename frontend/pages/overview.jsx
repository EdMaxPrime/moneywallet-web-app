const m = require("mithril")
const HighchartsContainer = require("../components/HighchartsContainer")
const CashflowInteractive = require("../components/CashflowInteractive")
const NetWorthChart = require("../components/NetWorthChart")

const Currency = require("../models/Currency")
const Report = require("../models/Report")
const Util = require("../models/index")
const Wallet = require("../models/Wallet")

const dayjs = require("../dayjs-lib")




module.exports = function() {
	// filters for reports
	let startDate = dayjs("2024-01-01 00:00"); //only include transactions within the date range
	let endDate = dayjs("2024-05-01 00:00");
	let event = null; // only include transactions matching the event, unless event=null
	let grouping = "month"; // create groups for this time period by summing
	let categories = []; // only include transactions from these categories
	let wallets = "Total"; // only include transactions for this wallet

	return {
		view: function(vnode) {
			return (
				<div>
					<h3 class="section">Filters</h3>
					<form class="row" onsubmit={event => {event.preventDefault(); applyFilters(); allowChartUpdate = true;}}>
						<div class="col s6 m6 input-field">
							<label class="active" for="start-date-report-filter">Start date:</label>
							<input type="date" id="start-date-report-filter" value={startDate.format("YYYY-MM-DD")} onchange={e => {allowChartUpdate=true; startDate = dayjs(e.target.value)}} />
						</div>
						<div class="col s6 m6 input-field">
							<label class="active" for="end-date-report-filter">End date:</label>
							<input type="date" id="end-date-report-filter" value={endDate.format("YYYY-MM-DD")} onchange={e => {allowChartUpdate=true; endDate = dayjs(e.target.value)}} />
						</div>
						<div class="col s6 m4 input-field">
							<label class="active">Group By:</label>
							<select class="browser-default" value={grouping} onchange={e => {grouping = e.target.value}}>
								<option value="day">Day</option>
								<option value="week">Week</option>
								<option value="biweekly">Biweekly (2 week periods)</option>
								<option value="month">Month</option>
								<option value="quarter">Quarter</option>
								<option value="year">Year</option>
							</select>
						</div>
						<div class="col s6 m4 input-field">
							<label class="active">Wallet:</label>
							<select class="browser-default" onchange={e => {allowChartUpdate=true; wallets=e.target.value}}>
								{Wallet.list.map(function(wallet) {
									return (<option value={wallet.id} key={wallet.id} selected={wallets == wallet.id}>{wallet.name}</option>)
								})}
								<option value="Total" selected={wallets == "Total"}>Total</option>
							</select>
						</div>
						<button class="col s12 btn waves-effect waves-light" type="submit">
							Filter <i class="material-icons right">filter_list</i>
						</button>
					</form>
					<div class="divider" />
					<h3 class="section">Reports</h3>
					<NetWorthChart filters={{startDate: startDate, endDate: endDate, wallets: wallets}} grouping={grouping} />
					<CashflowInteractive filters={{startDate: startDate, endDate: endDate, wallets: wallets}} grouping={grouping} />
				</div>
			);
		}
	};
}