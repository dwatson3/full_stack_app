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
var routeMiddleware = require('./middleware/routeHelper'); 

// setting and using our modules here
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
// express.static is the folder holding our CSS and JavaScript files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
// using loginMiddleware
app.use(loginMiddleware);

app.use(session({
	maxAge: 360000, // this lasts for an hour
	secret: 'illnevertell', // Dunno what this is doing
	name: "daphnes-chip" // Not sure why this is here
}));


// ROOT
app.get('/', function(req, res) {
	if (req.session && req.session.id) {
		db.User.findById(req.session.id, "username", function(err, user) {
			if (err) throw err;
			res.render("breweries/index", {user:user});
		});
	} else {
		res.render("breweries/index", {user:undefined});	
	}
});
// app.get('/', function(req, res) {
// 	// to limit the amount of data received, specify the id and username
// 	db.User.find(req.session.id, "username", function(err, user) {
// 		console.log(user);
// 		res.render('layout', {user:user});
// 	});
// });

// INDEX page
app.get('/breweries', function(req, res) {
	db.Brewery.find({}, function(err, breweries) {
		if (err) throw err;
			res.render("/", {brewery:brewery});
	});
});

// app.get('/search', function(req, res) {
// 	res.render("breweries/show");
// });


// app.get('/users/index', routeMiddleware.preventLoginSignup, function(request, response) {
// 	response.render('users/index');
// })

// User LOGIN page
app.get('/login', routeMiddleware.preventLoginSignup, function(request, response) {
	response.render('users/login');
});

// CREATE page for the LoggedIn User
app.post('/login', function(req, res) {
	db.User.authenticate(req.body.user, // something is wrong here with mongod/mongoose
		function (err, user) {
			if (!err && user !== null) {
				req.login(user);
				// response.redirect("/breweries");
					res.redirect('/');
			} else {
				console.log(err);
				// res.render('users/show', {err:err});
				res.render('breweries/index');
			}
	});
});

// User SIGNUP page
app.get('/signup', routeMiddleware.preventLoginSignup, function(req, res) {
	res.render('users/signup');
});

// User SIGNUP page to post information
app.post('/signup', function(req, res) {
	db.User.create(req.body.user, function(err, user) { // undefined is not a function, there's something wrong with this line. DUNNO
	// I'm not able to submit the signup username/password and redirect to the index page	
		if (user) {
			console.log(user);
			req.login(user);
			// res.redirect('/breweries')
			res.redirect('search'); // putting the root route here because it goes straight to layout
		} else {
			console.log(err);
			res.render('errors/404');
		}
	});
});

// LOGOUT route info page
app.get('/logout', function(req, res) {	
	req.logout();
	res.redirect("/");
});

// Where do I pass in my data for Geocoding API over HTTP?
// link is a generic http://maps.googleapis.com/maps/api/geocode/output?parameters

// MAIN INDEX for Page trying out server side
// The app.get API calls need to go to two different routes
// app.get('/breweries/index', function(req, res) {

// 	var url = 'http://api.brewerydb.com/v2/locations?key=' + process.env.BREWERY_SECRET;
// 		console.log(url);
// 			if(req.query.brewery) {
// 				request.get(url, function(error, response, body) {
// 					if (error) {
// 						console.log(error);
// 					} 
// 					else {
// 						var brewData = JSON.parse(body);
// 						res.render('breweries/index');
// 					}
// 				});
// 			}
// });

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



// INDEX
// placing my API call here
app.get('/search', function(req, res) {
	var breweryinfoDB = encodeURIComponent(req.query.location);
	// var url = 'http://api.brewerydb.com/v2/locations?key=' + process.env.BREWERY_SECRET;
	// var url = 'https://api.brewerydb.com/v2/locations?q=' + breweryinfoDB + '&key=' + process.env.BREWERY_SECRET + '&format=json';
	// using this query string to search by locality
	var url = 'https://api.brewerydb.com/v2/locations?p=1&withLocations=Y&locality=' + breweryinfoDB + '&key=' + process.env.BREWERY_SECRET + '&format=json';
		console.log(url);
			if(req.query.location) {
				request.get(url, function(error, response, body) {
					if (error) {
						console.log(error);
					} else {
						var brewData = JSON.parse(body);
						// console.log(brewData);
						console.log("about to render search");
						res.render('search', {brewData:brewData}); // the second one is the instance of the ...something? Not sure
				}
			});	
		}		
});


// CREATE
app.post('/breweries', function(req, res) {
	var brewery = new db.Brewery(req.body.brewery);
	brewery.save(function (err) {
		if (err) throw err;
			res.redirect('/');
	});
});

// SHOW
app.get('/breweries/:id', function(req, res) {
	db.Brewery.find(req.params.id, function(err, brewery) {
		if (err) throw err;
			res.render("breweries/show", {brewery:brewery});
	});
});



// UPDATE
app.put('/breweries/index', function(req, res) {
	db.Brewery.findById(req.params.id, function(err, brewery) {
		// brewery.save(function(err, brewery) {
			if (err) throw err;
			res.redirect('/');
		});
	// });
});



			// 	if (error) {
			// 		res.render('errors/404');
			// 	} else if (!error && response.statusCode === 200) {
			// 		res.send(body {"content-type":"application/json"});
			// 	} else {
			// 		res.render('errors/404');
			// 	}
		
// NOT SURE WHY THIS ISN'T WORKING
// 	var urlGoogle = encodeURI("https://maps.googleapis.com/maps/api/geocode/json?address=");
// 		request.get(urlGoogle, function(error, response, body) {
// 				var googleMapData = JSON.parse(body);
// 					if (error) {
// 						res.render('errors/404');
// 					} else if (!error && response.statusCode === 200) {
// 						res.send(body);
// 					}	else {
// 						res.render('errors/404');
// 					}		
// 		});			
// 		});

		// breweries.location 	= googleMapData.results[0].formatted_address;
// 		console.log(googleMapData.results[0].geometry.location.lat);

// 		//var lat = googleMapData.results[0].geometry.location.lat;
// 		//var long = googleMapData.results[0].geometry.location.lng;


// 	// Saving the breweries object to mongo
			
// // passing in the lat and long variables to the breweryDB API
// // so that you'll end up saving are the breweries information
// // use a get request to the API
// // look on the docs to see what q is, for ajax url parsing

// 	// NOT SURE WHY THIS ISN'T WORKING
// 	var searchUrl = "http://api.brewerydb.com/v2/search/geo/point";
	// 		// searchUrl.query = {type: "brewery", q: lat + long , key: process.env.BREWERY_SECRET};
	// 	searchUrl.query = {type: "brewery", q: lat + long};
	// 	searchUrl = url.format(searchUrl);
	// 		request.get(searchUrl, function(error, response, body) {
	// 			var breweryMap = JSON.parse(body);
	// 			if (error) {
	// 				res.render('errors/404');			
	// 			} else if (!error && response.statusCode != 200) {
	// 				res.end(body);
	// 			} else {
	// 				res.render('errors/404');
	// 			}
		// });	

	// breweries.save(function(err, breweries) {
	// 	if (err) throw err;
	// 		res.format({
	// 			'text/html': function() {
	// 				res.redirect('/breweries');
	// 			},
	// 			'application/json': function() {
	// 				console.log(breweries);
	// 				res.send(breweries);
	// 					//res.send(breweries);
	// 			},
	// 			'default': function() {
	// 				res.status(406).send('Not Acceptable');
	// 			}
	// 		});
	// 	}); 	


	// app.post('/breweries', function(req, res) {
	// 	});	

// CATCH ALL
app.get('*', function(req, res) {
	res.render('errors/404');
});

// SERVER LISTENER
app.listen(3000, function() {
	console.log("Server is listening on port 3000");
});


	// var searchUrl = "http://api.brewerydb.com/v2/search/"
	// 	searchUrl = url.parse(searchUrl); 
	// 	searchUrl.query = {type: "brewery", q: req.query.brewery.name, key: process.env.BREWERY_SECRET};
	// 	searchUrl = url.format(searchUrl)

	// send to the api
	// THIS IS A DUPLICATE
		// request.get(searchUrl, function(error, response, body) {
		// 	if (error) {
		// 		res.render('errors/404');

		// 	} else if (!error && response.statusCode != 200) {
		// 		res.render('errors/404');

		// 	} else if (!error && response.statusCode === 200) {
		// 		res.end(body, {"content-type":"application/json"});

		// 	} else {
		// 		res.render('errors/404');
		// 	}
		// });	

		// 	breweries.save(function(err, breweries) {
		// 		if (err) throw err;
		// 		res.format({
		// 			'text/html': function() {
		// 				res.render('/');
		// 			},
		// 			'application/json': function() {
		// 				console.log(breweries);
		// 				res.send(breweries);
		// 				//res.send(breweries);
		// 			},
		// 			'default': function() {
		// 				res.status(406).send('Not Acceptable');
		// 			}
		// 		});
		// 	}) 

// });

	// app.get('/brewery/new', function(req, res) {
	// var url = "http://api.brewerydb.com/v2/locations?key=" + process.env.BREWERY_SECRET +
	// console.log(req.query);

	// var geocodeUrl = "http://maps.googleapis.com/maps/api/geocode/json?address="
	// 	geocodeUrl= url.parse(geocodeUrl);
	// 	geocodeUrl.query = {type: "location", q: req.query.brewery.location, key: process.env.GEOCODE_SECRET};
	// 	geocodeUrl = url.format(geocodeUrl)

	// 	request.get(geocodeUrl, function(error, response, body) {
	// 		if (error) {
	// 			res.render('errors/404');

	// 		} else if (!error && response.statusCode != 200) {
	// 			res.render('errors/404');
			
	// 		} else if (!error && response.statusCode === 200) {
	// 			res.end(body)
	// 		} else {
	// 			res.render('errors/404');
	// 		} 
	// 	});	


		// Making an object out of breweries
		//var breweries = new db.Brewery(req.body.brewery);
		//var searchLocation = encodeURIComponent(breweries.location);
		// requesting location data from google geolocation api 
		// and replacing search address, lat & lng with google data
		// var searchLocation = "1075 E 20th St Chico, CA 95928";

		// request.get('https://maps.googleapis.com/maps/api/geocode/json?key='  + process.env.GEOCODE_SECRET + '&address=' + , function(err, response, body) {
			// var url = encodeURI("https://maps.googleapis.com/maps/api/geocode/json?key='  + process.env.GEOCODE_SECRET + '1075 E 20th Street Chico CA 95928'")
		// 	var url = encodeURI("https://maps.googleapis.com/maps/api/geocode/json?address=")
		// 	request.get(url,
		// 		function(error, response, body) {
		// 			console.log(body)
		// 		})
		// 	var googleMapData = JSON.parse(body);
		// 	breweries.location 	= googleMapData.results[0].formatted_address;
		// 	var lat = googleMapData.results[0].geometry.location.lat;
		// 	var long = googleMapData.results[0].geometry.location.lng;
		// // Saving the breweries object to mongo
			
		// 	// pass in the lat and long to the breweryDB
		// 	// so what you'll end up saving are the breweries information
		// 	// make a get request to the API
		// 	// look on the docs to see what q is, ajax url parsing
		// 	var searchUrl = "http://api.brewerydb.com/v2/search/geo/point"
		// 	searchUrl = url.parse(searchUrl); 
		// 	// searchUrl.query = {type: "brewery", q: lat + long , key: process.env.BREWERY_SECRET};
		// 	searchUrl.query = {type: "brewery", q: lat + long};
		// 	searchUrl = url.format(searchUrl)
		
		// request.get(searchUrl, function(error, response, body) {
		// 	if (error) {
		// 		res.render('errors/404');			
		// 	} else if (!error && response.statusCode != 200) {
		// 		res.end(body)
		// 	} else {
		// 		res.render('errors/404');
		// 	}

		// 	breweries.save(function(err, breweries) {
		// 		if (err) throw err;
		// 		res.format({
		// 			'text/html': function() {
		// 				res.redirect('/breweries');
		// 			},
		// 			'application/json': function() {
		// 				console.log(breweries);
		// 				res.send(breweries);
		// 				//res.send(breweries);
		// 			},
		// 			'default': function() {
		// 				res.status(406).send('Not Acceptable');
		// 			}
		// 		});
		// 	}) 	
		// });	


			// breweries.save(function(err, brewery) {
			// 	res.format({
			// 		'text/html': function() {
			// 		res.redirect('/breweries');
			// 	},
			// 		'application/json': function() {
			// 		res.send(brewery);
			// 	},
			// 		'default': function() {
			// 		res.status(406).send('Not Acceptable');
			// 	}
			// });
		// });
// });


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

