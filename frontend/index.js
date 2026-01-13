/****************************************************************************
This file sets up the Single Page Application using the Mithril framework. All
"routes" are declared here. This is the entry point to the website.
*****************************************************************************/

// Mithril Page Imports
const m = require("mithril")
const Budgets = require("./pages/budgets.jsx")
const BudgetAdd = require("./pages/budget_add.jsx")
const BudgetDetails = require("./pages/budget_details.jsx")
const Categories = require("./pages/categories.jsx")
const CategoryView = require("./pages/category_view.jsx")
const CreateWallet = require("./pages/create_wallet.jsx")
const Events = require("./pages/events.jsx")
const EventDetails = require("./pages/event_details.jsx")
const JsonImport = require("./pages/import.jsx")
const Layout = require("./layouts/Layout.jsx")
const Login = require("./pages/login.jsx")
const Logout = require("./pages/logout.jsx")
const Overview = require("./pages/overview.jsx")
const Register = require("./pages/register.jsx")
const ReportCategories = require("./pages/report_detailed.jsx")
const Settings = require("./pages/settings.jsx")
const Transactions = require("./pages/transactions.jsx")
const TransactionBulkEdit = require("./pages/transaction_bulk_edit.jsx")
const TransactionSearch = require("./pages/transaction_search.jsx")
const Welcome = require("./pages/welcome.jsx")

// Pocketbase API imports
const pb = require("./api")
const Category = require("./models/Category")
const Report = require("./models/Report")
const Util = require("./models/index")



/**
 * This creates a Mithril RouteResolver. It will show the wrapped page if the
 * user is logged in. Otherwise, it will redirect to the login page.
 * @param page  the Mithril Component to display if the user has permission
 * @return  a RouteResolver with logic to check for permission using Pocketbase
 */
function loginRequired(page) {
	return {
		onmatch: function() {
			if(!pb.authStore.isValid) {
				m.route.set("/login");
			}
			else return page;
		}
	}
}

/**
 * This creates a Mithril RouteResolver. It will show the wrapped page if the
 * user is logged in AND we have fetched their data from the server. See
 * loadParentEntities() for details of what is fetched. It will wait for the
 * request to complete. If you are not logged in, it will redirect to the login
 * page.
 * @param page  the Mithril component to display if the user has permission. Do
 * NOT wrap it in any Layout component, this will be done by this method to
 * avoid unecessary teardown.
 * @param title  the title to display in the Layout above the page. Either a
 * string, or a function which returns a string and takes page route params
 * @param otherData  optional. A function that returns a promise that fetches
 * data before the page is rendered.
 * @return a RouteResolver with logic to check for permission and fetch data
 */
function loginAndDataRequired(page, title, otherData) {
	let dataLoading = true,
	dataRequestError = null,
	dataResult = null;
	return {
		onmatch: function(routeParameters) {
			// if you are not logged in, redirect
			if(!pb.authStore.isValid) {
				m.route.set("/login");
			} 
			// if you are logged in, load page
			else {
				if(otherData) {
					return new Promise(function(resolve, reject) {
						Util.loadParentEntities()
						.then(() => otherData(routeParameters))
						.then(data => {
							dataLoading = false;
							dataResult = data;
							resolve(data);
						})
						.catch(error => {
							dataRequestError = error;
							reject(error);
						});
					});
				} else {
					return Util.loadParentEntities();
				}
			}
		},
		render: function(vnode) { //vnode.attrs is route parameters from the url
			return m(
				Layout, 
				{
					"title": typeof title == "function"? title(vnode.attrs) : title
				}, 
				m(
					page, 
					Object.assign({dataLoading, dataRequestError, dataResult}, vnode.attrs)
				)
			);
		}
	};
}


m.route(document.body, "/register", {
	"/transactions": loginAndDataRequired(Transactions, "Transactions"),
	"/transactions/search": loginAndDataRequired(TransactionSearch, "Search Results"),
	"/transactions/bulk_edit": loginAndDataRequired(TransactionBulkEdit, "Edit Many At Once"),
	"/wallets/create": loginAndDataRequired(CreateWallet, "Create Wallet"),
	"/categories": loginAndDataRequired(Categories, "Categories"),
	"/category/:id": loginAndDataRequired(CategoryView, parameters => Category.getById(parameters.id).name),
	"/overview": loginAndDataRequired(Overview, "Overview"),
	"/report/categories": loginAndDataRequired(ReportCategories, "Categories Report"),
	"/budgets": loginAndDataRequired(Budgets, "Budgets"),
	"/budget/:budget_id": loginAndDataRequired(BudgetDetails, parameters => Util.budgetName(parameters.budget_id)),
	"/budgets/new": loginAndDataRequired(BudgetAdd, "New Budget"),
	"/events": loginAndDataRequired(Events, "Events"),
	"/event/:event_id": loginAndDataRequired(EventDetails, "Event Report"),
	"/import": loginAndDataRequired(JsonImport, "JSON Import"),
	"/settings": loginAndDataRequired(Settings, "Settings"),
	"/welcome": loginAndDataRequired(Welcome, "Welcome"),
	"/register": Register,
	"/login": Login,
	"/logout": loginRequired(Logout),
});