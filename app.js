// Let the show begin

// calling in the multiple modules 
var express = require("express");
var app = express();
var request = require('request');
var dotenv = require('dotenv').load(); // putting in the dotenv information

var bodyParser = require("body-parser");
var methodOverride = require('method-override');
var db = require('./models');
var session = require('cookie-session');
var url = require("url");

var morgan = require('morgan');
var loginMiddleware = require('./middleware/loginHelper');
var routeMiddleware = require('./middleware/routeHelper'); // why is this called routeMiddleware?


// I'm not sure if I should be changing the host and user info in the .env file?

// setting and using our modules here
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.static(__dirname + '/public')) // this is the folder holding our CSS and JavaScript files
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
	maxAge: 360000, // how long until the session expires, this is for an hour
	secret: 'illnevertell', // Dunno what this is doing
	name: "daphnes-chip" // Not sure why this is here
}));

// using loginMiddleware
app.use(loginMiddleware);
console.log(loginMiddleware);

// The first set of routes will be for New User, Logging in, and Edit on the index
// The search page is going to be my main page

// ROOT
app.get('/', function(request, response) {
	response.render('layout');
	// response.redirect('/breweries');
	// maybe res.redirect('/brewsearch') instead?
});

// User INDEX page
app.get('/users/index', routeMiddleware.preventLoginSignup, function(request, response) {
	response.render('users/index');
})

// User LOGIN page
// check to see if this is working?
app.get('/login', routeMiddleware.preventLoginSignup, function(request, response) {
	response.render('users/login');
})

// CREATE page for the LoggedIn User
// check to see if this is working?
app.post('/login', function(req, res) {
	db.User.authenticate(req.body.user, // something is wrong here with mongod/mongoose
		function (err, user) {
			if (!err && user !== null) {
				req.login(user);
				response.redirect("/breweries");
			} else {
				console.log(err)
				response.render('users/login', {err:err});
			}
	});
});

// User SIGNUP page
// check to see if this is working?
app.get('/signup', routeMiddleware.preventLoginSignup, function(request, response) {
	response.render('users/signup');
})

// User SIGNUP page to post information
app.post('/signup', function(request, response) {
	db.User.create(request.body.user, function(err, user) { // undefined is not a function, there's something wrong with this line. DUNNO
	// I'm not able to submit the signup username/password and redirect to the index page	
		if (user) {
			console.log(user)
			request.login(user)
			response.redirect('/breweries')
		} else {
			console.log(err)
			response.render('errors/404');
		}
	})
})

// LOGOUT route info page
app.get('/logout', function(request, response) {	
})

// // MAIN INDEX for Page, this works
// app.get('/breweries', function(request, response) {
// 	// not sure if Mongoose should be included in here?
// 	response.render("breweries/index");
// })


// MAIN INDEX for Page trying out server side
app.get('/breweries', function(req, res) {
	// var url = 'http://api.brewerydb.com/v2/locations?key=' + process.env.BREWERY_SECRET; 
	// var url = "http://api.brewerydb.com/v2/locations?key=" + process.env.BREWERY_SECRET + 
	console.log(req.query);
	var searchUrl = "http://api.brewerydb.com/v2/search"
		searchUrl = url.parse(searchUrl); 
		searchUrl.query = {type: "brewery", q: req.query.brewery.name, key: process.env.BREWERY_SECRET};
		searchUrl = url.format(searchUrl)	
		request.get(searchUrl, function(error, response, body) {
			if (error) {
				res.render('errors/404');

			} else if (!error && response.statusCode != 200) {
				res.render('errors/404');

			} else if (!error && response.statusCode === 200) {
				res.end(body, {"content-type":"application/json"});

			} else {
				res.render('errors/404');
			}
		});	
});

// NEW
// app.get('/breweries/new', function(req, res) {

// })

app.post('/breweries', function(req, res) {
	var breweries = new db.Brewery(req.body.brewery);
		breweries.save(function(err, brewery) {
			res.format({
				'text/html': function() {
					res.redirect('/breweries');
				},
				'application/json': function() {
					res.send(brewery);
				},
				'default': function() {
					res.status(406).send('Not Acceptable');
				}
			});
		});
});

// posting all of my search results data on the same page
// app.post('/breweries', function(req, res) {
// 	var url = "http://api.brewerydb.com/v2/locations?key=" + process.env.BREWERY_SECRET + 
// 		request.get(url,
// 			function(error, response, body) {
// 				if(error) {
// 					console.log(error)
// 				} 
// 				else {
// 					var breweryData = JSON.parse(body). // find the data in location to populate here
// 					res.render("breweries", {breweries:breweries});
// 					console.log(breweryData)
// 				} 
// 				// else {
// 				// 	res.render("breweries", {breweries:breweries});
// 				// }
// 			})
// 		res.render("breweries", {breweries: "Search Here"})
// })

// 		response.status(500).send("You got an error - " + error);
// 		} else if (!error && response.statusCode >= 300) {
// 			response.status(500).send("Something went wrong! Status: " + response.statusCode);
// 		}
// 		if (!error && response.statusCode === 200) {
// 			var brewData = JSON.parse(body);
// 			console.log(brewData);
// 			var brewDataResult = "Name: " + brewData.name + "<br>";
// 			response.send(brewDataResult); 
// 		}
// 	});
// });

// CATCH ALL
app.get('*', function(request, response) {
	response.render('errors/404');
});

// SERVER LISTENER
app.listen(3000, function() {
	"Server is listening on port 3000";
});


