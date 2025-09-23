const m = require("mithril")

const dayjs = require("../dayjs-lib")

const Util = require("../models/index")

require("./TransactionSearch.css")



/**
 * This renders a simple search text input, which can be expanded to show more
 * search term fields. Attributes:
 * 
 * onSearch = an event callback. This is triggered when the user submits the
 * search form. 
 */
module.exports = function(initialVnode) {
	let showAdvancedSearch = false; // when true, show controls for advanced users

	// this object contains all the search settings. It should be serializable.
	let search = Object.assign(initialVnode.attrs.search || {}, {
		searchTerm: "",
		matchNote: true,
		matchCategory: true,
		matchEvent: false,
		matchPlace: false,
		matchPeople: false,
		after: "",
		before: dayjs().format("YYYY-MM-DD"),
		min: "",
		max: "",
	});

	return {
		view: function(vnode) {
			return (
				<form class="container" onsubmit={(e) => {e.preventDefault(); vnode.attrs.onSearch(search);}}>
					<div class="row search-wrapper">
						<div class="col s8 m10">
							<input class="search-input" placeholder="Search" value={search.searchTerm} onchange={(e) => {search.searchTerm = e.target.value;}} />
						</div>
						<div class="col s2 m1">
							<button type="submit"><i class="material-icons">search</i></button>
						</div>
						<div class="col s2 m1" title="advanced search options" onclick={() => showAdvancedSearch = !showAdvancedSearch}>
							<i class="material-icons">tune</i>
						</div>
					</div>
					<div class={showAdvancedSearch? "row" : "row hide"}>
						<div class="col s12">
							<span>The search terms above will match the description or:</span>
							<label class="mw-checkbox-inline">
								<input type="checkbox" checked={search.matchNote && "checked"} onchange={() => search.matchNote = !search.matchNote} />
								<span>note</span>
							</label>
							<label class="mw-checkbox-inline">
								<input type="checkbox" checked={search.matchCategory && "checked"} onchange={() => search.matchCategory = !search.matchCategory} />
								<span>category</span>
							</label>
							<label class="mw-checkbox-inline">
								<input type="checkbox" checked={search.matchEvent && "checked"} onchange={() => search.matchEvent = !search.matchEvent} />
								<span>event</span>
							</label>
							<label class="mw-checkbox-inline">
								<input type="checkbox" checked={search.matchPlace && "checked"} onchange={() => search.matchPlace = !search.matchPlace} />
								<span>place</span>
							</label>
							<label class="mw-checkbox-inline">
								<input type="checkbox" checked={search.matchPeople && "checked"} onchange={() => search.matchPeople = !search.matchPeople} />
								<span>people</span>
							</label>
						</div>
						<div class="col s2 m2 valign-wrapper right-align">Date</div>
						<div class="col s5 m5 input-field">
							<label class="active" for="start-date-report-filter">On or after:</label>
							<input type="date" id="start-date-report-filter" value={search.after} onchange={e => {search.after = e.target.value;}} />
						</div>
						<div class="col s5 m5 input-field">
							<label class="active" for="end-date-report-filter">On or before:</label>
							<input type="date" id="end-date-report-filter" value={search.before} onchange={e => {search.before = e.target.value}} />
						</div>
						<div class="col s2 m2 valign-wrapper right-align">Amount</div>
						<div class="col s5 m5 input-field">
							<label class="active" for="amount-min-report-filter">From:</label>
							<input type="number" id="amount-min-report-filter" value={search.min} onchange={e => {search.min = e.target.value;}} />
						</div>
						<div class="col s5 m5 input-field">
							<label class="active" for="amount-max-report-filter">To:</label>
							<input type="number" id="amount-max-report-filter" value={search.max} onchange={e => {search.max = e.target.value}} />
						</div>
					</div>
				</form>
			);
		}
	};
}