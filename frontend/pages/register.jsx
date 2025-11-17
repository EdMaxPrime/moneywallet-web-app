const m = require("mithril");
const Layout = require("../layouts/no_login.jsx");
const {EmailInput, PasswordInput} = require("mithril-materialized");

const User = require("../models/User");


module.exports = (function() {
	let user = {
	    "username": "",
	    "email": "",
	    "emailVisibility": true,
	    "password": "",
	    "passwordConfirm": "",
	    "name": "user 1"
	};

	let errors = {
		email: {
			wrong: false,
			value: "",
			message: "",
		},
		password: {
			wrong: false,
			value: "",
			message: "",
		},
		passwordConfirm: {
			wrong: false,
			value: "",
			message: "",
		}
	}

	let showError = false;

	function register(event) {
		event.preventDefault();

		User.create(user).then(function(record) {
			for(let key in errors) {
				errors[key]["wrong"] = false;
			}
			User.login(user.email, user.password).then(function() {
				m.route.set("/welcome");
			}).catch(function() {
				m.route.set("/login");
			});
		}).catch(function(error) {
			showError = true;
			console.log(error);
			if(error.data) {
				for(key in error.data.data) {
					errors[key]["wrong"] = true;
					errors[key]["value"] = user[key];
					errors[key]["message"] = error.data.data[key]["message"];
				} 
			}
			m.redraw();
		})
	};

	return {
		view: function(vnode) {
			return (<Layout>
				<h1>Create Account</h1>
				{showError && (
					<div class="card-panel red accent-1"><span class="material-icons outlined">error</span>&nbsp; There was an error signing up. {errors.email.message.length > 0 && ("Email: " + errors.email.message)} {errors.password.message.length > 0 && ("Password: " + errors.password.message)}</div>
				)}
				<div class="row">
					<form class="col s12" onsubmit={register}>
						<EmailInput 
							label="Email (used for essential communication only, such as a password reset)" 
							value={user.email} 
							oninput={v => user.email = v}
							validate={v => !(errors.email.wrong && errors.email.value == v)}
							dataError={errors.email.message} />
						<PasswordInput 
							label="Password" 
							value={user.password} 
							oninput={v => user.password = v} 
							helperText="Must be at least 8 characters long"
							validate={v => !(errors.password.wrong && errors.password.value == v)}
							dataError={errors.password.message} />
						<PasswordInput 
							label="Confirm Password" 
							value={user.passwordConfirm} 
							oninput={v => user.passwordConfirm = v} 
							helperText="Confirm password by typing it again" 
							dataError="Passwords don't match, please write it exactly the same"
							validate={v => v == user.password && !(errors.passwordConfirm.wrong && errors.passwordConfirm.value == v)} />
						<button class="btn waves-effect waves-light" type="submit">Register</button>
					</form>
					<p class="col s12">Already have an account? <m.route.Link href="/login">Login</m.route.Link></p>
				</div>
			</Layout>);
		}
	};
})();