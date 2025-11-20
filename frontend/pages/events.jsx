const m = require("mithril")
const {Tabs} = require("mithril-materialized")
const EventSummary = require("../components/EventSummary")

// data layer imports
const Event = require("../models/Event")

const dayjs = require("../dayjs-lib")


// constants for fetch state
const WAITING = 0, READY = 1, ERROR = 2;

/**
 * This component displays all events, sorted into 2 tabs: current and past.
 * Each tab lists event summaries. You can click on one to get a report.
 * The "current" page also has a button to create a new event. If no events
 * fall into one of the tabs, then a message is displayed.
 * 
 * State:
 * fetchState: indicates whether the API has completed
 */
module.exports = {
	oninit: function(vnode) {
		vnode.state.fetchState = WAITING;
		Event.loadList()
		.then(function() {
			vnode.state.fetchState = READY;
		}).catch(function(error) {
			vnode.state.fetchState = ERROR;
		}).finally(m.redraw)
	},
	view: function(vnode) {
		const currentEvents = Event.getCurrentDuring(dayjs());

		return m(Tabs, {
			tabs: [
				{
					title: "Current",
					vnode: m("", [
						vnode.state.fetchState == READY? 
							(currentEvents.length > 0?
								// display events when they have been fetched
								m("ul.collection", 
									currentEvents.map(event => m(EventSummary, {event: event, key: event.id})))
								:
								m("i", "No current events active now. Create one with the button")
							)
							: (vnode.state.fetchState == WAITING? 
								// loading indicator when events haven't been fetched yet
								m("i", "Loading events...") : 
								// error message when fetch could not complete
								m("div.card-panel.red.accent-1", [m("span.material-icons.outlined", "error"), m("span", "Could not load events, please try again")])),
						// add new event button
						m("a.btn-floating.btn-large.waves-effect.waves-light.red", 
							{href: m.route.prefix+"/events/add"}, 
							m("i.material-icons", "add"))
					])
				},
				{
					title: "Past",
					vnode: vnode.state.fetchState == READY? 
						m("ul.collection", 
							Event.getPast(dayjs()).map(event => m(EventSummary, {event: event, key: event.id})))
						: (vnode.state.fetchState == WAITING? 
							m("i", "Loading events...") : 
							m("div.card-panel.red.accent-1", [m("span.material-icons.outlined", "error"), m("span", "Could not load events, please try again")]))
				}
			]
		})
	}
}