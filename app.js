// Let the shitshow begin

// calling in the multiple modules 
var express = require("express"),
app = express(),
request = require('request'),
dotenv = require('dotenv').load(), // putting in the dotenv information

bodyParser = require("body-parser"),
methodOverride = require('method-override'),
db = require('./models'),
session = require('cookie-session'),

morgan = require('morgan'),
loginMiddleware = require('./middleware/loginHelper'),
routeMiddleware = require('./middleware/routeHelper'); // why is this called routeMiddleware?


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

// db.connect({
// 	host: process.env.DB_HOST,
// 	username: process.env.DB_USER,
// 	password: process.env.DB_PASS,
// 	name: process.env.DB_NAME
// });

// using loginMiddleware
app.use(loginMiddleware);
console.log(loginMiddleware);

// The first set of routes will be for New User, Logging in, and Edit on the index
// The search page is going to be my main page

// ROOT
app.get('/', function(request, response) {
	response.redirect('/breweries');
	// maybe res.redirect('/brewsearch') instead?
});



// User INDEX page
app.get('/users/index', function(request, response) {
	// routeMiddleware.preventLoginSignup
	response.render('users/index');
})

// User LOGIN page
app.get('/login', function(request, response) {
	response.render('users/login');
})


// User SIGNUP page
app.get('/signup', function(request, response) {
	response.render('users/signup');
})

// // MAIN INDEX for Page, this works
// app.get('/breweries', function(request, response) {
// 	// not sure if Mongoose should be included in here?
// 	response.render("breweries/index");
// })

// MAIN INDEX for Page trying out server side
app.get('/breweries', function(req, res) {
	// var url = 'http://api.brewerydb.com/v2/styles?key=' + process.env.BREWERY_SECRET; 
	var url = "http://api.brewerydb.com/v2/styles?key=" + process.env.BREWERY_SECRET
		console.log(url);
			
		request.get(url, function(error, response, body) {
			console.log(response);
			if (error) {
				res.render('errors/404');

			} else if (!error && response.statusCode != 200) {
				res.render('errors/404');

			} else if (!error && response.statusCode === 200) {
				res.render('breweries/index', JSON.parse(body));

			} else {
				res.render('errors/404');
			}
		});	
});

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


