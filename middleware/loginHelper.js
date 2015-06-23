// NOT SURE IF I SHOULD HAVE CHANGED THE REQ/RES to REQUEST/RESPONSE

var db = require("../models");

var loginHelpers = function(request, response, next) {

	request.login = function(user) {
		request.session.id = user._id; // this is to remember the user and who is signed in
	};
	
	request.logout = function() {
		request.session.id = null;
		request.user = null // if the user is null, it needs to logout
	};

	next();	
};

module.exports = loginHelpers;