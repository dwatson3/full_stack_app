// This is my model for brewery library data

var mongoose = require("mongoose");

var brewerySchema = new mongoose.Schema({ // creating a new Schema
	// name: String,
	// location: String,
	// city: String,
	// state: String

// saving the breweryI_id in this model
// so that it will be easier to remember/retrieve in the database
	breweryDB_id: String,
	location: String,
	name: String,
	beerType: String
});

var Brewery = mongoose.model("Brewery", brewerySchema); // creating a new Model

module.exports = Brewery;