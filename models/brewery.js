// This is my model for brewery library data

var mongoose = require("mongoose");

var brewerySchema = new mongoose.Schema({ // creating a new Schema
	// name: String,
	// location: String,
	// city: String,
	// state: String

	location: String,
	name: String,
	beerType: String
});

var Brewery = mongoose.model("Brewery", brewerySchema); // creating a new Model

module.exports = Brewery;