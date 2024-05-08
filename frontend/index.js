/****************************************************************************
This file sets up the Single Page Application using the Mithril framework. All
"routes" are declared here. This is the entry point to the website.
*****************************************************************************/

const m = require("mithril")
const Transactions = require("./pages/transactions.jsx")
const Register = require("./pages/register.jsx")
const Login = require("./pages/login.jsx")
const Logout = require("./pages/logout.jsx")
const CreateWallet = require("./pages/create_wallet.jsx")
const Categories = require("./pages/categories.jsx")
const CategoryView = require("./pages/category_view.jsx")

const pb = require("./api");



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


m.route(document.body, "/register", {
	"/transactions": loginRequired(Transactions),
	"/wallets/create": loginRequired(CreateWallet),
	"/categories": loginRequired(Categories),
	"/category/:id": loginRequired(CategoryView),
	"/register": Register,
	"/login": Login,
	"/logout": loginRequired(Logout),
});