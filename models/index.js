// This is my Models INDEX page

var mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/brewfinder_app");

// I need to add my user file in here as well
module.exports.User = require("./user");
module.exports.Brewery = require("./brewery");