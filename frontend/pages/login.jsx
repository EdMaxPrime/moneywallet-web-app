const m = require("mithril");
const Layout = require("../layouts/no_login.jsx");
const {EmailInput, PasswordInput} = require("mithril-materialized");

const User = require("../models/User");

module.exports = (function() {
	let email = "", password = "";
	let errorMessage = "";

	function login() {
		User.login(email, password)
		.then(function() {
			errorMessage = "";
			m.route.set("/transactions");
		}).catch(function(error) {
			errorMessage = error.message;
			m.redraw();
		});
	}

	return {
		view: function(vnode) {
			return (<Layout>
				<h1>Login</h1>
				{errorMessage.length > 0 && (
					<div class="card-panel red accent-1"><span class="material-icons outlined">error</span>&nbsp;{errorMessage}</div>
				)}
				<div class="row">
					<form class="col s12" onsubmit={login}>
						<EmailInput label="Email" value={email} onchange={v => email = v} />
						<PasswordInput label="Password" value={password} onchange={v => password = v} />
						<button class="btn waves-effect waves-light" type="submit">Login</button>
					</form>
					<p class="col s12">Don't have an account yet? <m.route.Link href="/register">Register</m.route.Link></p>
				</div>
			</Layout>);
		}
	}
})();