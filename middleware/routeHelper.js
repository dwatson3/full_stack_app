var db = require("../models");

var routeHelpers = {
	ensureLoggedIn: function(request, response, next) {
		if (request.session.id !== null && request.session.id !== undefined) {
			return next();
		}
		else {
			response.redirect('/login');
		}
	},

	// ensureCorrectUserForComment: function(request, response, next) {
	// }

	preventLoginSignup: function(request, response, next) {
		if (request.session.id !== null && request.session.id !== undefined) {
			response.redirect('/breweries/index');
		}
		else {
			return next();
		}
	}
};

module.exports = routeHelpers;