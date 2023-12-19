const m = require("mithril");
const Layout = require("../layouts/no_login.jsx");

const pb = require("../api");


module.exports = (function() {
	let user = {
	    "username": "",
	    "email": "",
	    "emailVisibility": true,
	    "password": "",
	    "passwordConfirm": "",
	    "name": "user 1"
	};

	let showError = false;

	function register(event) {
		event.preventDefault();

		pb.collection('users').create(user).then(function(record) {
			console.log(record);
		}).catch(function(error) {
			showError = true;
			console.log(error);
			m.redraw();
		})
	};

	return {
		view: function(vnode) {
			return (<Layout>
				<h1>Create Account</h1>
				{showError && (
					<div class="card-panel red accent-1"><span class="material-icons outlined">error</span>&nbsp; There was an error signing up</div>
				)}
				<div class="row">
					<form class="col s12" onsubmit={register}>
						<div class="input-field">
							<input id="signup_email" type="email" class="validate" oninput={function(e) {user.email = e.target.value;}}></input>
							<label for="signup_email">Email</label>
						</div>
						<div class="input-field">
							<input id="signup_password" type="password" class="validate" oninput={function(e) {user.password = e.target.value;}}></input>
							<label for="signup_password">Password</label>
							<span class="helper-text">Password should be at least 8 characters</span>
						</div>
						<div class="input-field">
							<input id="signup_password_confirm" type="password" class="validate" oninput={function(e) {user.passwordConfirm = e.target.value;}}></input>
							<label for="signup_password_confirm">Confirm password by typing it again</label>
							<span class="helper-text" data-error="passwords don't match"/>
						</div>
						<button class="btn waves-effect waves-light" type="submit">Register</button>
					</form>
					<p class="col s12">Already have an account? <m.route.Link href="/login">Login</m.route.Link></p>
				</div>
			</Layout>);
		}
	};
})();