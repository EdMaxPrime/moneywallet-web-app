/****************************************************************************
This file sets up the Single Page Application using the Mithril framework. All
"routes" are declared here. This is the entry point to the website.
*****************************************************************************/

const m = require("mithril")
const Categories = require("./pages/categories.jsx")
const CategoryView = require("./pages/category_view.jsx")
const CreateWallet = require("./pages/create_wallet.jsx")
const JsonImport = require("./pages/import.jsx")
const Layout = require("./layouts/Layout.jsx")
const Login = require("./pages/login.jsx")
const Logout = require("./pages/logout.jsx")
const Overview = require("./pages/overview.jsx")
const Register = require("./pages/register.jsx")
const Transactions = require("./pages/transactions.jsx")

const pb = require("./api")
const Category = require("./models/Category")
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
 * @return a RouteResolver with logic to check for permission and fetch data
 */
function loginAndDataRequired(page, title) {
	return {
		onmatch: function() {
			if(!pb.authStore.isValid) {
				m.route.set("/login");
			} else {
				return Util.loadParentEntities()
			}
		},
		render: function(vnode) { //vnode.attrs is route parameters from the url
			return m(Layout, {
				"title": typeof title == "function"? title(vnode.attrs) : title
			}, m(page, vnode.attrs));
		}
	};
}


m.route(document.body, "/register", {
	"/transactions": loginAndDataRequired(Transactions, "Transactions"),
	"/wallets/create": loginAndDataRequired(CreateWallet, "Create Wallet"),
	"/categories": loginAndDataRequired(Categories, "Categories"),
	"/category/:id": loginAndDataRequired(CategoryView, parameters => Category.getById(parameters.id).name),
	"/overview": loginAndDataRequired(Overview, "Overview"),
	"/import": loginAndDataRequired(JsonImport, "JSON Import"),
	"/register": Register,
	"/login": Login,
	"/logout": loginRequired(Logout),
});