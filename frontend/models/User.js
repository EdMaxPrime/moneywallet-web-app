const pb = require("../api")


/**
 * Get the user id for API operations
 * @return string
 */
const getId = function() {
	return pb.authStore.model.id;
}

/**
 * Get the user's email address if they are signed in.
 * @return string
 */
const getEmail = function() {
	return pb.authStore.model.email;
}

/**
 * True if the user is signed in
 * @return boolean
 */
const authenticated = function() {
	return pb.authStore.isValid;
}

/**
 * Check if the user has verified their email address
 * @return boolean
 */
const isVerified = function() {
	return pb.authStore.model.verified;
}

/**
 * Authenticate with email and password. Asynchronous. On failure, there will be
 * an error object with a message string.
 * 
 * @return Promise
 */
const login = function(email, password) {
	return pb.collection("users").authWithPassword(email, password);
}

const logout = function() {
	pb.authStore.clear();
}

/**
 * Creates a new user
 * @param user  an object with these properties:
 * - username
 * - email
 * - emailVisibility: boolean
 * - password
 * - passwordConfirm
 * - name
 * 
 * @return Promise succeeds when the user is created. Fails if the email is in
 * use or password isn't long enough
 */
const create = function(user) {
	return pb.collection('users').create(user);
}

module.exports = {
	getId: getId,
	getEmail: getEmail,
	login: login,
	logout: logout,
	create: create,
	authenticated: authenticated,
	isVerified: isVerified,
};