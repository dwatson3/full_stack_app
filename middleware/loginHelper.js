var db = require("../models");

var loginHelpers = function(req, res, next) {

	req.login = function(user) {
		req.session.id = user._id; // this is to remember the user and who is signed in
	};
	
	req.logout = function() {
		req.session.id = null;
		req.user = null // if the user is null, it needs to logout
	};

	next();	
};

module.exports = loginHelpers;