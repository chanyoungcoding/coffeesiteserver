const mongoose = require('mongoose');

const coffeeCountrySchema = new mongoose.Schema({
  name: String,
  country: String,
  taste: String,
  tasteName: String,
  beans:String,
  beansName: String
})

const CoffeeCountry = mongoose.model('CoffeeCountry', coffeeCountrySchema);

module.exports = CoffeeCountry;