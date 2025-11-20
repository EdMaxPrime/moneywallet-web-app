// presentation layer imports
const m = require("mithril")
const {Breadcrumb, createBreadcrumb, Button} = require("mithril-materialized")
const EventSummary = require("../components/EventSummary.jsx")

// data layer imports
const Event = require("../models/Event")


/**
 * This component shows some reports about a particular event.
 * 
 * Attributes:
 * @attribute event_id  the string id of the event for the API
 */
module.exports = function() {
	return {
		view: function(vnode) {
			let event = Event.getById(vnode.attrs.event_id);

			// not found
			if(event == null) {
				return m("div.card-panel.red.accent-1", [
					m("span.material-icons.outlined", "error"), 
					m("span", "This event does not exist. The link may have been incorrect.")
				]);
			}

			// found
			return m("", [
				m(".row", [
					m(".col s12 m6",
						m(Breadcrumb, {
							showHome: false,
							showIcons: true,
							separator: "chevron_right",
							items: [
								{text: "Home", href: "", active: false}, 
								{text: "Events", href: m.route.prefix+"/events", active: false},
								{text: event.name, href: m.route.get(), active: true},
							],
						})
					),
					m(".col s12 m6 right-align", [
						m(Button, {
							label: "Edit",
							iconName: "edit",
							style: "margin-right: 15px",
							href: m.route.prefix+m.route.get()+"/edit"
						}),
						m(Button, {
							label: "Delete",
							iconName: "delete",
							className: "black-text grey lighten-1",
							onclick: () => alert("This feature is not implemented yet.")
						})
					]),
				]),
				m("ul.collection", 
					m(EventSummary, {event: event}))
			])
		}
	}
}