const m = require("mithril");
const Layout = require("../layouts/no_login.jsx");

const pb = require("../api");

module.exports = (function() {
	let email = "", password = "";
	let errorMessage = "";

	function login() {
		pb.collection('users').authWithPassword(email, password)
		.then(function() {
			console.log(pb.authStore);
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
						<div class="input-field">
							<input id="signup_email" type="email" class="validate" oninput={function(e) {email = e.target.value;}}></input>
							<label for="signup_email">Email</label>
						</div>
						<div class="input-field">
							<input id="signup_password" type="password" class="validate" oninput={function(e) {password = e.target.value;}}></input>
							<label for="signup_password">Password</label>
						</div>
						<button class="btn waves-effect waves-light" type="submit">Login</button>
					</form>
					<p class="col s12">Don't have an account yet? <m.route.Link href="/register">Register</m.route.Link></p>
				</div>
			</Layout>);
		}
	}
})();